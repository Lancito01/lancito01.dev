import { socials } from "../../data/links";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="wrap footer">
            {/* signed off at the bottom of every page */}
            <span className="footer__sign">
                <img src="/pikachu.gif" alt="Pikachu, my signature" width="30" height="30" />
                andy · lancito01
            </span>
            <ul className="footer__links">
                {socials.map((social) => (
                    <li key={social.name}>
                        <a href={social.url} target="_blank" rel="noreferrer">
                            {social.name}
                        </a>
                    </li>
                ))}
            </ul>
        </footer>
    );
};

export default Footer;
