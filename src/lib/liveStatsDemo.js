// Sample answers for previewing the live strip in `vite dev` with ?demo, ?demo=pc,
// ?demo=music, ?demo=away or ?demo=off. Never bundled into the production build.

const pc = {
    online: true,
    status: "active",
    interval: 10,
    uptime: 384_096,
    cpu: 29,
    gpu: 41,
    ramUsed: 20.8,
    ramTotal: 31.9,
    clicks: 3_412,
    keys: 18_902,
    scrolls: 1_207,
    mouse: 1_284.5,
    app: "VS Code",
    appInfo: "code editor, probably building something",
};

const music = {
    title: "Música Ligera",
    artist: "Soda Stereo",
    image: null,
    url: null,
    progressMs: 61_000,
    durationMs: 210_000,
};

// Each answer moves the numbers along a little, so the glide between readings shows
function drift(at) {
    const steps = Math.floor(at / 10_000) % 1_000;
    const wobble = (seed) => Math.round(25 * Math.sin(steps * seed));
    return {
        ...pc,
        uptime: pc.uptime + steps * 10,
        cpu: 30 + wobble(1.3),
        gpu: 45 + wobble(0.7),
        ramUsed: pc.ramUsed + wobble(0.9) / 10,
        clicks: pc.clicks + steps * 23,
        keys: pc.keys + steps * 140,
        scrolls: pc.scrolls + steps * 9,
        mouse: pc.mouse + steps * 6.5,
    };
}

export default function demo(kind) {
    const at = Date.now();
    const pc = drift(at);
    if (kind === "pc") return { at, pc, music: null };
    if (kind === "music") return { at, pc: { online: false }, music };
    if (kind === "off") return { at, pc: { online: false }, music: null };
    if (kind === "away") return { at, pc: { ...pc, status: "away", app: undefined, appInfo: undefined }, music: null };
    return { at, pc, music };
}
