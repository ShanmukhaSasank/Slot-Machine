import { SoundToggle } from "./SoundToggle";

export function Header({ muted, onNewGame, onToggleSound, spinLocked }) {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Classic Arcade Cabinet</p>
        <h1 className="site-title">Sasank&apos;s Casino</h1>
        <p className="site-subtitle">Polished slot play with warm machine feel.</p>
      </div>

      <div className="site-actions">
        <SoundToggle muted={muted} onToggle={onToggleSound} />
        <button
          className="secondary-button"
          disabled={spinLocked}
          onClick={onNewGame}
          type="button"
        >
          New Game
        </button>
      </div>
    </header>
  );
}
