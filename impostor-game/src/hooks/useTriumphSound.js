import { useCallback } from 'react';

export function useTriumphSound() {
  const playTriumph = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.1;
      comp.connect(ctx.destination);

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.55, ctx.currentTime);
      master.connect(comp);

      const rev = ctx.createDelay(0.5);
      rev.delayTime.value = 0.08;
      const revFB = ctx.createGain();
      revFB.gain.value = 0.2;
      const revWet = ctx.createGain();
      revWet.gain.value = 0.22;
      rev.connect(revFB);
      revFB.connect(rev);
      rev.connect(revWet);
      revWet.connect(master);

      function note(freq, startTime, duration, vol = 0.5) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = freq * 2;

        const osc2g = ctx.createGain();
        osc2g.gain.value = 0.18;

        const g = ctx.createGain();
        g.gain.setValueAtTime(0, startTime);
        g.gain.linearRampToValueAtTime(vol, startTime + 0.008);
        g.gain.setValueAtTime(vol, startTime + duration * 0.6);
        g.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(g);
        osc2.connect(osc2g);
        osc2g.connect(g);
        g.connect(master);
        g.connect(rev);

        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + duration + 0.05);
        osc2.stop(startTime + duration + 0.05);
      }

      const t = ctx.currentTime;

      // Ascending arpeggio: C5 → E5 → G5 → C6
      [523.25, 659.26, 783.99, 1046.50].forEach((freq, i) =>
        note(freq, t + i * 0.12, 0.28, 0.42)
      );

      // Final chord hit
      const chordStart = t + 0.56;
      [523.25, 659.26, 783.99, 1046.50].forEach((freq, i) =>
        note(freq, chordStart, 1.6, 0.38 - i * 0.04)
      );
      note(2093.00, chordStart + 0.04, 1.0, 0.18);

      setTimeout(() => {
        try { ctx.close(); } catch (_) {}
      }, (chordStart + 1.6 + 0.4 - ctx.currentTime + 0.5) * 1000);
    } catch (_) {}
  }, []);

  return { playTriumph };
}
