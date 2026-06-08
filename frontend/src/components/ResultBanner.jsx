import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function ResultBanner({ banner, error, status }) {
  const reduceMotion = useReducedMotion();
  const content = error
    ? {
        tone: "error",
        title: "Spin interrupted",
        text: error
      }
    : banner ?? status;

  return (
    <div aria-live="polite" className="result-banner-shell">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={`result-banner result-banner--${content.tone}`}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          key={`${content.tone}-${content.title}-${content.text}`}
          transition={{ duration: reduceMotion ? 0.16 : 0.28, ease: "easeOut" }}
        >
          <div className="result-banner__label">{content.tone === "win" || content.tone === "big-win" ? "Win" : content.tone === "error" ? "Issue" : "Machine"}</div>
          <div>
            <p className="result-banner__title">{content.title}</p>
            <p className="result-banner__text">{content.text}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
