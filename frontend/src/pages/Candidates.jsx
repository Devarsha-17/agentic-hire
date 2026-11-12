import { useState, useEffect } from 'react';
import { Users, Upload, UserPlus, Loader2, Mail, CheckCircle, XCircle, Clock, MoreHorizontal } from 'lucide-react';
import FileDropZone from '../components/FileDropZone';
import SkeletonCard from '../components/SkeletonCard';
import { ToastContainer, useToast } from '../components/Toast';
import { candidatesApi } from '../services/api';

const STATUS_OPTIONS = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];

const STATUS_BADGE = {
  Applied:       'badge-blue',
  'Under Review':'badge-yellow',
  Shortlisted:   'badge-green',
  Rejected:      'badge-red',
  Hired:         'badge-purple',
};

const INITIAL_FORM = { name: '', email: '', parsed_resume_text: '' };

function CandidateRow({ candidate, onStatusChange, onError }) {
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(candidate.status || 'Applied');

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await candidatesApi.updateStatus(candidate.id, newStatus);
      setStatus(newStatus);
      onStatusChange?.();
    } catch (err) {
      onError?.(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/8
                    hover:bg-white/5 hover:border-white/15 transition-all duration-200 group">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-purple-600
                      flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
        {candidate.name?.charAt(0).toUpperCase() ?? '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-100 truncate">{candidate.name}</p>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          <Mail className="w-3 h-3" /> {candidate.email}
        </p>
      </div>

      {/* Status dropdown */}
      <div className="flex items-center gap-2">
        {updating ? (
          <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
        ) : (
          <select
            value={status}
            onChange={(e) => handleStatus(e.target.value)}
            className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5
                       text-slate-300 focus:outline-none focus:border-brand-500/60
                       cursor-pointer transition-colors hover:bg-white/8"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-surface-800 text-slate-200">{s}</option>
            ))}
          </select>
        )}
        <span className={STATUS_BADGE[status] ?? 'badge-gray'}>{status}</span>
      </div>
    </div>
  );
}

export default function Candidates() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  const fetchCandidates = async () => {
    try {
      setLoadingCandidates(true);
      const data = await candidatesApi.list();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Could Not Load Candidates',
        message: err.message || 'The backend could not return candidates.',
      });
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  /* Handle file selection → auto-upload & parse */
  const handleFile = async (f) => {
    setFile(f);
    if (!f) {
      setForm((prev) => ({ ...prev, parsed_resume_text: '' }));
      return;
    }
    setUploading(true);
    try {
      const result = await candidatesApi.uploadResume(f);
      const parsedText = result?.parsed_resume_text?.trim();
      if (!parsedText) {
        throw new Error('No readable text was found in the uploaded PDF.');
      }
      setForm((prev) => ({
        ...prev,
        parsed_resume_text: parsedText,
      }));
      addToast({ type: 'success', title: 'Resume Parsed', message: 'Text extracted successfully.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Parse Failed', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.parsed_resume_text.trim()) {
      addToast({
        type: 'warning',
        title: 'Required Fields',
        message: 'Name, email, and parsed resume text are required.',
      });
      return;
    }
    setSubmitting(true);
    try {
      await candidatesApi.create(form);
      addToast({ type: 'success', title: 'Candidate Added', message: `${form.name} ingested into the system.` });
      setForm(INITIAL_FORM);
      setFile(null);
      fetchCandidates();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-glow-purple">
            <Users className="w-5 h-5 text-white" />
          </div>
          Candidate Ingestion
        </h1>
        <p className="text-slate-400 mt-2">Upload resumes, build candidate profiles, and manage pipeline status.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* ── Upload Form ──────────────────────────────────────────────────── */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 sticky top-24">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" /> Add Candidate
              </h2>
              <p className="section-sub">Upload a PDF resume to auto-populate the profile.</p>
            </div>

            {/* Drop zone */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Resume PDF
              </label>
              <FileDropZone
                accept=".pdf"
                onFile={handleFile}
                file={file}
                loading={uploading}
              />
            </div>

            <div className="divider" />

            <div>
              <label className="form-label">Full Name *</label>
              <input
                className="input-field"
                placeholder="e.g. Sarah Chen"
                value={form.name}
                onChange={set('name')}
              />
            </div>

            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="input-field"
                placeholder="sarah@example.com"
                value={form.email}
                onChange={set('email')}
              />
            </div>

            <div>
              <label className="form-label">Parsed Resume Text</label>
              <textarea
                className="textarea-field text-xs leading-relaxed"
                rows={6}
                placeholder="Auto-populated after upload, or paste manually…"
                value={form.parsed_resume_text}
                onChange={set('parsed_resume_text')}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={submitting || uploading}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {submitting ? 'Saving…' : 'Ingest Candidate'}
            </button>
          </form>
        </div>

        {/* ── Candidate List ───────────────────────────────────────────────── */}
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Candidate Pipeline</h2>
              <p className="text-sm text-slate-500">{candidates.length} candidate{candidates.length !== 1 ? 's' : ''} in system</p>
            </div>
            <button onClick={fetchCandidates} className="btn-secondary py-2 px-4 text-xs">
              Refresh
            </button>
          </div>

          {loadingCandidates ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} rows={2} />)}
            </div>
          ) : candidates.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No candidates yet</p>
              <p className="text-sm text-slate-600 mt-1">Upload a resume to get started.</p>
            </div>
          ) : (
            <div className="glass-card p-4 space-y-2">
              {candidates.map((c) => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  onStatusChange={fetchCandidates}
                  onError={(err) => addToast({
                    type: 'error',
                    title: 'Could Not Update Status',
                    message: err.message || 'The candidate status could not be updated.',
                  })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
