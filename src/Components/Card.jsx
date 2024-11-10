const Card = ({ title, description, github = "", download = "", information = "", playLink = "" }) => {
    return (
        <div className="flex flex-col justify-between project w-60 sm:w-96 p-4 m-4 rounded-md">
            <a
                className="text-xl project-title mx-auto w-fit block"
                href="/andyscript"
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
                    <a className="text-sm" href={playLink}>
                        <i className="fa-solid fa-play fa-lg mt-6 mb-2" />{" "}
                        Play
                    </a>
                </div>)}
            </div>
        </div>
    )
}

export default Card

