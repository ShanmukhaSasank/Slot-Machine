import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "sasanks-casino-muted";

export function useSoundEffects() {
  const [muted, setMuted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(STORAGE_KEY) === "true";
  });

  const audioContextRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, String(muted));
    }
  }, [muted]);

  async function prime() {
    if (typeof window === "undefined") {
      return null;
    }

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch {
        return null;
      }
    }

    return audioContextRef.current;
  }

  function scheduleTone(context, config) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime + config.delay;

    oscillator.type = config.type ?? "triangle";
    oscillator.frequency.setValueAtTime(config.frequency, now);
    if (config.endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(
        config.endFrequency,
        now + config.duration
      );
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(config.gain, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + config.duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + config.duration + 0.02);
  }

  async function play(sequence) {
    if (muted) {
      return;
    }

    const context = await prime();
    if (!context) {
      return;
    }

    sequence.forEach((tone) => scheduleTone(context, tone));
  }

  return {
    muted,
    toggleMuted() {
      setMuted((current) => !current);
    },
    prime,
    playBigWin() {
      void play([
        { delay: 0, duration: 0.18, frequency: 360, endFrequency: 480, gain: 0.035 },
        { delay: 0.16, duration: 0.2, frequency: 480, endFrequency: 640, gain: 0.04 },
        { delay: 0.34, duration: 0.28, frequency: 640, endFrequency: 860, gain: 0.045, type: "sine" }
      ]);
    },
    playReelStop() {
      void play([
        { delay: 0, duration: 0.08, frequency: 210, endFrequency: 180, gain: 0.025, type: "square" }
      ]);
    },
    playSpinStart() {
      void play([
        { delay: 0, duration: 0.12, frequency: 130, endFrequency: 100, gain: 0.03, type: "sawtooth" },
        { delay: 0.1, duration: 0.08, frequency: 220, endFrequency: 180, gain: 0.022, type: "square" }
      ]);
    },
    playWin() {
      void play([
        { delay: 0, duration: 0.12, frequency: 420, endFrequency: 520, gain: 0.026 },
        { delay: 0.12, duration: 0.14, frequency: 520, endFrequency: 640, gain: 0.03 },
        { delay: 0.24, duration: 0.18, frequency: 640, endFrequency: 760, gain: 0.03, type: "sine" }
      ]);
    }
  };
}
