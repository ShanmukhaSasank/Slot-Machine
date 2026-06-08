import { useEffect, useRef, useState } from "react";
import { spinGame, startGame } from "../lib/api";
import {
  analyzeSpin,
  createReelSpin,
  IDLE_BOARD,
  REEL_STOP_TIMES
} from "../lib/gamePresentation";
import { useSoundEffects } from "./useSoundEffects";

const initialStatus = {
  tone: "idle",
  title: "Ready to spin",
  text: "Pull the lever or set your wager below."
};

const initialStats = {
  biggestWin: 0,
  currentWinStreak: 0,
  highestMultiplierHit: 0,
  highestWinStreak: 0,
  losses: 0,
  totalSpins: 0,
  totalWagered: 0,
  totalWinnings: 0,
  wins: 0
};

export function useGame() {
  const [activeSpin, setActiveSpin] = useState(null);
  const [balance, setBalance] = useState(null);
  const [banner, setBanner] = useState(null);
  const [betValue, setBetValue] = useState("20");
  const [board, setBoard] = useState(IDLE_BOARD);
  const [error, setError] = useState("");
  const [isBigWin, setIsBigWin] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [recentSpins, setRecentSpins] = useState([]);
  const [recentWins, setRecentWins] = useState([]);
  const [stats, setStats] = useState(initialStats);
  const [status, setStatus] = useState(initialStatus);
  const [winningLines, setWinningLines] = useState([0, 0, 0]);

  const sound = useSoundEffects();
  const timersRef = useRef([]);

  const numericBet = Number(betValue);
  const isWholeNumber = Number.isInteger(numericBet);
  const exceedsBalance = balance !== null && numericBet > balance;
  const controlsDisabled = isStarting || isSpinning;
  const canSpin =
    !controlsDisabled &&
    balance !== null &&
    isWholeNumber &&
    numericBet > 0 &&
    !exceedsBalance;

  useEffect(() => {
    void initializeGame();

    return () => {
      clearTimers();
    };
  }, []);

  async function initializeGame() {
    clearTimers();
    setActiveSpin(null);
    setBanner(null);
    setBoard(IDLE_BOARD);
    setError("");
    setIsBigWin(false);
    setIsShaking(false);
    setIsSpinning(false);
    setIsStarting(true);
    setStatus(initialStatus);
    setWinningLines([0, 0, 0]);

    try {
      const response = await startGame();
      setBalance(response.balance);
    } catch (requestError) {
      setError(requestError.message);
      setStatus({
        tone: "error",
        title: "Machine offline",
        text: "The cabinet did not start cleanly."
      });
    } finally {
      setIsStarting(false);
    }
  }

  async function spinCurrentBet() {
    if (!canSpin) {
      return;
    }

    clearTimers();
    setActiveSpin(null);
    setBanner(null);
    setError("");
    setIsBigWin(false);
    setIsSpinning(true);
    setIsShaking(true);
    setStatus({
      tone: "spinning",
      title: "Reels in motion",
      text: "Listen for the clicks."
    });
    setWinningLines([0, 0, 0]);

    void sound.prime();
    sound.playSpinStart();

    timersRef.current.push(
      window.setTimeout(() => setIsShaking(false), 260)
    );

    try {
      const response = await spinGame(numericBet);
      startSpinSequence(response, numericBet, stats.totalSpins);
    } catch (requestError) {
      clearTimers();
      setIsShaking(false);
      setIsSpinning(false);
      setError(requestError.message);
      setStatus({
        tone: "error",
        title: "Spin failed",
        text: requestError.message
      });
    }
  }

  function startSpinSequence(result, bet, spinIndex) {
    setActiveSpin({
      id: Date.now(),
      reels: createReelSpin(result.spin)
    });

    REEL_STOP_TIMES.forEach((stopTime) => {
      timersRef.current.push(
        window.setTimeout(() => {
          sound.playReelStop();
        }, stopTime)
      );
    });

    timersRef.current.push(
      window.setTimeout(() => {
        finalizeSpin(result, bet, spinIndex);
      }, REEL_STOP_TIMES[REEL_STOP_TIMES.length - 1] + 120)
    );
  }

  function finalizeSpin(result, bet, spinIndex) {
    const summary = analyzeSpin(result, bet, spinIndex);

    setActiveSpin(null);
    setBalance(result.balance);
    setBanner(summary.banner);
    setBoard(result.spin);
    setIsBigWin(summary.isBigWin);
    setIsSpinning(false);
    setStatus(summary.banner);
    setWinningLines(result.winningLines);

    if (summary.isWin) {
      if (summary.isBigWin) {
        sound.playBigWin();
      } else {
        sound.playWin();
      }
    }

    setRecentSpins((current) => [
      {
        id: `${Date.now()}-${current.length}`,
        label: summary.recentSpinLabel,
        previewSymbols: summary.previewSymbols,
        winAmount: summary.winAmount
      },
      ...current
    ].slice(0, 5));

    if (summary.isWin) {
      setRecentWins((current) => [
        {
          id: `${Date.now()}-${current.length}`,
          amount: summary.winAmount,
          label: summary.lineLabel || "Winning Line"
        },
        ...current
      ].slice(0, 10));
    }

    setStats((current) => {
      const wins = current.wins + (summary.isWin ? 1 : 0);
      const losses = current.losses + (summary.isWin ? 0 : 1);
      const currentWinStreak = summary.isWin ? current.currentWinStreak + 1 : 0;
      const totalSpins = current.totalSpins + 1;

      return {
        biggestWin: Math.max(current.biggestWin, summary.winAmount),
        currentWinStreak,
        highestMultiplierHit: Math.max(
          current.highestMultiplierHit,
          summary.highestMultiplier
        ),
        highestWinStreak: Math.max(
          current.highestWinStreak,
          currentWinStreak
        ),
        losses,
        totalSpins,
        totalWagered: current.totalWagered + bet,
        totalWinnings: current.totalWinnings + summary.winAmount,
        wins
      };
    });
  }

  function clearTimers() {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });
    timersRef.current = [];
  }

  return {
    activeSpin,
    balance,
    banner,
    betValue,
    canSpin,
    controlsDisabled,
    error,
    exceedsBalance,
    isBigWin,
    isShaking,
    isSpinning,
    recentSpins,
    recentWins,
    setBetValue(value) {
      setBetValue(value);
      setError("");
    },
    sound,
    spinCurrentBet,
    startNewGame: initializeGame,
    stats,
    status,
    winningLines,
    board
  };
}
