// What Tau's wheels offer for a file, ported from the app's own src/catalog.rs, plus what the site's
// demo pretends happens when you pick something. Nothing here touches a real file.

export const KINDS = ["Convert", "Tools", "Actions"];

// sizes are in KB
export const tauSamples = [
    { id: "sunset", name: "sunset.jpg", size: 2460, art: "sunset" },
    { id: "clip", name: "clip.mkv", size: 148000 },
    { id: "memo", name: "memo.wav", size: 38400 },
    { id: "report", name: "report.pdf", size: 1120 },
    { id: "notes", name: "notes.md", size: 6 },
    { id: "budget", name: "budget.csv", size: 18 },
    { id: "photos", name: "photos.zip", size: 84200 },
];

const CATEGORIES = {
    image: ["jpg", "jpeg", "png", "webp", "heic", "heif", "tif", "tiff", "avif", "bmp", "svg"],
    video: ["mp4", "mov", "mkv", "webm", "avi", "wmv", "gif", "m4v"],
    audio: ["mp3", "m4a", "wav", "flac", "ogg", "opus", "aiff", "aif", "wma", "aac"],
    pdf: ["pdf"],
    doc: ["docx", "doc", "md", "markdown", "txt", "rtf", "html", "htm", "odt"],
    slides: ["ppt", "pptx"],
    sheet: ["xlsx", "xls", "ods", "csv", "tsv"],
    epub: ["epub"],
    sub: ["srt", "vtt"],
    archive: ["zip", "tar", "gz", "tgz", "rar", "7z"],
};

export const extOf = (name) => (name.includes(".") ? name.split(".").pop().toLowerCase() : "");
const stemOf = (name) => (name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name);

export function categoryOf(file) {
    if (file.folder) return "folder";
    const ext = extOf(file.name);
    return Object.keys(CATEGORIES).find((cat) => CATEGORIES[cat].includes(ext)) ?? "other";
}

const format = (id) => ({ id, label: id.toUpperCase() });
const needs = (id, why) => ({ ...format(id), blocked: why });

// The pretend PC has every optional engine except Word, so one choice shows how Tau dims what it can't do
const NEED_WORD = "Needs Word";

function convertTargets(cat, ext) {
    const lists = {
        image: ["jpg", "png", "webp", "heic", "tiff", "avif", "bmp", "pdf"].map(format),
        video: ["mp4", "mov", "mkv", "webm", "avi", "wmv", "gif", "mp3"].map(format),
        audio: ["mp3", "m4a", "wav", "flac", "ogg", "opus", "aiff", "wma"].map(format),
        pdf: [needs("docx", NEED_WORD), ...["pptx", "xlsx", "jpg", "png", "epub", "txt", "md"].map(format)],
        doc: [needs("docx", NEED_WORD), ...["pdf", "txt", "md", "html", "epub", "png", "jpg"].map(format)],
        slides: ["pdf", "jpg", "png", "pptx"].map(format),
        sheet: ["xlsx", "ods", "csv", "tsv", "pdf"].map(format),
        epub: [format("pdf"), needs("docx", NEED_WORD), ...["txt", "md", "html"].map(format)],
        sub: ["srt", "vtt", "txt"].map(format),
        archive: ["zip", "tar", "gz"].map(format),
        folder: ["zip", "tar", "gz"].map(format),
    };
    const same = { jpeg: "jpg", tif: "tiff", markdown: "md", htm: "html", aif: "aiff", heif: "heic" };
    return (lists[cat] ?? []).filter((entry) => entry.id !== (same[ext] ?? ext));
}

const tool = (id, label) => ({ id, label });

const TOOLS = {
    image: [
        tool("compress", "COMPRESS"),
        tool("clean", "METADATA"),
        tool("edit", "EDIT"),
        tool("annotate", "ANNOTATE"),
        tool("background", "ADD BG"),
        tool("crop", "CROP"),
        tool("redact", "REDACT"),
    ],
    video: [
        tool("compress", "COMPRESS"),
        tool("metadata", "METADATA"),
        tool("mute", "MUTE"),
        tool("trim", "TRIM"),
        tool("crop", "CROP"),
        tool("speed", "SPEED"),
        tool("snapshot", "SNAPSHOT"),
        tool("split", "SPLIT"),
        tool("redact", "REDACT"),
    ],
    audio: [
        tool("compress", "COMPRESS"),
        tool("metadata", "METADATA"),
        tool("normalize", "NORMALIZE"),
        tool("visualize", "VISUALIZE"),
        tool("trim", "TRIM"),
        tool("channels", "CHANNELS"),
        tool("bleep", "BLEEP"),
    ],
    pdf: [
        tool("compress", "COMPRESS"),
        tool("metadata", "METADATA"),
        tool("split", "SPLIT"),
        tool("organize", "ORGANIZE"),
    ],
    archive: [tool("extract", "EXTRACT")],
};

const ACTIONS = [
    tool("share", "SHARE"),
    tool("shelf", "SHELF"),
    tool("copy", "COPY"),
    tool("move", "MOVE"),
    tool("path", "COPY PATH"),
    tool("terminal", "TERMINAL"),
];

export function entriesFor(file, kind) {
    const cat = categoryOf(file);
    if (KINDS[kind] === "Actions") return ACTIONS;
    if (KINDS[kind] === "Tools") return TOOLS[cat] ?? [];
    return convertTargets(cat, extOf(file.name));
}

// How big each format tends to come out next to the others, so the fake sizes look about right
const WEIGHTS = {
    image: { jpg: 1, jpeg: 1, png: 2.6, webp: 0.6, heic: 0.5, tiff: 3.4, avif: 0.45, bmp: 5, pdf: 1.02 },
    video: { mp4: 1, mov: 1.02, mkv: 1, webm: 0.8, avi: 1.4, wmv: 1.3, gif: 4, mp3: 0.04 },
    audio: { wav: 10, aiff: 10, flac: 5.5, mp3: 1, m4a: 0.9, ogg: 0.85, opus: 0.7, wma: 1 },
};

// The same wording the app uses for its quality notes, for the conversions that have one
function convertNote(cat, ext, target) {
    if (cat === "video" && target === "mp3") return "The audio is re-encoded at a bitrate matched to the source.";
    if (cat === "video" && ["mp4", "mov", "mkv"].includes(target)) {
        return "The codecs already fit, so the video and audio move across bit for bit.";
    }
    if (cat === "video") return "The source is lossy, so re-encoding loses a little. Bitrate is matched to the source.";
    if (cat === "image" && target === "pdf") return "The JPEG goes into the PDF untouched.";
    if (cat === "audio" && ["flac", "aiff"].includes(target)) return "A lossless source stays lossless.";
    return null;
}

const REMUX = ["mp4", "mov", "mkv"];

// [progress title, what the result's name gets, how much of the size it keeps, note]
const TOOL_RESULTS = {
    compress: ["Compressing", " compressed", 0.42, "In Tau you pick how far to go first. It keeps the smaller file."],
    clean: ["Removing metadata", " clean", 0.99, null],
    mute: ["Muting", " muted", 0.9, null],
    normalize: ["Normalizing", " normalized", 1, null],
    visualize: ["Rendering video", " visualized", 1.6, null],
};

const OPENS_A_WINDOW = {
    metadata: "shows a form with the file's tags",
    edit: "opens a window to adjust the picture",
    annotate: "opens an editor to draw on the picture",
    background: "asks for a colour or gradient",
    crop: "opens an editor to drag out the crop",
    redact: "opens an editor to mark what to cover",
    trim: "opens a timeline to set the cut",
    speed: "asks how fast",
    snapshot: "opens a timeline to pick the frames",
    split: "asks where to cut",
    channels: "asks for mono or stereo",
    bleep: "opens a timeline to mark the bleeps",
    organize: "opens the pages to reorder",
};

const ACTION_RESULTS = {
    share: "The Windows share sheet opens here.",
    shelf: "It'd wait on the shelf, a small window you can drag files back out of.",
    copy: "Ready to paste into any folder.",
    move: "Tau asks for a folder, then moves it there.",
    terminal: "A terminal opens in this folder.",
};

// Windows-style names, same as Tau's: the first free one out of "name.png", "name (2).png"...
function freeName(stem, ext, files) {
    const dot = ext ? `.${ext}` : "";
    const taken = new Set(files.map((file) => file.name.toLowerCase()));
    if (!taken.has(`${stem}${dot}`.toLowerCase())) return `${stem}${dot}`;
    let n = 2;
    while (taken.has(`${stem} (${n})${dot}`.toLowerCase())) n++;
    return `${stem} (${n})${dot}`;
}

// What the demo does for an option: a job with a progress bar and a new file at the end of it, or
// just a line saying what the real app would do. `makeResult` takes the folder as it is by then.
export function planFor(file, entry, kind) {
    const cat = categoryOf(file);
    const ext = extOf(file.name);
    const stem = stemOf(file.name);

    if (KINDS[kind] === "Convert") {
        const weights = WEIGHTS[cat];
        const ratio = weights ? (weights[entry.id] ?? 1) / (weights[ext] ?? 1) : 1;
        const remux = cat === "video" && REMUX.includes(ext) && REMUX.includes(entry.id);
        return {
            title: `Converting to ${entry.label}`,
            detail: convertNote(cat, ext, entry.id),
            ms: remux ? 650 : 1300,
            makeResult: (files) => ({
                name: freeName(stem, entry.id, files),
                size: Math.max(1, Math.round(file.size * ratio)),
            }),
        };
    }

    if (KINDS[kind] === "Actions") {
        if (entry.id === "path") return { title: "Path copied", detail: `C:\\Users\\you\\Demo files\\${file.name}` };
        return { title: entry.label[0] + entry.label.slice(1).toLowerCase(), detail: ACTION_RESULTS[entry.id] };
    }

    if (entry.id === "extract") {
        return {
            title: "Extracting",
            detail: null,
            ms: 1100,
            makeResult: (files) => ({ name: freeName(stem, "", files), folder: true, size: Math.round(file.size * 1.3) }),
        };
    }

    const result = TOOL_RESULTS[entry.id];
    if (result) {
        const [title, suffix, keeps, detail] = result;
        return {
            title,
            detail,
            ms: 1100,
            makeResult: (files) => ({
                name: freeName(`${stem}${suffix}`, entry.id === "visualize" ? "mp4" : ext, files),
                size: Math.max(1, Math.round(file.size * keeps)),
            }),
        };
    }

    return {
        title: entry.label[0] + entry.label.slice(1).toLowerCase(),
        detail: `In Tau this ${OPENS_A_WINDOW[entry.id]}.`,
    };
}

export function formatSize(kb) {
    if (kb < 1000) return `${kb} KB`;
    if (kb < 1000000) return `${(kb / 1000).toFixed(kb < 10000 ? 1 : 0)} MB`;
    return `${(kb / 1000000).toFixed(1)} GB`;
}
