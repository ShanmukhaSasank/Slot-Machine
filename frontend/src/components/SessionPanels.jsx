import { formatCurrency } from "../lib/gamePresentation";
import { SymbolRow } from "./SymbolIcons";

export function SessionPanels({ recentSpins, recentWins, stats }) {
  const profitLoss = stats.totalWinnings - stats.totalWagered;
  const winRate =
    stats.totalSpins === 0
      ? 0
      : Math.round((stats.wins / stats.totalSpins) * 100);

  return (
    <div className="session-rail">
      <section className="data-card">
        <div className="data-card__header">
          <p className="eyebrow">Session Stats</p>
          <p className="data-card__title">Live performance from this visit.</p>
        </div>

        <div className="stats-grid">
          <Stat label="Games Played" value={stats.totalSpins} />
          <Stat label="Wins" value={stats.wins} />
          <Stat label="Losses" value={stats.losses} />
          <Stat label="Win Rate" value={`${winRate}%`} />
          <Stat label="Total Winnings" value={formatCurrency(stats.totalWinnings)} />
          <Stat label="Biggest Win" value={formatCurrency(stats.biggestWin)} />
          <Stat label="Current Win Streak" value={stats.currentWinStreak} />
          <Stat
            label="Highest Multiplier Hit"
            value={stats.highestMultiplierHit ? `${stats.highestMultiplierHit}x` : "--"}
          />
          <Stat label="Session Profit/Loss" value={formatCurrency(profitLoss)} />
          <Stat label="Best Streak" value={stats.highestWinStreak} />
        </div>
      </section>

      <section className="data-card">
        <div className="data-card__header">
          <p className="eyebrow">Recent Spins</p>
          <p className="data-card__title">Your last five machine outcomes.</p>
        </div>

        <div className="feed-list">
          {recentSpins.length === 0 ? (
            <EmptyState text="Your spin history will land here once the reels start moving." />
          ) : (
            recentSpins.map((spin) => (
              <article className="feed-item" key={spin.id}>
                <SymbolRow compact symbols={spin.previewSymbols} />
                <div className="feed-item__meta">
                  <p className="feed-item__title">
                    {spin.winAmount > 0 ? formatCurrency(spin.winAmount) : "Lose"}
                  </p>
                  <p className="feed-item__text">{spin.label}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="data-card">
        <div className="data-card__header">
          <p className="eyebrow">Recent Win Feed</p>
          <p className="data-card__title">Newest hits show up first.</p>
        </div>

        <div className="feed-list">
          {recentWins.length === 0 ? (
            <EmptyState text="Winning lines will be recorded here as soon as the machine pays out." />
          ) : (
            recentWins.map((item) => (
              <article className="feed-item feed-item--text" key={item.id}>
                <div className="feed-pill">Win</div>
                <div className="feed-item__meta">
                  <p className="feed-item__title">{`Won $${item.amount} with ${item.label}`}</p>
                  <p className="feed-item__text">Newest payout at the top.</p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-chip">
      <p className="stat-chip__label">{label}</p>
      <p className="stat-chip__value">{value}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="empty-state">{text}</p>;
}
