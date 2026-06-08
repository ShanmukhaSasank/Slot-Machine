export function SoundToggle({ muted, onToggle }) {
  return (
    <button
      aria-pressed={!muted}
      className="sound-toggle"
      onClick={onToggle}
      type="button"
    >
      <span className="sound-toggle__dot" />
      {muted ? "Muted" : "Sound On"}
    </button>
  );
}
