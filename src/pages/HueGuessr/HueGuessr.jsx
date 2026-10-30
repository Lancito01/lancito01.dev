import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "motion/react";
import { accuracy, expandHex, isHexGuess, randomHex } from "../../lib/hue";
import "../page.scss";
import "./HueGuessr.scss";

const verdict = (score) => {
    if (score >= 95) return "basically perfect.";
    if (score >= 85) return "really close!";
    if (score >= 70) return "not bad.";
    return "way off. again?";
};

const HueGuessr = () => {
    const [target, setTarget] = useState(randomHex);
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);

    // The page's accent is the colour to guess, in place of the song or presence colour
    const { setAccentOverride } = useOutletContext();
    useEffect(() => {
        setAccentOverride(target);
        return () => setAccentOverride(null);
    }, [target, setAccentOverride]);

    const onInputChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/^#/, "");
        if (/^[0-9A-F]{0,6}$/.test(value)) setInput(value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!isHexGuess(input)) return;
        const guess = expandHex(input);
        setResult({ guess, score: accuracy(target, guess) });
    };

    const restart = () => {
        setTarget(randomHex());
        setInput("");
        setResult(null);
    };

    return (
        <div className="wrap page hue-game">
            <h1 className="page__title">
                <span className="prompt">&gt;</span>HueGuessr
            </h1>
            <p className="page__intro">
                here&apos;s a colour. type the hex code you think it is and see how close you get.
            </p>

            <div className="hue-game__swatches">
                <figure>
                    <div className="hue-game__swatch" style={{ backgroundColor: target }} />
                    <figcaption className="mono">
                        the colour <b>{result ? target : "#??????"}</b>
                    </figcaption>
                </figure>
                <figure>
                    <div className="hue-game__swatch hue-game__swatch--guess">
                        {result && (
                            <motion.div
                                key={result.guess}
                                className="hue-game__fill"
                                style={{ backgroundColor: result.guess }}
                                initial={{ clipPath: "inset(0 100% 0 0)" }}
                                animate={{ clipPath: "inset(0 0% 0 0)" }}
                                transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                            />
                        )}
                    </div>
                    <figcaption className="mono">
                        your guess <b>{result ? result.guess : "…"}</b>
                    </figcaption>
                </figure>
            </div>

            {result ? (
                <motion.div
                    className="hue-game__result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                >
                    <p>
                        <b>{result.score}%</b> {verdict(result.score)}
                    </p>
                    <button type="button" className="hue-game__button" onClick={restart}>
                        play again
                    </button>
                </motion.div>
            ) : (
                <form className="hue-game__form" onSubmit={handleFormSubmit}>
                    <label className="hue-game__input mono">
                        <span>#</span>
                        <input
                            value={input}
                            onChange={onInputChange}
                            maxLength={7}
                            placeholder="3FB6E8"
                            aria-label="Your hex code guess"
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </label>
                    <button type="submit" className="hue-game__button" disabled={!isHexGuess(input)}>
                        guess
                    </button>
                </form>
            )}
        </div>
    );
};

export default HueGuessr;
