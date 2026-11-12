import { useState, useEffect } from 'react';
import { Briefcase, Plus, Loader2, Clock, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import TagInput from '../components/TagInput';
import SkeletonCard from '../components/SkeletonCard';
import { ToastContainer, useToast } from '../components/Toast';
import { jobsApi } from '../services/api';

const INITIAL_FORM = {
  title: '',
  description: '',
  required_skills: [],
  minimum_experience_years: '',
};

function JobCard({ job, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="glass-card p-5 animate-slide-up hover:border-white/20 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
            <h3 className="text-base font-bold text-slate-100 truncate">{job.title}</h3>
            <span className="badge-green text-[10px]">Active</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.minimum_experience_years}+ yrs exp required
            </span>
            {job.id && (
              <span className="font-mono text-slate-600">#{job.id.toString().slice(0, 8)}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/8 space-y-3 animate-fade-in">
          <p className="text-sm text-slate-400 leading-relaxed">{job.description}</p>
          {job.required_skills?.length > 0 && (
            <div>
              <p className="form-label flex items-center gap-1.5 mb-2">
                <Tag className="w-3 h-3" /> Required Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {job.required_skills.map((s) => (
                  <span key={s} className="badge-blue text-[11px]">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Jobs() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  /* Fetch jobs on mount */
  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await jobsApi.list();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Could Not Load Jobs',
        message: err.message || 'The backend could not return jobs.',
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      addToast({ type: 'warning', title: 'Validation Error', message: 'Title and description are required.' });
      return;
    }
    setSubmitting(true);
    try {
      await jobsApi.create({
        ...form,
        minimum_experience_years: Number(form.minimum_experience_years) || 0,
      });
      addToast({ type: 'success', title: 'Job Posted!', message: `"${form.title}" is now live.` });
      setForm(INITIAL_FORM);
      fetchJobs();
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to Post', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-glow-blue">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          Job Management
        </h1>
        <p className="text-slate-400 mt-2 ml-13">Post new openings and manage active jobs.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* ── Create Job Form ──────────────────────────────────────────────── */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 sticky top-24">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-400" /> New Job Posting
              </h2>
              <p className="section-sub">Fill out the form to publish an opening.</p>
            </div>

            <div>
              <label className="form-label">Job Title *</label>
              <input
                className="input-field"
                placeholder="e.g. Senior Backend Engineer"
                value={form.title}
                onChange={(e) => set('title')(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Job Description *</label>
              <textarea
                className="textarea-field"
                rows={5}
                placeholder="Describe the role, responsibilities, and team…"
                value={form.description}
                onChange={(e) => set('description')(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Required Skills</label>
              <TagInput
                tags={form.required_skills}
                onChange={set('required_skills')}
                placeholder="Python, FastAPI, Docker…"
              />
              <p className="text-[11px] text-slate-600 mt-1.5">Press Enter or comma to add a tag</p>
            </div>

            <div>
              <label className="form-label">Minimum Experience (years)</label>
              <input
                type="number"
                min="0"
                max="30"
                className="input-field"
                placeholder="e.g. 3"
                value={form.minimum_experience_years}
                onChange={(e) => set('minimum_experience_years')(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {submitting ? 'Publishing…' : 'Publish Job'}
            </button>
          </form>
        </div>

        {/* ── Job Listings ─────────────────────────────────────────────────── */}
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Active Openings</h2>
              <p className="text-sm text-slate-500">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
            </div>
            <button onClick={fetchJobs} className="btn-secondary py-2 px-4 text-xs">
              Refresh
            </button>
          </div>

          {loadingJobs ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} rows={3} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No jobs posted yet</p>
              <p className="text-sm text-slate-600 mt-1">Use the form to create your first opening.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, i) => <JobCard key={job.id ?? i} job={job} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
