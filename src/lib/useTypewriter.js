import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// A different one from `pick` than the last, so the text always visibly changes
const pickOther = (pick, current) => {
    for (let tries = 0; tries < 5; tries++) {
        const next = pick();
        if (next !== current) return next;
    }
    return current;
};

// Types out a phrase from `pick` in about `duration` ms, holds it for `hold` ms, deletes it
// (twice as fast) and types a new one, forever. `typing` is true while letters are coming or going.
const useTypewriter = (pick, { duration = 500, hold = 10_000 } = {}) => {
    const still = useReducedMotion();
    const [target, setTarget] = useState(pick);
    const [shown, setShown] = useState(still ? target.length : 0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const perLetter = duration / target.length;
        let timer;
        if (deleting) {
            if (shown > 0) {
                timer = setTimeout(() => setShown((n) => n - 1), perLetter / 2);
            } else {
                setTarget(pickOther(pick, target));
                setDeleting(false);
            }
        } else if (shown < target.length) {
            timer = setTimeout(() => setShown((n) => n + 1), perLetter);
        } else {
            timer = setTimeout(() => {
                if (!still) return setDeleting(true);
                // no typing for reduced motion: just swap the words
                const next = pickOther(pick, target);
                setTarget(next);
                setShown(next.length);
            }, hold);
        }
        return () => clearTimeout(timer);
    }, [pick, duration, hold, still, target, shown, deleting]);

    return { text: target.slice(0, shown), typing: deleting || shown < target.length, key: target };
};

export default useTypewriter;
