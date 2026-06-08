import { useEffect, useState } from "react";

export function useAnimatedNumber(target, duration = 700) {
  const [value, setValue] = useState(target ?? 0);

  useEffect(() => {
    if (target === null || target === undefined) {
      return undefined;
    }

    const startValue = value;
    const change = target - startValue;

    if (change === 0) {
      return undefined;
    }

    const startTime = performance.now();
    let frame = 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startValue + change * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, target]);

  return value;
}
