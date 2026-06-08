import { SYMBOL_META } from "../lib/gamePresentation";

export function SymbolIcon({
  symbol,
  compact = false,
  highlight = false
}) {
  const config = SYMBOL_META[symbol];

  return (
    <div
      className={`symbol-glyph ${compact ? "symbol-glyph--compact" : ""} ${highlight ? "symbol-glyph--highlight" : ""}`}
      aria-label={config.name}
      title={config.name}
    >
      {symbol === "A" ? <DiamondIcon /> : null}
      {symbol === "B" ? <StarIcon /> : null}
      {symbol === "C" ? <CherryIcon /> : null}
      {symbol === "D" ? <LemonIcon /> : null}
      <span className="visually-hidden">{config.name}</span>
    </div>
  );
}

export function SymbolRow({ symbols, compact = false, highlight = false }) {
  return (
    <div className={`symbol-row ${compact ? "symbol-row--compact" : ""}`}>
      {symbols.map((symbol, index) => (
        <div className="symbol-row__item" key={`${symbol}-${index}`}>
          <SymbolIcon compact={compact} highlight={highlight} symbol={symbol} />
        </div>
      ))}
    </div>
  );
}

export function PayoutStrip() {
  return (
    <div className="payout-strip" aria-label="Payout table">
      {Object.entries(SYMBOL_META).map(([symbol, meta]) => (
        <div className="payout-pill" key={symbol}>
          <SymbolIcon compact symbol={symbol} />
          <div>
            <p className="payout-pill__name">{meta.name}</p>
            <p className="payout-pill__meta">{`${meta.multiplier}x line`}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DiamondIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 84 84">
      <defs>
        <linearGradient id="diamond-shell" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#dbe8ff" />
          <stop offset="100%" stopColor="#5d7aa8" />
        </linearGradient>
      </defs>
      <polygon fill="url(#diamond-shell)" points="42 8 69 30 42 76 15 30" />
      <polygon fill="#ffffff" opacity="0.78" points="42 8 54 30 42 40 30 30" />
      <polyline
        fill="none"
        points="15 30 42 40 69 30"
        stroke="#f2f7ff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <polyline
        fill="none"
        points="28 18 42 40 56 18"
        stroke="#86a3cc"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 84 84">
      <defs>
        <linearGradient id="star-core" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe38d" />
          <stop offset="100%" stopColor="#c9941d" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#star-core)"
        points="42 10 51 31 74 31 56 45 62 68 42 56 22 68 28 45 10 31 33 31"
      />
      <circle cx="42" cy="41" fill="#fff6cf" r="7" />
      <path
        d="M42 19v10M25 31h8"
        fill="none"
        opacity="0.6"
        stroke="#fff6cf"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function CherryIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 84 84">
      <path
        d="M29 27c2-12 12-18 29-15"
        fill="none"
        stroke="#5f8747"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M48 30c4-10 11-14 20-13"
        fill="none"
        stroke="#5f8747"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <circle cx="29" cy="52" fill="#bf3a2b" r="15" />
      <circle cx="52" cy="55" fill="#d94e40" r="15" />
      <ellipse cx="24" cy="46" fill="#ffd7d2" opacity="0.55" rx="5" ry="4" />
      <ellipse cx="47" cy="49" fill="#ffd1ca" opacity="0.45" rx="5" ry="4" />
    </svg>
  );
}

function LemonIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 84 84">
      <defs>
        <linearGradient id="lemon-shell" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffeb91" />
          <stop offset="100%" stopColor="#d7aa24" />
        </linearGradient>
      </defs>
      <ellipse cx="42" cy="47" fill="url(#lemon-shell)" rx="25" ry="16" />
      <ellipse
        cx="42"
        cy="47"
        fill="none"
        rx="25"
        ry="16"
        stroke="#f7f0bf"
        strokeWidth="3"
      />
      <path d="M42 24c5-8 12-11 21-8-3 9-10 13-21 13" fill="#7ca65f" />
      <path
        d="M27 47h30"
        fill="none"
        opacity="0.7"
        stroke="#fff4bb"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}
