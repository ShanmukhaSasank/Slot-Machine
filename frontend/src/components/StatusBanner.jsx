export function StatusBanner({ error, isBusy, status }) {
  const tone = error ? "error" : status.tone;
  const text = error ? error : status.text;

  return (
    <div className={`status-banner status-banner--${tone}`}>
      <span className="status-label">{isBusy ? "Machine" : "Result"}</span>
      <span>{text}</span>
    </div>
  );
}
