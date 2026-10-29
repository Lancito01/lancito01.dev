import { socials } from "../../data/links";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="wrap footer">
            <span>andy · lancito01</span>
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
