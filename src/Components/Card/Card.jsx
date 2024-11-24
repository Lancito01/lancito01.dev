import { useRef } from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ title, description, link, github = "", download = "", information = "", playLink = "" }) => {
    const cardRef = useRef(null);
    let currTarget;

    const shadowOffset = 8;
    function handleMouseMove(e) {
        currTarget = cardRef.current;
        const boundrect = currTarget.getBoundingClientRect();

        const clientX = e.clientX - boundrect.x;
        const resultX = (clientX / boundrect.width * 2 - 1);

        const clientY = e.clientY - boundrect.y;
        const resultY = (clientY / boundrect.height * 2 - 1);

        currTarget.style.transition = "none";
        currTarget.style.transform = `scale(1.05) rotateX(${-resultY * 0.01}turn) rotateY(${resultX * 0.01}turn)`;
        currTarget.style.boxShadow = `${-resultX * shadowOffset}px ${-resultY * shadowOffset}px 10px 5px rgba(0, 0, 0, 0.4)`;
    }

    function handleMouseLeave() {
        setTimeout(() => {
            currTarget.style.transition = "all 0.2s";
            currTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
            currTarget.style.boxShadow = "0px 0px 10px 5px rgba(0, 0, 0, 0.3)";
        }, 50)
    }

    return (
        <div className="card flex flex-col justify-between project w-60 sm:w-96 p-4 m-4 rounded-md"
            onMouseMove={(e) => { requestAnimationFrame(() => handleMouseMove(e)) }}
            onMouseLeave={(e) => { handleMouseLeave(e) }}
            ref={cardRef}
        >
            <a
                className="text-xl project-title mx-auto w-fit block"
                href={"/" + link}
            >
                {title}
            </a>
            <p className="pt-2 text-sm text-justify">
                {description}
            </p>
            <div className="flex justify-evenly">
                {github && (<a
                    className="text-sm"
                    href={github}
                >
                    <i className="fa-brands fa-github fa-lg mt-6 mb-2" />{" "}
                    Github
                </a>)}
                {download && (<a
                    className="text-sm"
                    href={download}
                >
                    <i className="fa-solid fa-download fa-lg mt-6 mb-2" />{" "}
                    Download
                </a>)}
                {information && (<div className="flex justify-evenly">
                    <a className="text-sm" href={information}>
                        <i className="fa-solid fa-circle-info fa-lg mt-6 mb-2" />{" "}
                        Information
                    </a>
                </div>)}
                {playLink && (<div className="flex justify-evenly">
                    <a className="text-sm" href={"/" + playLink}>
                        <i className="fa-solid fa-play fa-lg mt-6 mb-2" />{" "}
                        Play
                    </a>
                </div>)}
            </div>
        </div >
    )
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    github: PropTypes.string,
    download: PropTypes.string,
    information: PropTypes.string,
    playLink: PropTypes.string,
};

export default Card

