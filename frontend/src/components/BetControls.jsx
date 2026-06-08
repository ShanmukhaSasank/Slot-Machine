import { useState } from "react";

const quickBets = [5, 10, 25, 50];

export function BetControls({ balance, disabled, onSpin }) {
  const [bet, setBet] = useState("20");
  const [localError, setLocalError] = useState("");
  const numericBet = Number(bet);
  const isWholeNumber = Number.isInteger(numericBet);
  const exceedsBalance = balance !== null && numericBet > balance;
  const canSpin =
    !disabled &&
    balance !== null &&
    isWholeNumber &&
    numericBet > 0 &&
    !exceedsBalance;

  const allInValue =
    balance === null || balance <= 0 ? "" : String(balance);

  function handleSubmit(event) {
    event.preventDefault();

    if (!Number.isInteger(numericBet) || numericBet <= 0) {
      setLocalError("Enter a valid positive whole-number bet.");
      return;
    }

    if (balance !== null && numericBet > balance) {
      setLocalError("Bet cannot exceed your current balance.");
      return;
    }

    setLocalError("");
    onSpin(numericBet);
  }

  function applyQuickBet(value) {
    setBet(String(value));
    setLocalError("");
  }

  return (
    <form className="bet-panel" onSubmit={handleSubmit}>
      <div className="quick-bets" aria-label="Quick bet options">
        {quickBets.map((value) => (
          <button
            className={`quick-bet ${Number(bet) === value ? "quick-bet--active" : ""}`}
            disabled={disabled}
            key={value}
            onClick={() => applyQuickBet(value)}
            type="button"
          >
            {`$${value}`}
          </button>
        ))}

        <button
          className={`quick-bet quick-bet--all-in ${Number(bet) === balance ? "quick-bet--active" : ""}`}
          disabled={disabled || balance === null || balance <= 0}
          onClick={() => applyQuickBet(allInValue)}
          type="button"
        >
          All In
        </button>
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="bet">
          Enter Bet
        </label>
        <input
          className="bet-input"
          disabled={disabled}
          id="bet"
          inputMode="numeric"
          min="1"
          onChange={(event) => setBet(event.target.value)}
          step="1"
          type="number"
          value={bet}
        />
      </div>

      <button className="spin-button" disabled={!canSpin} type="submit">
        {disabled ? "SPINNING..." : "SPIN"}
      </button>

      <p className="field-hint">
        {balance === null
          ? "Preparing your machine..."
          : exceedsBalance
            ? `Bet is higher than your $${balance} balance.`
            : `You have $${balance} available.`}
      </p>

      {localError ? <p className="inline-error">{localError}</p> : null}
    </form>
  );
}
