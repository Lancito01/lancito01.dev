import TauDemo from "../../Components/TauDemo/TauDemo";
import TauWheels from "../../Components/TauDemo/TauWheels";
import { tauLinks } from "../../data/links";
import "../page.scss";
import "./Tau.scss";

const Tau = () => (
    <div className="wrap page tau">
        <h1 className="page__title">
            <span className="prompt">&gt;</span>
            <span className="tau__name">Tau</span>
        </h1>
        <p className="page__intro">
            a small windows utility for converting and working with files without opening a separate app. drag a file,
            tap the win key, then drop it on an option. files stay on your pc, and results are saved beside the
            originals.
        </p>
        <div className="page__links">
            <a href={tauLinks.download} target="_blank" rel="noreferrer">
                download
            </a>
            <a href={tauLinks.github} target="_blank" rel="noreferrer">
                source
            </a>
        </div>

        <div className="tau__demo">
            <div className="tau__try" aria-hidden="true">
                <svg viewBox="0 0 84 66" width="84" height="66">
                    <path d="M80 12C58 3 28 8 15 49" />
                    <path d="M5 34c3 6 6 11 9 17 6-3 12-5 19-7" />
                </svg>
                <span>try me!</span>
            </div>
            <TauDemo />
            <p className="tau__caption mono">
                these files are made up and everything here is simulated, so nothing gets converted, uploaded or
                downloaded. docx is dimmed on purpose: tau greys out what it can&apos;t do, and this pretend pc has no
                word.
            </p>
        </div>

        <section className="page__section">
            <h2>what it does</h2>
            <ul>
                <li>
                    <b>convert</b> images, audio, video, pdfs, documents, spreadsheets, slides, epubs, subtitles and
                    archives
                </li>
                <li>
                    <b>use file tools</b> to compress, crop, redact, annotate, trim, merge, split and edit supported
                    files
                </li>
                <li>
                    <b>run file actions</b> to copy, move, share, copy a path, open a terminal or collect files on a
                    shelf
                </li>
                <li>
                    <b>work with batches</b> where an operation supports multiple selected files
                </li>
            </ul>
            <p>conversions run locally, you can cancel from the progress window, and existing files are never overwritten.</p>
            <div className="tau__wheels">
                <TauWheels />
            </div>
        </section>

        <section className="page__section">
            <h2>how to use it</h2>
            <ol>
                <li>install tau and start it. it runs from the system tray.</li>
                <li>drag a file, or a selection of files, from file explorer.</li>
                <li>tap win to open the wheel. scroll during the drag to switch between convert, tools and actions.</li>
                <li>drop the file on the option you want. tau saves the result beside the source.</li>
            </ol>
            <p>
                from the keyboard, select a file in explorer and press <b>ctrl+alt+space</b>. the arrow keys choose an
                option, enter runs it and esc closes the wheel. you can change the shortcut in settings, or give each
                wheel its own key.
            </p>
        </section>

        <section className="page__section">
            <h2>quality</h2>
            <p>tau keeps as much of the original as the target format allows, in this order:</p>
            <ol>
                <li>
                    <b>copy the original data.</b> when the codecs already fit the target, video and audio move across
                    bit for bit, like mkv to mp4 or a jpeg into a pdf.
                </li>
                <li>
                    <b>lossless encode, for edits that keep the format.</b> redact, crop, trim, split, speed and join
                    keep every other pixel exactly as decoded, along with bit depth, hdr tags and all audio and subtitle
                    tracks.
                </li>
                <li>
                    <b>what the source is worth, when converting.</b> a lossless source stays lossless wherever the
                    target can hold it. a lossy one goes to the new codec at very high quality, capped at a bitrate
                    matched to the source.
                </li>
                <li>
                    <b>the top setting, for formats that are lossy by nature.</b> the progress card says so when a
                    format has to give something up.
                </li>
            </ol>
            <p>only compress gives quality away, by the amount you choose.</p>
        </section>

        <section className="page__section">
            <h2>getting started</h2>
            <p>
                grab the installer from the{" "}
                <a href={tauLinks.download} target="_blank" rel="noreferrer">
                    latest release
                </a>
                . it installs just for you, no admin prompt.
            </p>
            <p>
                audio and video conversion, plus webp and avif images, use ffmpeg. it isn&apos;t bundled, so put{" "}
                <code>ffmpeg.exe</code> on your path or next to <code>tau.exe</code>. some document conversions use word,
                excel or powerpoint, and html to pdf uses edge. options that need something you don&apos;t have stay
                visible but dimmed, and tau shows why.
            </p>
        </section>
    </div>
);

export default Tau;
