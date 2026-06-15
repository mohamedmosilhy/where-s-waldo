let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playSuccessSound(): void {
  try {
    const c = getCtx();
    const t = c.currentTime;
    // Ascending C5 → E5 → G5 chord
    (
      [
        [523.25, 0],
        [659.25, 0.07],
        [783.99, 0.14],
      ] as [number, number][]
    ).forEach(([freq, offset]) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + offset);
      gain.gain.linearRampToValueAtTime(0.22, t + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.38);
      osc.start(t + offset);
      osc.stop(t + offset + 0.4);
    });
  } catch {
    // silence AudioContext errors (e.g. autoplay policy)
  }
}

export function playErrorSound(): void {
  try {
    const c = getCtx();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.22);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.start(t);
    osc.stop(t + 0.3);
  } catch {}
}

export function playCelebrationSound(): void {
  try {
    const c = getCtx();
    const t = c.currentTime;
    // Classic ascending win fanfare: C5 E5 G5 C6
    (
      [
        [523.25, 0],
        [659.25, 0.12],
        [783.99, 0.24],
        [1046.5, 0.36],
      ] as [number, number][]
    ).forEach(([freq, offset]) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + offset);
      gain.gain.linearRampToValueAtTime(0.25, t + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        t + offset + (offset === 0.36 ? 0.7 : 0.25),
      );
      osc.start(t + offset);
      osc.stop(t + offset + (offset === 0.36 ? 0.75 : 0.3));
    });
  } catch {}
}
