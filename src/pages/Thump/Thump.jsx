import { useOutletContext } from "react-router-dom";
import ThumpDemo from "../../Components/ThumpDemo/ThumpDemo";
import BeatGlows from "./BeatGlows";
import { useThumpColours } from "../../lib/thumpLoop";
import { kickstepLinks, thumpLinks } from "../../data/links";
import panelImage from "../../assets/thump/panel.webp";
import "../page.scss";
import "./Thump.scss";

const tuning = [
    ["lights locked to the kick, dark in between", "put the main lights on kick, raise contrast, lower release"],
    ["a light on the backbeat", "clap role (claps, snares, rims), raise clap sensitivity if some are missed"],
    ["a light that shimmers with the hats", "hats role"],
    ["a rumbling sub that breathes", "bass role, sub weight up, release around 300 ms"],
    ["kicks being missed", "raise kick sensitivity a little"],
    ["the bassline setting off kicks", "lower kick sensitivity"],
    ["less flicker on busy tracks", "raise attack to 30–50 ms"],
];

const pipeline = `wasapi loopback --> fft --+--> 6 auto-levelled bands -----------+
                          +--> kickstep: kick, clap/snare, hats --+
                          '--> beat tracker (all onsets) ---------+
album art --> palette --------------------------------------------+--> sync engine (50 hz) --> dtls --> hue bridge
screen (64x36) --> colour per light ------------------------------+`;

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
                drums-first music and screen sync for philips hue, for windows 10 and 11. its own little neural
                network picks out every kick, clap and hi-hat as they play, and each light follows the drum you give
                it.
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
                    a copy of thump&apos;s panel, coloured by what i&apos;m playing right now, with a light each on the
                    kick, clap, hats and bass. the glows behind the page are on the same beat: kick bottom left, clap
                    top right, hats on the right and a pad up top.
                </p>
            </div>

            <section className="page__section">
                <h2>why i made it</h2>
                <p>
                    hue sync&apos;s music mode blends the whole spectrum into one loudness value. that&apos;s fine
                    for pop, but on electronic music the lights end up chasing the synths, the vocals and whatever is
                    loudest instead of the thing you actually move to: the drums. thump listens for the drums.
                </p>
                <p>
                    it hears whatever your pc plays, not the player, so spotify, youtube or a dj set in rekordbox all
                    work the same. crossfades, live blends, hard cuts and pitch-riding are fine too.
                </p>
            </section>

            <section className="page__section">
                <h2>kickstep, a drum detector that hears the groove</h2>
                <p>
                    the drums come from{" "}
                    <a href={kickstepLinks.github} target="_blank" rel="noreferrer">
                        kickstep
                    </a>
                    , a small neural network i trained for thump and released on its own. about 50 ms after a hit it
                    says whether it was a kick, a clap or snare (rims too) or a hi-hat:
                </p>
                <ul>
                    <li>
                        it hears the last ~4 seconds, so it judges every hit by where it sits in the groove as well as
                        by its sound. a quiet clap on the 2 and 4 still flashes.
                    </li>
                    <li>
                        the surer it is, the brighter the flash. below a minimum the light stays dark, so there are no
                        constant dim flickers, and the sensitivity sliders move how sure it has to be.
                    </li>
                    <li>
                        it never ties a pattern to a song, so it lets go of the old groove within a couple of bars
                        after a blend or a cut.
                    </li>
                    <li>its kicks also drive a tempo tracker that follows ramps and pitch-riding from 100 to 180 bpm</li>
                </ul>
                <p>
                    on top of the drums, the sound is split into six bands (sub, bass, low-mid, mid, high and air)
                    that level themselves out, so lights can still breathe with the sub or the whole mix.
                </p>
            </section>

            <section className="page__section">
                <h2>colours</h2>
                <figure className="thump__shot">
                    <img
                        src={panelImage}
                        alt="Thump's colours tab: album-art colours spread across four lights, with the live spectrum and the kick, clap and hats indicators"
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
                    <b>kick</b> and <b>clap</b> flash on their drum and stay dark in between, <b>hats</b> shimmers,{" "}
                    <b>bass</b> and <b>mix</b> follow the low end or the whole track, <b>mids</b> and <b>highs</b> the
                    synths and cymbals, and <b>ambient</b> ignores the music. it streams over the hue entertainment api
                    (dtls, about 50 updates a second), the same low-latency path hue sync uses.
                </p>
            </section>

            <section className="page__section">
                <h2>tuning</h2>
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
                    <li>
                        kickstep still misses some claps and snares, mostly unusual or heavily processed ones and muted
                        pre-drop snares. it would rather miss a clap than fake one.
                    </li>
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
