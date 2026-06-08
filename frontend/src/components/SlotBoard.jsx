import { motion, useReducedMotion } from "framer-motion";
import { SymbolIcon } from "./SymbolIcons";

export function SlotBoard({ activeSpin, board, isBigWin, winningLines }) {
  return (
    <div className={`machine-board ${isBigWin ? "machine-board--big-win" : ""}`}>
      <div className="machine-board__bezel">
        {activeSpin ? (
          <div className="reel-board">
            {activeSpin.reels.map((reel) => (
              <ReelColumn duration={reel.duration} key={reel.id} symbols={reel.symbols} />
            ))}
          </div>
        ) : (
          <div className="settled-board">
            {board.map((row, rowIndex) => (
              <div
                className={`settled-row ${winningLines[rowIndex] ? "settled-row--winning" : ""}`}
                key={`row-${rowIndex}`}
              >
                {row.map((symbol, columnIndex) => (
                  <div className="settled-cell" key={`${rowIndex}-${columnIndex}`}>
                    <div className="settled-cell__shell">
                      <SymbolIcon
                        highlight={Boolean(winningLines[rowIndex])}
                        symbol={symbol}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReelColumn({ duration, symbols }) {
  const reduceMotion = useReducedMotion();
  const symbolCount = symbols.length;
  const travelCount = symbolCount - 3;
  const finalY = `${-((travelCount / symbolCount) * 100)}%`;
  const overshootY = `${-(((travelCount + 0.26) / symbolCount) * 100)}%`;
  const settleY = `${-(((travelCount - 0.08) / symbolCount) * 100)}%`;

  return (
    <div className="reel-window">
      <motion.div
        animate={
          reduceMotion
            ? { y: finalY }
            : { y: ["0%", overshootY, settleY, finalY] }
        }
        className="reel-strip"
        initial={{ y: "0%" }}
        transition={
          reduceMotion
            ? { duration: 0.2, ease: "easeOut" }
            : {
                duration: duration / 1000,
                ease: ["easeIn", "easeOut"],
                times: [0, 0.9, 0.96, 1]
              }
        }
      >
        {symbols.map((symbol, index) => (
          <div className="reel-symbol" key={`${symbol}-${index}`}>
            <div className="reel-symbol__shell">
              <SymbolIcon symbol={symbol} />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
