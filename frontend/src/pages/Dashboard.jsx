import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Brain, MessageSquare,
  TrendingUp, Zap, ArrowRight, Activity,
  CheckCircle, Clock, Star,
} from 'lucide-react';

const STAT_CARDS = [
  {
    label: 'Active Jobs',
    value: '12',
    change: '+3 this week',
    Icon: Briefcase,
    gradient: 'from-brand-600 to-brand-400',
    glow: 'shadow-glow-blue',
  },
  {
    label: 'Candidates',
    value: '48',
    change: '+11 this week',
    Icon: Users,
    gradient: 'from-purple-600 to-purple-400',
    glow: 'shadow-glow-purple',
  },
  {
    label: 'AI Matches Run',
    value: '134',
    change: '+22 today',
    Icon: Brain,
    gradient: 'from-emerald-600 to-emerald-400',
    glow: 'shadow-glow-green',
  },
  {
    label: 'Interviews Sent',
    value: '27',
    change: '+5 today',
    Icon: MessageSquare,
    gradient: 'from-orange-600 to-orange-400',
    glow: '',
  },
];

const QUICK_ACTIONS = [
  { to: '/jobs',       label: 'Post a Job',          Icon: Briefcase,     desc: 'Create new job openings' },
  { to: '/candidates', label: 'Upload Resume',        Icon: Users,         desc: 'Ingest candidate profiles' },
  { to: '/matching',   label: 'Run AI Evaluation',   Icon: Brain,         desc: 'Match candidates to roles' },
  { to: '/interviews', label: 'Schedule Interview',  Icon: MessageSquare, desc: 'Generate questions & notify' },
];

const RECENT_ACTIVITY = [
  { icon: CheckCircle, color: 'text-emerald-400', text: 'Sarah Chen shortlisted for Senior Engineer', time: '2m ago' },
  { icon: Brain,       color: 'text-brand-400',   text: 'AI matched 3 candidates to "ML Engineer" role', time: '8m ago' },
  { icon: Users,       color: 'text-purple-400',  text: 'Resume uploaded: Marcus Johnson (Data Scientist)', time: '15m ago' },
  { icon: Briefcase,   color: 'text-yellow-400',  text: 'New job posted: "Frontend Engineer – React"', time: '1h ago' },
  { icon: MessageSquare, color: 'text-pink-400',  text: 'Interview questions generated for Alex Kim', time: '2h ago' },
  { icon: Star,        color: 'text-orange-400',  text: 'Top match: 91/100 score for DevOps role', time: '3h ago' },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in space-y-10">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl p-10"
               style={{ background: 'linear-gradient(135deg, #0d0d2b 0%, #13132e 60%, #0a0a1a 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl
                        bg-gradient-to-br from-brand-500 to-purple-600 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-15 blur-3xl
                        bg-gradient-to-br from-purple-600 to-pink-500 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">
              AI-Powered Recruitment
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            <span className="gradient-text">Hire Smarter.</span>
            <br />
            <span className="text-white">Move Faster.</span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-lg">
            AgenticHire uses AI-driven RAG pipelines to match candidates to roles, generate
            personalised interview questions, and automate recruiter workflows — all in one dashboard.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/matching" className="btn-primary">
              <Brain className="w-4 h-4" /> Run AI Match
            </Link>
            <Link to="/jobs" className="btn-secondary">
              <Briefcase className="w-4 h-4" /> Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, change, Icon, gradient, glow }) => (
            <div key={label} className={`glass-card p-5 hover:${glow} transition-all duration-300`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400 opacity-60" />
              </div>
              <p className="text-3xl font-black text-white mb-1">{value}</p>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="text-xs text-emerald-400 mt-2 font-medium">{change}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Actions + Activity ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="section-title flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-400" /> Quick Actions
          </h2>
          <p className="section-sub">Jump into any workflow</p>
          <div className="space-y-3">
            {QUICK_ACTIONS.map(({ to, label, Icon, desc }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/3 border border-white/8
                           hover:bg-white/6 hover:border-white/15 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/25
                                flex items-center justify-center flex-shrink-0
                                group-hover:bg-brand-500/25 transition-colors">
                  <Icon className="w-4 h-4 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400
                                       group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 glass-card p-6">
          <h2 className="section-title flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" /> Recent Activity
          </h2>
          <p className="section-sub">Live recruiter workflow feed</p>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map(({ icon: Icon, color, text, time }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors group"
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                <p className="flex-1 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {text}
                </p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span className="text-xs text-slate-600 whitespace-nowrap">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
