const quickBets = [5, 10, 25, 50];

export function BetControls({
  balance,
  betValue,
  canSpin,
  controlsDisabled,
  exceedsBalance,
  onBetChange,
  onSpin
}) {
  return (
    <section className="control-deck">
      <div className="quick-bets" aria-label="Quick bet options">
        {quickBets.map((value) => (
          <button
            className={`quick-bet ${Number(betValue) === value ? "quick-bet--active" : ""}`}
            disabled={controlsDisabled || (balance !== null && value > balance)}
            key={value}
            onClick={() => onBetChange(String(value))}
            type="button"
          >
            {`$${value}`}
          </button>
        ))}

        <button
          className={`quick-bet quick-bet--all-in ${Number(betValue) === balance ? "quick-bet--active" : ""}`}
          disabled={controlsDisabled || balance === null || balance <= 0}
          onClick={() => onBetChange(String(balance))}
          type="button"
        >
          All In
        </button>
      </div>

      <div className="bet-panel">
        <div className="field-group">
          <label className="field-label" htmlFor="bet">
            Enter Bet
          </label>
          <input
            aria-describedby="bet-hint"
            className="bet-input"
            disabled={controlsDisabled}
            id="bet"
            inputMode="numeric"
            min="1"
            onChange={(event) => onBetChange(event.target.value)}
            step="1"
            type="number"
            value={betValue}
          />
          <p className="field-hint" id="bet-hint">
            {balance === null
              ? "Preparing the cabinet..."
              : exceedsBalance
                ? `That wager is above your $${balance} balance.`
                : `You have $${balance} available.`}
          </p>
        </div>

        <button
          className="spin-button"
          disabled={!canSpin}
          onClick={onSpin}
          type="button"
        >
          {controlsDisabled ? "SPINNING..." : "SPIN"}
        </button>
      </div>
    </section>
  );
}
