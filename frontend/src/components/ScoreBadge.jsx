import { useEffect, useRef } from 'react';

/**
 * Animated circular score badge (0-100).
 * Color: red (<40) → yellow (40-70) → green (>70)
 */
export default function ScoreBadge({ score = 0, size = 140 }) {
  const circleRef = useRef(null);
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ≈ 264

  const clampedScore = Math.min(100, Math.max(0, score));
  const dashOffset = circumference - (clampedScore / 100) * circumference;

  // Color based on score
  let ringColor, glowClass, label;
  if (clampedScore >= 75) {
    ringColor = '#34d399'; glowClass = 'shadow-glow-green'; label = 'Excellent';
  } else if (clampedScore >= 50) {
    ringColor = '#fbbf24'; glowClass = ''; label = 'Good';
  } else if (clampedScore >= 30) {
    ringColor = '#f97316'; glowClass = ''; label = 'Fair';
  } else {
    ringColor = '#f87171'; glowClass = 'shadow-glow-red'; label = 'Poor';
  }

  // Animate stroke on mount
  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
    // Start from full offset (empty), then animate to target
    el.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.strokeDashoffset = dashOffset;
      });
    });
  }, [score, dashOffset, circumference]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative rounded-full ${glowClass} transition-all duration-500`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            ref={circleRef}
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white leading-none">{clampedScore}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">/ 100</span>
        </div>
      </div>
      <span
        className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
        style={{ color: ringColor, background: `${ringColor}22`, border: `1px solid ${ringColor}44` }}
      >
        {label}
      </span>
    </div>
  );
}
