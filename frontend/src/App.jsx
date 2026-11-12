import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard  from './pages/Dashboard';
import Jobs       from './pages/Jobs';
import Candidates from './pages/Candidates';
import Matching   from './pages/Matching';
import Interviews from './pages/Interviews';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#0a0a1a' }}>
        <Navbar />

        {/* Main content — offset for fixed navbar */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/jobs"        element={<Jobs />} />
            <Route path="/candidates"  element={<Candidates />} />
            <Route path="/matching"    element={<Matching />} />
            <Route path="/interviews"  element={<Interviews />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-6 mt-8"
                style={{ background: 'rgba(10,10,26,0.8)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <p className="text-xs text-slate-600">
              © 2024 AgenticHire · AI-Powered Recruitment Platform
            </p>
            <p className="text-xs text-slate-600">
              Backend: <span className="text-brand-500/60">http://127.0.0.1:8000</span>
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
