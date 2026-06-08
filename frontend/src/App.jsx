import { BetControls } from "./components/BetControls";
import { Header } from "./components/Header";
import { SlotBoard } from "./components/SlotBoard";
import { StatusBanner } from "./components/StatusBanner";
import { SymbolLegend } from "./components/SymbolIcons";
import { useGame } from "./hooks/useGame";

function App() {
  const {
    balance,
    board,
    winningLines,
    status,
    error,
    isSpinning,
    isStarting,
    spin,
    startNewGame
  } = useGame();

  return (
    <div className="app-shell">
      <Header />

      <main className="layout">
        <section className="game-card">
          <div className="game-card__marquee" />
          <div className="game-card__topbar">
            <div>
              <p className="eyebrow">Balance</p>
              <p className="balance-value">
                {balance === null ? "Loading..." : `$${balance}`}
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={startNewGame}
              disabled={isSpinning || isStarting}
              type="button"
            >
              New Game
            </button>
          </div>

          <SlotBoard
            board={board}
            isSpinning={isSpinning}
            winningLines={winningLines}
          />

          <StatusBanner error={error} isBusy={isSpinning || isStarting} status={status} />

          <BetControls
            balance={balance}
            disabled={isSpinning || isStarting}
            onSpin={spin}
          />
        </section>

        <aside className="info-stack">
          <section className="info-card">
            <div className="info-card__header">
              <p className="eyebrow">Payout Table</p>
              <p className="info-card__title">Three-in-a-row pays the full line.</p>
            </div>
            <SymbolLegend />
          </section>

          <section className="info-card">
            <div className="info-card__header">
              <p className="eyebrow">Machine Notes</p>
              <p className="info-card__title">Built for quick sessions on any screen.</p>
            </div>
            <ul className="notes-list">
              <li>3 rows x 3 columns with horizontal line wins.</li>
              <li>Warm arcade styling, responsive layout, and tasteful reel motion.</li>
              <li>Go powers the slot logic while React handles the interface.</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
