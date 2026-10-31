// obs-hud's built-in sounds, synthesised the same way the app does it (WavePlayer.Synth): pairs of
// (frequency Hz, length ms), 0 Hz being a rest, each note ringing like a small bell
export const MELODIES = {
    clip: [1046.5, 70, 0, 20, 1568, 160],
    rec_start: [523.3, 85, 659.3, 85, 784, 170],
    rec_stop: [784, 85, 659.3, 85, 523.3, 230],
    replay_on: [587.3, 80, 880, 160],
    replay_off: [880, 80, 587.3, 180],
    pause: [659.3, 150],
    resume: [659.3, 55, 0, 35, 659.3, 70],
    warn: [233, 140, 0, 40, 196, 260],
};

const TAIL = 0.22;
// a bit under the app's default volume, since this is a web page
const GAIN = 0.2;

let context = null;

// Browsers only let a page make sound after the visitor has clicked or typed something on it,
// so this only plays once they have (or when it's run from a click, like a play button)
export function playChime(name) {
    const notes = MELODIES[name];
    if (!notes || !navigator.userActivation?.hasBeenActive) return;
    context ??= new AudioContext();
    if (context.state === "suspended") context.resume();

    const rate = context.sampleRate;
    let total = 0;
    for (let i = 1; i < notes.length; i += 2) total += notes[i] / 1000;
    const length = Math.ceil((total + TAIL) * rate);
    const buffer = context.createBuffer(1, length, rate);
    const mix = buffer.getChannelData(0);

    let t0 = 0;
    for (let i = 0; i + 1 < notes.length; i += 2) {
        const [f, len] = [notes[i], notes[i + 1] / 1000];
        if (f > 0) {
            const start = Math.floor(t0 * rate);
            const count = Math.min(length - start, Math.floor((len + TAIL) * rate));
            for (let k = 0; k < count; k++) {
                const t = k / rate;
                const w = 2 * Math.PI * f * t;
                const env = Math.min(1, t / 0.004) * Math.exp(-t / 0.09);
                mix[start + k] += env * (Math.sin(w) + 0.25 * Math.sin(2 * w) + 0.06 * Math.sin(3 * w));
            }
        }
        t0 += len;
    }
    for (let k = 0; k < length; k++) {
        const fade = Math.min(1, (length - k) / (0.01 * rate));
        mix[k] = Math.max(-1, Math.min(1, mix[k] * GAIN * fade));
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
}
