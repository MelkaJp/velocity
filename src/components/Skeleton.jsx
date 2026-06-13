import './Skeleton.css';

export function Skeleton({ width, height, borderRadius, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius || '8px',
      }}
    />
  );
}

export function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <Skeleton width="48px" height="48px" borderRadius="12px" />
          <div className="skeleton-card-body">
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="12px" />
          </div>
        </div>
      ))}
    </>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="skeleton-table-row">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} height="14px" width={`${40 + Math.random() * 40}%`} />
          ))}
        </div>
      ))}
    </div>
  );
}
