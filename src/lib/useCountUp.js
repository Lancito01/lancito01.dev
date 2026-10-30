import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

// A number that counts up from 0 to `target` when it first shows, and moves to each new
// target after that instead of jumping. Given `glide` (seconds), later changes move at a
// steady pace over that long, so a reading that lands every 10 seconds ticks along the whole
// time like it's live, rather than snapping over and then sitting still.
const useCountUp = (target, duration = 0.9, glide = undefined) => {
    const still = useReducedMotion();
    const [value, setValue] = useState(still ? target : 0);
    const current = useRef(value);
    const counted = useRef(false); // the first count-up has finished

    useEffect(() => {
        if (still) {
            current.current = target;
            setValue(target);
            return undefined;
        }
        const options =
            counted.current && glide
                ? { duration: glide, ease: "linear" }
                : { duration, ease: [0.2, 0.7, 0.2, 1], onComplete: () => (counted.current = true) };
        const controls = animate(current.current, target, {
            ...options,
            onUpdate: (latest) => {
                current.current = latest;
                setValue(latest);
            },
        });
        return () => controls.stop();
        // A new glide length alone isn't worth restarting the current move for
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, duration, still]);

    return value;
};

export default useCountUp;
