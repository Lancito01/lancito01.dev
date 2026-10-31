import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { animate, motion, useMotionValue } from "motion/react";
import PropTypes from "prop-types";
import ObsPill from "../ObsPill/ObsPill";
import ThumpLights from "../ThumpLights/ThumpLights";
import useMediaQuery from "../../lib/useMediaQuery";
import { andyScriptLinks, obsHudLinks, thumpLinks } from "../../data/links";
import { randomHex } from "../../lib/hue";
import botImage from "../../assets/showcase/showcase-1.webp";
import "./ProjectBoard.scss";

const settle = { type: "spring", stiffness: 300, damping: 32 };

const BoardCard = ({ id, index, rotate, place, boardRef, draggable, z, tidyKey, onPickUp, className, children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const lastDragEnd = useRef(0);
    // On a window resize, motion's drag keeps each card at the same fraction of the free space
    // (board width minus card width), so the starting spots are measured the same way or they drift apart
    const spot = { left: `calc(${place.at} * (100% - var(--width)))`, top: place.top };

    useEffect(() => {
        // links and images would otherwise start the browser's own drag-and-drop
        const card = ref.current;
        const stopNativeDrag = (event) => event.preventDefault();
        card.addEventListener("dragstart", stopNativeDrag);
        return () => card.removeEventListener("dragstart", stopNativeDrag);
    }, []);

    useEffect(() => {
        if (tidyKey === 0 && draggable) return;
        animate(x, 0, settle);
        animate(y, 0, settle);
    }, [tidyKey, draggable, x, y]);

    return (
        <motion.div
            ref={ref}
            className={`board-card ${className}`}
            style={{ ...(draggable && spot), x, y, zIndex: z }}
            initial={{ opacity: 0, scale: 1.06, rotate: rotate - 4 }}
            whileInView={{ opacity: 1, scale: 1, rotate }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...settle, delay: index * 0.09 }}
            drag={draggable}
            // without a ref, motion's resize handler leaves the stacked phone layout alone
            dragConstraints={draggable ? boardRef : false}
            dragElastic={0.1}
            dragTransition={{ power: 0.15, timeConstant: 180, bounceStiffness: 400, bounceDamping: 40 }}
            whileDrag={{ scale: 1.04, rotate: rotate / 3 }}
            onPointerDown={() => onPickUp(id)}
            onDragEnd={() => {
                lastDragEnd.current = performance.now();
            }}
            onClickCapture={(event) => {
                // letting go of a card over a link shouldn't follow the link
                if (performance.now() - lastDragEnd.current < 200) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }}
        >
            {children}
        </motion.div>
    );
};

BoardCard.propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    rotate: PropTypes.number.isRequired,
    // where the card sits on the desktop board: `at` runs 0 (left edge) to 1 (right edge), `top` is in px
    place: PropTypes.shape({ at: PropTypes.number, top: PropTypes.number }).isRequired,
    boardRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
    draggable: PropTypes.bool.isRequired,
    z: PropTypes.number.isRequired,
    // bumping this sends the card back to its starting spot
    tidyKey: PropTypes.number.isRequired,
    onPickUp: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
};

const HueSwatch = () => {
    const [hex, setHex] = useState("#3FB6E8");
    return (
        <button
            type="button"
            className="board-card__swatch mono"
            style={{ backgroundColor: hex }}
            onClick={() => setHex(randomHex())}
            title="shuffle"
        >
            {hex}
        </button>
    );
};

const ThumpCard = () => {
    const { live } = useOutletContext();
    return (
        <>
            <div className="board-card__top mono">
                <span>Lancito01/thump</span>
                <span className="board-card__tag">windows · c# · hue</span>
            </div>
            <h3>Thump</h3>
            <p>
                music sync for philips hue that follows the kick and the sub. it learns each track&apos;s kick as it
                plays and colours every light from the album art.
            </p>
            <ThumpLights live={live} />
            <div className="board-card__links">
                <Link to="/thump">read more</Link>
                <a href={thumpLinks.download} target="_blank" rel="noreferrer">
                    download
                </a>
                <a href={thumpLinks.github} target="_blank" rel="noreferrer">
                    source
                </a>
            </div>
        </>
    );
};

const cards = [
    {
        id: "thump",
        className: "board-card--thump",
        rotate: 1.5,
        place: { at: 0.04, top: 410 },
        content: <ThumpCard />,
    },
    {
        id: "obs-hud",
        className: "board-card--obs",
        rotate: -2,
        place: { at: 0.06, top: 48 },
        content: (
            <>
                <div className="board-card__top mono">
                    <span>Lancito01/obs-hud</span>
                    <span className="board-card__tag">windows · c#</span>
                </div>
                <h3>obs-hud</h3>
                <p>
                    see at a glance whether obs is recording or buffering, with a pop-up and a sound every time
                    something happens.
                </p>
                <ObsPill />
                <div className="board-card__links">
                    <Link to="/obs-hud">read more</Link>
                    <a href={obsHudLinks.download} target="_blank" rel="noreferrer">
                        download
                    </a>
                    <a href={obsHudLinks.github} target="_blank" rel="noreferrer">
                        source
                    </a>
                </div>
            </>
        ),
    },
    {
        id: "andyscript",
        className: "board-card--paper board-card--script",
        rotate: 2.5,
        place: { at: 0.57, top: 88 },
        content: (
            <>
                <h3>AndyScript</h3>
                <p>lua script for stand, the gta v mod menu. shortcuts, chaos mode, a spooner and more. updates itself.</p>
                <div className="board-card__links board-card__links--small mono">
                    <Link to="/andyscript">read more</Link>
                    <a href={andyScriptLinks.github} target="_blank" rel="noreferrer">
                        github
                    </a>
                </div>
            </>
        ),
    },
    {
        id: "hueguessr",
        className: "board-card--paper board-card--hue",
        rotate: -3.5,
        place: { at: 0.93, top: 54 },
        content: (
            <>
                <HueSwatch />
                <h3>HueGuessr</h3>
                <p>
                    see a colour, guess the hex. <Link to="/games/hueguessr">play it</Link>
                </p>
            </>
        ),
    },
    {
        id: "andybot",
        className: "board-card--paper board-card--bot",
        rotate: 6,
        place: { at: 0.88, top: 330 },
        content: (
            <figure>
                <img src={botImage} alt="A car on a freeway at sunset, drawn by AndyBot" />
                <figcaption>
                    <Link to="/andybot">AndyBot</Link> · older discord bot
                </figcaption>
            </figure>
        ),
    },
    {
        id: "more",
        className: "board-card--note",
        rotate: -4,
        place: { at: 0.6, top: 352 },
        content: (
            <>
                <h3>more on github</h3>
                <p>discord bots, a finance helper, a file downloader in svelte and other experiments.</p>
                <a href="https://github.com/lancito01?tab=repositories" target="_blank" rel="noreferrer">
                    see all repos
                </a>
            </>
        ),
    },
];

const ProjectBoard = () => {
    const boardRef = useRef(null);
    const draggable = !useMediaQuery("(max-width: 760px)");
    const [order, setOrder] = useState(() => cards.map((card) => card.id));
    const [tidyKey, setTidyKey] = useState(0);

    const pickUp = (id) => setOrder((current) => [...current.filter((other) => other !== id), id]);

    return (
        <section className="wrap board-section" aria-labelledby="board-title">
            <div className="board-section__head">
                <h2 id="board-title">things i&apos;ve made</h2>
                {draggable && (
                    <span className="mono">
                        drag them around ·{" "}
                        <button type="button" onClick={() => setTidyKey((key) => key + 1)}>
                            tidy up
                        </button>
                    </span>
                )}
            </div>
            <div className="board" ref={boardRef}>
                {cards.map(({ content, ...card }, index) => (
                    // fresh cards when switching layouts, or motion carries drag measurements over from the other one
                    <BoardCard
                        key={`${card.id}-${draggable}`}
                        {...card}
                        index={index}
                        boardRef={boardRef}
                        draggable={draggable}
                        z={order.indexOf(card.id) + 1}
                        tidyKey={tidyKey}
                        onPickUp={pickUp}
                    >
                        {content}
                    </BoardCard>
                ))}
            </div>
        </section>
    );
};

export default ProjectBoard;
