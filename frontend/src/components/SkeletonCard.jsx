/** Shimmer skeleton card placeholder */
export default function SkeletonCard({ rows = 3, className = '' }) {
  return (
    <div className={`glass-card p-5 animate-fade-in ${className}`}>
      <div className="space-y-3">
        <div className="shimmer h-4 w-1/3 rounded-lg bg-white/5" />
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="shimmer h-3 rounded-lg bg-white/5"
            style={{ width: `${85 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}
