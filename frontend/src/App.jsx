import { motion, useReducedMotion } from "framer-motion";
import { BetControls } from "./components/BetControls";
import { Header } from "./components/Header";
import { MachineLever } from "./components/MachineLever";
import { ResultBanner } from "./components/ResultBanner";
import { SessionPanels } from "./components/SessionPanels";
import { SlotBoard } from "./components/SlotBoard";
import { PayoutStrip } from "./components/SymbolIcons";
import { useAnimatedNumber } from "./hooks/useAnimatedNumber";
import { useGame } from "./hooks/useGame";

function App() {
  const reduceMotion = useReducedMotion();
  const {
    activeSpin,
    balance,
    banner,
    betValue,
    board,
    canSpin,
    controlsDisabled,
    error,
    exceedsBalance,
    isBigWin,
    isShaking,
    recentSpins,
    recentWins,
    setBetValue,
    sound,
    spinCurrentBet,
    startNewGame,
    stats,
    status,
    winningLines
  } = useGame();

  const animatedBalance = useAnimatedNumber(balance ?? 0, 850);

  return (
    <div className="app-shell">
      <Header
        muted={sound.muted}
        onNewGame={startNewGame}
        onToggleSound={sound.toggleMuted}
        spinLocked={controlsDisabled}
      />

      <main className="arcade-layout">
        <section className="machine-hero">
          <div className={`machine-cabinet ${isBigWin ? "machine-cabinet--big-win" : ""}`}>
            <div className="machine-cabinet__top">
              <div className="machine-display-card">
                <p className="eyebrow">Current Balance</p>
                <p className="machine-balance">${animatedBalance}</p>
              </div>

              <div className="machine-display-card machine-display-card--secondary">
                <p className="eyebrow">Current Streak</p>
                <p className="machine-chip">{stats.currentWinStreak}</p>
              </div>
            </div>

            <motion.div
              animate={
                isShaking
                  ? reduceMotion
                    ? { x: 0, y: 0 }
                    : {
                        rotate: [0, -0.2, 0.2, 0],
                        x: [0, -4, 4, -2, 2, 0],
                        y: [0, 1, -1, 0]
                      }
                  : { rotate: 0, x: 0, y: 0 }
              }
              className="machine-stage"
              transition={{ duration: reduceMotion ? 0.1 : 0.26, ease: "easeInOut" }}
            >
              <SlotBoard
                activeSpin={activeSpin}
                board={board}
                isBigWin={isBigWin}
                winningLines={winningLines}
              />
              <MachineLever disabled={!canSpin} onPull={spinCurrentBet} />
            </motion.div>

            <ResultBanner banner={banner} error={error} status={status} />

            <BetControls
              balance={balance}
              betValue={betValue}
              canSpin={canSpin}
              controlsDisabled={controlsDisabled}
              exceedsBalance={exceedsBalance}
              onBetChange={setBetValue}
              onSpin={spinCurrentBet}
            />

            <PayoutStrip />
          </div>
        </section>

        <SessionPanels
          recentSpins={recentSpins}
          recentWins={recentWins}
          stats={stats}
        />
      </main>
    </div>
  );
}

export default App;
