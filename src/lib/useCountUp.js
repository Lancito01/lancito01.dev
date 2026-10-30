import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

// A number that counts up from 0 to `target` when it first shows, and glides to each new
// target after that, instead of jumping
const useCountUp = (target, duration = 0.9) => {
    const still = useReducedMotion();
    const [value, setValue] = useState(still ? target : 0);
    const current = useRef(value);

    useEffect(() => {
        if (still) {
            current.current = target;
            setValue(target);
            return undefined;
        }
        const controls = animate(current.current, target, {
            duration,
            ease: [0.2, 0.7, 0.2, 1],
            onUpdate: (latest) => {
                current.current = latest;
                setValue(latest);
            },
        });
        return () => controls.stop();
    }, [target, duration, still]);

    return value;
};

export default useCountUp;
