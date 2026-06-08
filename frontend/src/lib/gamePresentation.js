export const SYMBOL_ORDER = ["A", "B", "C", "D"];

export const SYMBOL_META = {
  A: { name: "Diamond", multiplier: 50 },
  B: { name: "Star", multiplier: 30 },
  C: { name: "Cherry", multiplier: 10 },
  D: { name: "Lemon", multiplier: 5 }
};

export const IDLE_BOARD = [
  ["A", "C", "B"],
  ["D", "B", "C"],
  ["C", "D", "A"]
];

export const LOSS_MESSAGES = [
  "Try again",
  "Almost there",
  "Give it another spin",
  "Luck is warming up"
];

export const REEL_STOP_TIMES = [1400, 1800, 2200];

export function getColumns(board) {
  return Array.from({ length: board[0].length }, (_, columnIndex) =>
    board.map((row) => row[columnIndex])
  );
}

export function createReelSpin(board) {
  const columns = getColumns(board);
  return columns.map((column, index) => ({
    id: `reel-${Date.now()}-${index}`,
    duration: REEL_STOP_TIMES[index],
    symbols: buildSpinStrip(column, index)
  }));
}

export function analyzeSpin(result, bet, spinIndex) {
  const winningRows = result.winningLines
    .map((value, rowIndex) => (value ? rowIndex : null))
    .filter((value) => value !== null);

  const winningDetails = winningRows
    .map((rowIndex) => {
      const symbol = result.spin[rowIndex][0];
      return {
        rowIndex,
        symbol,
        multiplier: SYMBOL_META[symbol].multiplier
      };
    })
    .sort((left, right) => right.multiplier - left.multiplier);

  const primaryWin = winningDetails[0] ?? null;
  const nearMiss = result.winAmount === 0 && hasNearMiss(result.spin);
  const highestMultiplier = primaryWin ? primaryWin.multiplier : 0;
  const isBigWin =
    result.winAmount >= Math.max(bet * 5, 250) || highestMultiplier >= 50;

  const lineLabel = primaryWin
    ? `${SYMBOL_META[primaryWin.symbol].name} Line`
    : "";

  const recentSpinLabel = result.winAmount > 0
    ? winningDetails.length > 1
      ? `${lineLabel} + ${winningDetails.length - 1} more`
      : lineLabel
    : nearMiss
      ? "So close!"
      : LOSS_MESSAGES[spinIndex % LOSS_MESSAGES.length];

  const bannerTitle = result.winAmount > 0
    ? winningDetails.length > 1
      ? `${lineLabel} +$${result.winAmount}`
      : `${lineLabel}! +$${result.winAmount}`
    : nearMiss
      ? "So close!"
      : recentSpinLabel;

  const bannerText = result.winAmount > 0
    ? isBigWin
      ? "That machine really opened up."
      : "Clean hit. The machine paid out."
    : nearMiss
      ? "Two matching symbols landed on a line."
      : "Set the next wager and keep it moving.";

  return {
    banner: {
      tone: result.winAmount > 0 ? (isBigWin ? "big-win" : "win") : "lose",
      title: bannerTitle,
      text: bannerText
    },
    highestMultiplier,
    isBigWin,
    isNearMiss: nearMiss,
    isWin: result.winAmount > 0,
    lineLabel,
    previewSymbols:
      primaryWin !== null ? result.spin[primaryWin.rowIndex] : result.spin[1],
    recentSpinLabel,
    winAmount: result.winAmount
  };
}

export function formatCurrency(amount) {
  const prefix = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${prefix}$${Math.abs(amount)}`;
}

function buildSpinStrip(finalColumn, columnIndex) {
  const strip = [];
  const leadLength = 16 + columnIndex * 4;
  let pointer = columnIndex % SYMBOL_ORDER.length;

  for (let index = 0; index < leadLength; index += 1) {
    strip.push(SYMBOL_ORDER[pointer]);
    pointer = (pointer + 1) % SYMBOL_ORDER.length;

    if (index % 5 === 4) {
      pointer = (pointer + columnIndex + 1) % SYMBOL_ORDER.length;
    }
  }

  return [...strip, ...finalColumn];
}

function hasNearMiss(board) {
  return board.some((row) => {
    const counts = row.reduce((accumulator, symbol) => {
      accumulator[symbol] = (accumulator[symbol] ?? 0) + 1;
      return accumulator;
    }, {});

    return Object.values(counts).includes(2);
  });
}
