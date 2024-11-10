import { useState } from "react";
import "./About.scss";

const About = () => {
    function getAge() {
        const today = new Date();
        const birthDate = new Date("2004-01-08");
        let age = today.getFullYear() - birthDate.getFullYear();
        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    }

    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    return (
        <div className="about-div m-auto sm:p-2">
            <div className="about-intro m-auto p-3 w-fit">
                <h1 className="text-2xl">
                    <span className="accent-color">&gt;</span> My name&apos;s
                    Andy. 👋
                </h1>
                <h2 className="text-xl pt-2">
                    <span className="secondary-color">&gt;</span> Full-stack
                    programmer.
                </h2>
                <hr className="mt-4 mb-2 w-5/6 mx-auto" />
                <h3 className="text-l pt-2">
                    <span className="accent-color">&gt;</span> A little about me
                </h3>
                <ul className="pt-2">
                    <p>
                        <span className="secondary-color">&gt;</span> My name is
                        Andy, and I&apos;m a {getAge()}-year-old guy from
                        Argentina.
                    </p>
                    <p>
                        <span className="secondary-color">&gt;</span> I&apos;m a
                        beginner full-stack programmer trying to improve and
                        broaden my skills.
                    </p>
                </ul>
                <hr className="mt-4 mb-2 w-5/6 mx-auto" />
                <button
                    className="pt-2"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setHasOpened(true);
                    }}
                >
                    <span
                        className={`primary-color arrow${isOpen ? " arrow--open" : ""
                            }`}
                    >
                        &gt;
                    </span>{" "}
                    Programming languages I know{" "}
                    <small className="span-small">Click me!</small>
                </button>
                <ul
                    className={`prog-lang ${isOpen ? "prog--open" : "prog--closed"
                        } flex flex-wrap py-2 px-8 mt-2 w-fit rounded-xl light-background ${!hasOpened ? "hidden" : ""
                        }`}
                >
                    <p>
                        <span className="primary-color">&gt;</span> JavaScript
                    </p>
                    <p className="pl-3">
                        <span className="primary-color">&gt;</span> Lua
                    </p>
                    <p className="pl-3">
                        <span className="primary-color">&gt;</span> Python
                    </p>
                    <p className="pl-3">
                        <span className="primary-color">&gt;</span> Java
                    </p>
                    <p className="pl-3">
                        <span className="primary-color">&gt;</span> HTML
                    </p>
                    <p className="pl-3">
                        <span className="primary-color">&gt;</span> C++
                    </p>
                </ul>
                <hr className="mt-4 mb-2 w-5/6 mx-auto" />
                <h3 className="text-l pt-2">
                    <span className="accent-color">&gt;</span> Find me here
                </h3>
                <ul className="about-links flex justify-evenly mt-2">
                    <a href="https://github.com/lancito01" className="text-white flex w-fit">
                        <i className="fa-brands fa-github relative" /> GitHub
                    </a>
                    <a href="https://x.com/lancito01" className="text-white flex w-fit">
                        <i className="fa-brands fa-twitter pl-5 relative" /> Twitter
                    </a>
                    <a href="https://discord.gg/q7Rwp3uY2b" className="text-white flex w-fit">
                        <i className="fa-brands fa-discord pl-5 relative" /> Discord server
                    </a>
                </ul>
            </div>
        </div>
    );
};

export default About;
