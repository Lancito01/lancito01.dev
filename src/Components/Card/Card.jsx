import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ title, description, link, github = "", download = "", information = "", playLink = "" }) => {
    return (
        <div className="card flex flex-col justify-between project w-60 sm:w-96 p-4 m-4 rounded-md" onMouseMove={(e) => {
            const currTarget = e.currentTarget;

            // const cardXMin = 0;
            const cardXMax = currTarget.getBoundingClientRect().width;
            const clientX = e.clientX - currTarget.getBoundingClientRect().x;
            let result = clientX / cardXMax * 2 - 1;
            result = result * 45;
            currTarget.style.transform = `rotateY(${result}deg)`;

            // const cardYMin = 0;
            //const cardYMax = currTarget.getBoundingClientRect().height;
            //const clientY = e.clientY - currTarget.getBoundingClientRect().y;
            //result = clientY / cardYMax * 2 - 1;
            //result = result * 45;
            //currTarget.style.transform += ` rotateX(${-result}deg)`;
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg)";
        }}>
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
        </div>
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

