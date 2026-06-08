const symbolConfig = {
  A: { label: "Diamond", payout: "50x" },
  B: { label: "Star", payout: "30x" },
  C: { label: "Cherry", payout: "10x" },
  D: { label: "Lemon", payout: "5x" }
};

export function SymbolIcon({ symbol }) {
  const config = symbolConfig[symbol];

  return (
    <div className="symbol-glyph" aria-label={config.label} title={config.label}>
      {symbol === "A" ? <DiamondIcon /> : null}
      {symbol === "B" ? <StarIcon /> : null}
      {symbol === "C" ? <CherryIcon /> : null}
      {symbol === "D" ? <LemonIcon /> : null}
      <span className="visually-hidden">{config.label}</span>
    </div>
  );
}

export function SymbolLegend() {
  return (
    <div className="legend-grid">
      {Object.entries(symbolConfig).map(([symbol, config]) => (
        <div className="legend-item" key={symbol}>
          <div className="legend-icon">
            <SymbolIcon symbol={symbol} />
          </div>
          <div>
            <p className="legend-name">{config.label}</p>
            <p className="legend-meta">{`${symbol} pays ${config.payout}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DiamondIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 64 64">
      <polygon fill="#5d7aa8" points="32 6 53 26 32 58 11 26" />
      <polygon fill="#9fb7d7" points="32 6 44 26 32 34 20 26" />
      <polyline
        fill="none"
        points="11 26 32 34 53 26"
        stroke="#e8eef7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 64 64">
      <polygon
        fill="#d4a632"
        points="32 7 39 24 57 24 43 35 48 53 32 42 16 53 21 35 7 24 25 24"
      />
      <circle cx="32" cy="31" fill="#f7d774" r="6" />
    </svg>
  );
}

function CherryIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 64 64">
      <path
        d="M24 20c2-8 10-12 20-10"
        fill="none"
        stroke="#4e7c44"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M36 22c3-7 9-10 16-9"
        fill="none"
        stroke="#4e7c44"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <circle cx="23" cy="39" fill="#c0392b" r="12" />
      <circle cx="41" cy="41" fill="#d54b3d" r="12" />
      <circle cx="19" cy="34" fill="#f6b3ab" opacity="0.55" r="4" />
      <circle cx="37" cy="36" fill="#f7b9b2" opacity="0.4" r="4" />
    </svg>
  );
}

function LemonIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 64 64">
      <ellipse cx="32" cy="34" fill="#f0c949" rx="20" ry="13" />
      <ellipse cx="32" cy="34" fill="none" rx="20" ry="13" stroke="#d4a632" strokeWidth="3" />
      <path d="M32 17c4-6 9-8 16-6-2 7-8 10-16 10" fill="#6f9953" />
      <path
        d="M20 34h24"
        fill="none"
        stroke="#f7df88"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}
