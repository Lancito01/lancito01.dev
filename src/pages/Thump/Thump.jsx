import { useOutletContext } from "react-router-dom";
import ThumpDemo from "../../Components/ThumpDemo/ThumpDemo";
import BeatGlows from "./BeatGlows";
import { useThumpColours } from "../../lib/thumpLoop";
import { thumpLinks } from "../../data/links";
import panelImage from "../../assets/thump/panel.webp";
import "../page.scss";
import "./Thump.scss";

const tuning = [
    ["lights locked to the kick, dark in between", "put the main lights on kick, raise contrast, lower release"],
    ["a rumbling sub that breathes", "bass role, sub weight up, release around 300 ms"],
    ["kicks being missed", "raise kick sensitivity a little"],
    ["the bassline setting off kicks", "lower kick sensitivity"],
    ["less flicker on busy tracks", "raise attack to 30–50 ms"],
];

const pipeline = `wasapi loopback --> fft --> 6 auto-levelled bands --+
                     '-> kick detector (per song) --+
album art --> palette ------------------------------+--> sync engine (50 hz) --> dtls --> hue bridge
screen (64x36) --> colour per light ----------------+`;

const Thump = () => {
    const { live } = useOutletContext();
    const colours = useThumpColours(live);

    return (
        <div className="wrap page thump">
            <BeatGlows colours={colours} />

            <h1 className="page__title">
                <span className="prompt">&gt;</span>
                <span className="thump__name">Thump</span>
            </h1>
            <p className="page__intro">
                bass-first music and screen sync for philips hue, for windows 10 and 11. it follows the kick and the
                sub, the bits you actually feel, instead of the hats and synths.
            </p>
            <div className="page__links">
                <a href={thumpLinks.download} target="_blank" rel="noreferrer">
                    download
                </a>
                <a href={thumpLinks.github} target="_blank" rel="noreferrer">
                    source
                </a>
            </div>

            <div className="thump__demo">
                <ThumpDemo live={live} />
                <p className="thump__caption mono">
                    a copy of thump&apos;s panel, coloured by what i&apos;m playing right now. the glows behind the page
                    are on the same beat: kick bottom left, clap top right, hats on the right and a pad up top.
                </p>
            </div>

            <section className="page__section">
                <h2>why i made it</h2>
                <p>
                    hue sync&apos;s music mode is tuned for &quot;average&quot; music: it blends the whole spectrum
                    into one loudness value. that&apos;s fine for pop, but on techno and house the lights end up
                    chasing the hats and synths instead of the kick. thump is built the other way round.
                </p>
                <p>
                    the sound is split into six bands (sub, bass, low-mid, mid, high and air). each band levels itself
                    out automatically, and you pick how much each one drives the lights. the defaults lean hard on the
                    low end.
                </p>
            </section>

            <section className="page__section">
                <h2>a kick detector that learns each track</h2>
                <p>a small model starts over on every song and learns, while it plays:</p>
                <ul>
                    <li>how hard this track&apos;s kick hits, so quiet and loud kicks both work</li>
                    <li>
                        what it sounds like, compared against hits that turned out not to be kicks, like rolling
                        basslines and claps
                    </li>
                    <li>the tempo, followed all the time, so dj pitch-riding, tempo ramps and hard cuts keep up</li>
                    <li>which 16th notes carry kicks, so four-on-the-floor and broken beats both work</li>
                </ul>
                <p>
                    it survives breakdowns, and there&apos;s no training data or model file: it&apos;s a few hundred
                    lines of c#.
                </p>
            </section>

            <section className="page__section">
                <h2>colours</h2>
                <figure className="thump__shot">
                    <img
                        src={panelImage}
                        alt="Thump's colours tab: album-art colours spread across four lights, with the live spectrum and kick indicator"
                        width="1104"
                        height="761"
                        loading="lazy"
                    />
                </figure>
                <ul>
                    <li>
                        <b>album art</b> (the default): the cover of whatever&apos;s playing, from spotify, a browser,
                        apple music, tidal or anything else that shows up in windows&apos; media overlay. every light
                        gets its own colour, and a cover with fewer colours than you have lights gets close variations.
                    </li>
                    <li>
                        <b>screen</b>: each light copies the part of the screen it sits next to, while the music can
                        still drive the brightness.
                    </li>
                    <li>
                        <b>presets and your own palettes</b>, stepping colour on every kick, drifting slowly or staying
                        put, with an optional hi-hat sparkle.
                    </li>
                </ul>
            </section>

            <section className="page__section">
                <h2>every light gets a role</h2>
                <p>
                    put a light on <b>kick</b> for a hard pulse and others on <b>bass</b>, <b>mix</b>,{" "}
                    <b>mids</b>, <b>highs</b> or <b>ambient</b>. it streams over the hue entertainment api (dtls, about
                    50 updates a second), the same low-latency path hue sync uses.
                </p>
            </section>

            <section className="page__section">
                <h2>tuning for techno and house</h2>
                <div className="thump__table">
                    <table>
                        <thead>
                            <tr>
                                <th>want</th>
                                <th>do</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tuning.map(([want, how]) => (
                                <tr key={want}>
                                    <td>{want}</td>
                                    <td>{how}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="page__section">
                <h2>how it works</h2>
                <pre className="thump__pipeline mono">{pipeline}</pre>
            </section>

            <section className="page__section">
                <h2>getting started</h2>
                <ol>
                    <li>
                        grab the installer from the{" "}
                        <a href={thumpLinks.download} target="_blank" rel="noreferrer">
                            latest release
                        </a>
                        . it installs just for you, no admin prompt.
                    </li>
                    <li>
                        make an entertainment area in the hue app and place the lights where they really are (screen
                        mode uses these spots).
                    </li>
                    <li>in thump, find your bridge, press its link button, pick the area and start the sync.</li>
                </ol>
                <p>
                    only one app can stream to an area at a time, so close hue sync first. closing the window keeps it
                    syncing from the tray, and it can start with windows and connect on its own.
                </p>
            </section>

            <section className="page__section">
                <h2>known limits</h2>
                <ul>
                    <li>a bassline that&apos;s louder than the kick in the 40–130 hz range can still hide it</li>
                    <li>screen mode can show black for exclusive-fullscreen games and drm video</li>
                    <li>only the main monitor is sampled</li>
                </ul>
            </section>

            <p className="page__note">
                thump is an independent open source project, not affiliated with or endorsed by philips or signify.
                &quot;philips hue&quot; and &quot;hue sync&quot; are trademarks of signify.
            </p>
        </div>
    );
};

export default Thump;
