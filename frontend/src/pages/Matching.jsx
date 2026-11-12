import { useState, useEffect } from 'react';
import { Brain, Sparkles, Loader2, CheckCircle, AlertCircle, User, FileText } from 'lucide-react';
import ScoreBadge from '../components/ScoreBadge';
import SkeletonCard from '../components/SkeletonCard';
import { ToastContainer, useToast } from '../components/Toast';
import { matchingApi, candidatesApi } from '../services/api';

export default function Matching() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    candidatesApi.list()
      .then((data) => setCandidates(Array.isArray(data) ? data : []))
      .catch((err) => {
        addToast({
          type: 'error',
          title: 'Could Not Load Candidates',
          message: err.message || 'The backend could not return candidates.',
        });
      })
      .finally(() => setLoadingCandidates(false));
  }, []);

  const handleEvaluate = async () => {
    if (!selectedCandidate || !jobDescription.trim()) {
      addToast({ type: 'warning', title: 'Missing Fields', message: 'Select a candidate and enter a job description.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await matchingApi.evaluate({
        candidate_id: selectedCandidate,
        job_description: jobDescription,
      });
      setResult(data);
    } catch (err) {
      addToast({ type: 'error', title: 'Evaluation Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center shadow-glow-green">
            <Brain className="w-5 h-5 text-white" />
          </div>
          AI RAG Matching
        </h1>
        <p className="text-slate-400 mt-2">Evaluate candidate-job fit using AI-powered vector search and reasoning.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ── Left: Input Panel ────────────────────────────────────────────── */}
        <div className="glass-card p-6 space-y-6">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <User className="w-5 h-5 text-brand-400" /> Evaluation Setup
            </h2>
            <p className="section-sub">Select a candidate and provide the job details.</p>
          </div>

          {/* Candidate select */}
          <div>
            <label className="form-label">Select Candidate *</label>
            {loadingCandidates ? (
              <SkeletonCard rows={1} className="h-12" />
            ) : (
              <select
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="" className="bg-surface-800">— Choose a candidate —</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id} className="bg-surface-800 text-slate-200">
                    {c.name} · {c.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Job description */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Job Description *
            </label>
            <textarea
              className="textarea-field"
              rows={10}
              placeholder="Paste the full job description here. Include role responsibilities, required skills, and team context for best AI results…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleEvaluate}
            disabled={loading || !selectedCandidate || !jobDescription.trim()}
            className="btn-primary w-full justify-center text-base py-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Evaluating with AI…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Evaluate Match
              </>
            )}
          </button>
        </div>

        {/* ── Right: Results Panel ─────────────────────────────────────────── */}
        <div>
          {loading && (
            <div className="glass-card p-8 space-y-6 animate-pulse-glow">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                <p className="text-slate-400 text-sm">AI is evaluating the match…</p>
                <p className="text-xs text-slate-600">Running RAG pipeline · Scoring resume · Generating reasoning</p>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} rows={2} />)}
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="glass-card p-12 h-full flex flex-col items-center justify-center text-center min-h-[480px]">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/10 to-purple-600/10
                              border border-white/5 flex items-center justify-center mb-6">
                <Brain className="w-10 h-10 text-slate-700" />
              </div>
              <p className="text-slate-400 font-medium text-lg">Ready to Evaluate</p>
              <p className="text-sm text-slate-600 mt-2 max-w-xs">
                Select a candidate and enter a job description, then click "Evaluate Match" to run the AI pipeline.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4 animate-slide-up">

              {/* Score card */}
              <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6">
                <ScoreBadge score={result.suitability_score ?? 0} size={140} />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Suitability Score</p>
                  <p className="text-2xl font-black text-white mb-2">{result.suitability_score ?? 0} / 100</p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {result.suitability_score >= 75
                      ? 'Excellent fit — strong candidate for this role.'
                      : result.suitability_score >= 50
                      ? 'Good potential — worth a deeper look.'
                      : result.suitability_score >= 30
                      ? 'Partial match — some gaps identified.'
                      : 'Low match — significant skill gaps present.'}
                  </p>
                </div>
              </div>

              {/* Reasoning */}
              {result.reasoning && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-brand-400" /> AI Reasoning
                  </h3>
                  <div className="ai-prose text-sm text-slate-400 leading-relaxed">
                    {result.reasoning.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Key Strengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.strengths.map((s, i) => (
                      <span key={i} className="badge-green text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing skills */}
              {result.missing_skills?.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-red-400" /> Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((s, i) => (
                      <span key={i} className="badge-red text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
