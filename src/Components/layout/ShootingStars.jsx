import { useEffect, useState } from "react";
import useMediaQuery from "../../lib/useMediaQuery";
import "./ShootingStars.scss";

const random = (min, max) => min + Math.random() * (max - min);

// Every so often a star streaks across the background behind the page
const ShootingStars = () => {
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");
    const [stars, setStars] = useState([]);

    useEffect(() => {
        if (still) return;
        let timer;
        let id = 0;

        const launch = () => {
            // only while someone's looking, so they don't pile up in a background tab
            if (!document.hidden) {
                // somewhere in the top half, heading down and to the left or right
                const tilt = random(12, 32);
                setStars((current) => [
                    ...current,
                    {
                        id: id++,
                        x: random(10, 90),
                        y: random(0, 45),
                        angle: Math.random() < 0.5 ? tilt : 180 - tilt,
                        distance: random(450, 750),
                        length: random(180, 300),
                        duration: random(1.6, 2.4),
                    },
                ]);
            }
            timer = setTimeout(launch, random(15_000, 30_000));
        };

        timer = setTimeout(launch, random(2_500, 6_000));
        return () => clearTimeout(timer);
    }, [still]);

    return (
        <div className="shooting-stars" aria-hidden="true">
            {stars.map((star) => (
                <span
                    key={star.id}
                    className="shooting-stars__path"
                    style={{ left: `${star.x}%`, top: `${star.y}%`, transform: `rotate(${star.angle}deg)` }}
                >
                    <span
                        className="shooting-stars__star"
                        style={{
                            "--distance": `${star.distance}px`,
                            "--length": `${star.length}px`,
                            "--duration": `${star.duration}s`,
                        }}
                        // once the last of its animations is done, not the first
                        onAnimationEnd={(event) =>
                            event.animationName === "shooting-star-fade" &&
                            setStars((current) => current.filter((s) => s.id !== star.id))
                        }
                    />
                </span>
            ))}
        </div>
    );
};

export default ShootingStars;
