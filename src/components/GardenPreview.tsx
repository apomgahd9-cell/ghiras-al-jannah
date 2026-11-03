interface GardenPreviewProps {
  progress: number;
}

export function GardenPreview({ progress }: GardenPreviewProps) {
  const trees = Math.min(Math.floor(progress / 20), 5);
  const flowers = Math.min(Math.floor(progress / 15), 6);
  const showFountain = progress >= 50;

  return (
    <svg viewBox="0 0 320 140" className="w-full h-auto" role="img" aria-label="معاينة الحديقة">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#052e16" />
        </linearGradient>
      </defs>

      <rect width="320" height="90" fill="url(#skyGrad)" rx="12" />
      <rect y="90" width="320" height="50" fill="url(#groundGrad)" rx="12" />

      {/* Stone path */}
      {progress > 0 && (
        <g opacity="0.4">
          <ellipse cx="60" cy="120" rx="12" ry="4" fill="#a8a29e" />
          <ellipse cx="100" cy="125" rx="10" ry="3.5" fill="#a8a29e" />
          <ellipse cx="140" cy="120" rx="12" ry="4" fill="#a8a29e" />
          <ellipse cx="180" cy="125" rx="10" ry="3.5" fill="#a8a29e" />
          <ellipse cx="220" cy="120" rx="11" ry="4" fill="#a8a29e" />
        </g>
      )}

      {/* Trees */}
      {Array.from({ length: trees }).map((_, i) => {
        const x = 30 + i * 55;
        return (
          <g key={`tree-${i}`} className="animate-sway" style={{ transformOrigin: `${x}px 110px`, animationDelay: `${i * 0.5}s` }}>
            <rect x={x - 3} y="100" width="6" height="15" fill="#854d0e" rx="1" />
            <circle cx={x} cy="92" r="16" fill="#16a34a" />
            <circle cx={x - 8} cy="96" r="10" fill="#15803d" />
            <circle cx={x + 8} cy="96" r="10" fill="#15803d" />
            <circle cx={x} cy="86" r="10" fill="#22c55e" />
          </g>
        );
      })}

      {/* Flowers */}
      {Array.from({ length: flowers }).map((_, i) => {
        const x = 45 + i * 42;
        const y = 118;
        const colors = ['#facc15', '#f472b6', '#fb923c', '#facc15', '#fde047', '#f472b6'];
        return (
          <g key={`flower-${i}`}>
            <line x1={x} y1={y} x2={x} y2={y - 8} stroke="#16a34a" strokeWidth="1.5" />
            <circle cx={x} cy={y - 9} r="3.5" fill={colors[i]} />
            <circle cx={x} cy={y - 9} r="1.2" fill="#854d0e" />
          </g>
        );
      })}

      {/* Fountain */}
      {showFountain && (
        <g>
          <ellipse cx="280" cy="115" rx="18" ry="7" fill="#0e7490" opacity="0.6" />
          <ellipse cx="280" cy="113" rx="14" ry="5" fill="#22d3ee" opacity="0.4" />
          <path d="M280 110 Q278 100 280 95 Q282 100 280 110" fill="#22d3ee" opacity="0.5" className="animate-pulse-soft" />
        </g>
      )}

      {/* Empty state */}
      {progress === 0 && (
        <text x="160" y="70" textAnchor="middle" fill="#facc15" fontSize="12" opacity="0.5">
          ابدأ بزراعة أول غرسة
        </text>
      )}
    </svg>
  );
}
