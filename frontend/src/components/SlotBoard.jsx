import { SymbolIcon } from "./SymbolIcons";

export function SlotBoard({ board, isSpinning, winningLines }) {
  return (
    <div className="board-frame" aria-label="Slot machine board" role="img">
      {board.map((row, rowIndex) => (
        <div
          className={`slot-row ${winningLines[rowIndex] ? "slot-row--winning" : ""}`}
          key={`row-${rowIndex}`}
        >
          {row.map((symbol, columnIndex) => (
            <div className={`slot-cell ${isSpinning ? "slot-cell--spinning" : ""}`} key={`${rowIndex}-${columnIndex}`}>
              <div className="symbol-shell">
                <SymbolIcon symbol={symbol} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
