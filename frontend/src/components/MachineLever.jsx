import { motion } from "framer-motion";

export function MachineLever({ disabled, onPull }) {
  return (
    <div className="machine-lever">
      <div className="machine-lever__stem" />
      <motion.button
        aria-label="Pull lever to spin"
        className="machine-lever__handle"
        disabled={disabled}
        drag={disabled ? false : "y"}
        dragConstraints={{ top: 0, bottom: 72 }}
        dragElastic={0}
        dragSnapToOrigin
        onClick={() => {
          if (!disabled) {
            onPull();
          }
        }}
        onDragEnd={(_, info) => {
          if (!disabled && info.offset.y > 38) {
            onPull();
          }
        }}
        type="button"
        whileHover={disabled ? undefined : { x: 2, rotate: -2 }}
        whileTap={disabled ? undefined : { rotate: 14, y: 18 }}
      >
        <span className="machine-lever__knob" />
      </motion.button>
    </div>
  );
}
