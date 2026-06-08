import { useEffect, useRef, useState } from "react";
import { spinGame, startGame } from "../lib/api";

const idleBoard = [
  ["A", "D", "B"],
  ["C", "B", "D"],
  ["D", "C", "A"]
];

const symbolCycle = ["A", "B", "C", "D"];
const animationDuration = 1500;
const frameInterval = 120;

function buildRollingBoard(frame) {
  return Array.from({ length: 3 }, (_, rowIndex) =>
    Array.from({ length: 3 }, (_, columnIndex) => {
      const symbolIndex =
        (frame + rowIndex * 2 + columnIndex * 3) % symbolCycle.length;
      return symbolCycle[symbolIndex];
    })
  );
}

export function useGame() {
  const [balance, setBalance] = useState(null);
  const [board, setBoard] = useState(idleBoard);
  const [winningLines, setWinningLines] = useState([0, 0, 0]);
  const [status, setStatus] = useState({
    tone: "idle",
    text: "Place your bet and spin the reels."
  });
  const [error, setError] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStarting, setIsStarting] = useState(true);

  const frameRef = useRef(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    frameRef.current = 0;
  };

  useEffect(() => {
    void initializeGame();

    return () => {
      stopAnimation();
    };
  }, []);

  async function initializeGame() {
    stopAnimation();
    setIsSpinning(false);
    setIsStarting(true);
    setError("");
    setWinningLines([0, 0, 0]);
    setBoard(idleBoard);

    try {
      const response = await startGame();
      setBalance(response.balance);
      setStatus({
        tone: "idle",
        text: "Place your bet and spin the reels."
      });
    } catch (requestError) {
      setStatus({
        tone: "error",
        text: "Could not start the game."
      });
      setError(requestError.message);
    } finally {
      setIsStarting(false);
    }
  }

  async function spin(bet) {
    if (isSpinning || isStarting) {
      return;
    }

    setError("");
    setWinningLines([0, 0, 0]);
    setStatus({
      tone: "idle",
      text: "Reels are spinning..."
    });

    try {
      const response = await spinGame(bet);
      playSpin(response);
    } catch (requestError) {
      setStatus({
        tone: "error",
        text: requestError.message
      });
      setError(requestError.message);
    }
  }

  function playSpin(result) {
    stopAnimation();
    setIsSpinning(true);

    intervalRef.current = setInterval(() => {
      frameRef.current += 1;
      setBoard(buildRollingBoard(frameRef.current));
    }, frameInterval);

    timeoutRef.current = setTimeout(() => {
      stopAnimation();
      setBoard(result.spin);
      setWinningLines(result.winningLines);
      setBalance(result.balance);
      setStatus(
        result.winAmount > 0
          ? { tone: "win", text: `You won $${result.winAmount}` }
          : { tone: "lose", text: "No winning lines" }
      );
      setIsSpinning(false);
    }, animationDuration);
  }

  return {
    balance,
    board,
    winningLines,
    status,
    error,
    isSpinning,
    isStarting,
    spin,
    startNewGame: initializeGame
  };
}
