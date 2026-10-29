// Sample answers for previewing the live strip in `vite dev` with ?demo, ?demo=pc,
// ?demo=music or ?demo=away. Never bundled into the production build.

const pc = {
    online: true,
    status: "active",
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

export default function demo(kind) {
    const at = Date.now();
    if (kind === "pc") return { at, pc, music: null };
    if (kind === "music") return { at, pc: { online: false }, music };
    if (kind === "away") return { at, pc: { ...pc, status: "away", app: undefined, appInfo: undefined }, music: null };
    return { at, pc, music };
}
