import { useState, useEffect } from 'react';
import {
  MessageSquare, Sparkles, Loader2, Send, CheckCircle,
  User, Mail, Tag, ChevronRight, X,
} from 'lucide-react';
import TagInput from '../components/TagInput';
import SkeletonCard from '../components/SkeletonCard';
import { ToastContainer, useToast } from '../components/Toast';
import { interviewsApi, candidatesApi } from '../services/api';

/** Email preview modal */
function EmailModal({ candidate, status, message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-card w-full max-w-lg p-6 animate-slide-up border border-white/15">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-slate-100">Email Preview</h3>
            <span className="badge-blue text-[10px]">Simulated</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email card */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {/* Email header bar */}
          <div className="bg-white/5 px-4 py-3 border-b border-white/8 space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 w-8">To:</span>
              <span className="text-slate-300">{candidate?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 w-8">From:</span>
              <span className="text-slate-300">recruiter@agentichire.ai</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 w-8">Re:</span>
              <span className="text-slate-300 font-medium">
                Your Application Update — Status: {status}
              </span>
            </div>
          </div>
          {/* Body */}
          <div className="px-4 py-4">
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
              {message || `Dear ${candidate?.name},\n\nWe're pleased to update your application status to "${status}".\n\nBest regards,\nAgenticHire Recruitment Team`}
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary py-2 px-5 text-sm">Close</button>
          <button
            onClick={onClose}
            className="btn-primary py-2 px-5 text-sm"
          >
            <CheckCircle className="w-4 h-4" /> Notification Sent ✓
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Interviews() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [missingSkills, setMissingSkills] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  const selectedCandidate = candidates.find((c) => String(c.id) === String(selectedCandidateId));

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

  const handleGenerate = async () => {
    if (!selectedCandidateId || !jobDescription.trim()) {
      addToast({ type: 'warning', title: 'Missing Fields', message: 'Select a candidate and enter a job description.' });
      return;
    }
    setGenerating(true);
    setQuestions([]);
    try {
      const data = await interviewsApi.generateQuestions({
        candidate_id: selectedCandidateId,
        job_description: jobDescription,
        missing_skills: missingSkills,
      });
      // Handle various response shapes
      const qs = data?.questions ?? data?.interview_questions ?? data ?? [];
      setQuestions(Array.isArray(qs) ? qs : [String(qs)]);
      addToast({ type: 'success', title: 'Questions Generated', message: `${Array.isArray(qs) ? qs.length : 1} questions ready.` });
    } catch (err) {
      addToast({ type: 'error', title: 'Generation Failed', message: err.message });
    } finally {
      setGenerating(false);
    }
  };

  const handleShortlistAndNotify = async () => {
    if (!selectedCandidateId || !selectedCandidate?.email) {
      addToast({ type: 'warning', title: 'Select Candidate', message: 'Please select a candidate first.' });
      return;
    }
    setNotifying(true);
    try {
      // 1. Update status to Shortlisted
      await candidatesApi.updateStatus(selectedCandidateId, 'Shortlisted');
      // 2. Send notification
      await interviewsApi.notify({
        candidate_email: selectedCandidate.email,
        status: 'Shortlisted',
        message: customMessage || undefined,
      });
      setShowEmailModal(true);
      addToast({ type: 'success', title: 'Shortlisted!', message: `${selectedCandidate.name} notified.` });
    } catch (err) {
      addToast({ type: 'error', title: 'Notify Failed', message: err.message });
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {showEmailModal && (
        <EmailModal
          candidate={selectedCandidate}
          status="Shortlisted"
          message={customMessage}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center"
               style={{ boxShadow: '0 0 20px rgba(249,115,22,0.4)' }}>
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          Interviews & Notifications
        </h1>
        <p className="text-slate-400 mt-2">Generate tailored interview questions and notify shortlisted candidates.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* ── Left: Setup Panel ────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">
          <div className="glass-card p-6 space-y-5">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" /> Interview Setup
              </h2>
              <p className="section-sub">Configure the candidate and role context.</p>
            </div>

            {/* Candidate */}
            <div>
              <label className="form-label">Candidate *</label>
              {loadingCandidates ? (
                <SkeletonCard rows={1} />
              ) : (
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="" className="bg-surface-800">— Select candidate —</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id} className="bg-surface-800 text-slate-200">
                      {c.name} · {c.email}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selected candidate info */}
            {selectedCandidate && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8 animate-fade-in">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center text-sm font-bold text-white">
                  {selectedCandidate.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{selectedCandidate.name}</p>
                  <p className="text-xs text-slate-500">{selectedCandidate.email}</p>
                </div>
              </div>
            )}

            {/* Job description */}
            <div>
              <label className="form-label">Job Description *</label>
              <textarea
                className="textarea-field"
                rows={5}
                placeholder="Paste the job description to tailor interview questions…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Missing skills */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Missing Skills (from AI Match)
              </label>
              <TagInput
                tags={missingSkills}
                onChange={setMissingSkills}
                placeholder="Add skills to probe in interview…"
              />
              <p className="text-[11px] text-slate-600 mt-1.5">Pre-fill from AI Matching tab or add manually</p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !selectedCandidateId || !jobDescription.trim()}
              className="btn-primary w-full justify-center"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? 'Generating…' : 'Generate Questions'}
            </button>
          </div>

          {/* Notification panel */}
          <div className="glass-card p-6 space-y-4 border border-orange-500/15">
            <h2 className="section-title flex items-center gap-2">
              <Send className="w-5 h-5 text-orange-400" /> Shortlist & Notify
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mark the candidate as Shortlisted and send a simulated email notification.
            </p>
            <div>
              <label className="form-label">Custom Message (optional)</label>
              <textarea
                className="textarea-field"
                rows={4}
                placeholder="Congratulations! We're pleased to invite you for the next round…"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
            <button
              onClick={handleShortlistAndNotify}
              disabled={notifying || !selectedCandidateId}
              className="btn-primary w-full justify-center"
              style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
            >
              {notifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {notifying ? 'Sending…' : 'Shortlist & Send Email'}
            </button>
          </div>
        </div>

        {/* ── Right: Questions Panel ───────────────────────────────────────── */}
        <div className="xl:col-span-3">
          <h2 className="section-title mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-400" /> Interview Questions
          </h2>
          <p className="section-sub">AI-generated questions tailored to the candidate and role.</p>

          {generating && (
            <div className="glass-card p-8 text-center space-y-4 animate-pulse-glow">
              <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-sm">AI is crafting personalised questions…</p>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} rows={2} />)}
              </div>
            </div>
          )}

          {!generating && questions.length === 0 && (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/8
                              flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-slate-700" />
              </div>
              <p className="text-slate-400 font-medium">No questions yet</p>
              <p className="text-sm text-slate-600 mt-2 max-w-xs">
                Select a candidate, add the job description, then generate AI interview questions.
              </p>
            </div>
          )}

          {!generating && questions.length > 0 && (
            <div className="space-y-3 animate-slide-up">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="glass-card p-5 flex gap-4 hover:border-orange-500/25 transition-all duration-200"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30
                                  flex items-center justify-center text-xs font-bold text-orange-400">
                    {i + 1}
                  </div>
                  {/* Question text */}
                  <div className="flex-1">
                    <p className="text-sm text-slate-300 leading-relaxed">{q}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
              ))}

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-600">
                  {questions.length} tailored question{questions.length !== 1 ? 's' : ''} generated by AI
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
