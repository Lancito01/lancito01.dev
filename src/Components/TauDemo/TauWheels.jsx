import convertWheel from "../../assets/tau/convert-wheel.webp";
import toolsWheel from "../../assets/tau/tools-wheel.webp";
import actionsWheel from "../../assets/tau/actions-wheel.webp";
import "./TauWheels.scss";

const WHEELS = [
    { src: convertWheel, name: "convert", alt: "Tau's Convert wheel, with image formats around a dial" },
    { src: toolsWheel, name: "tools", alt: "Tau's Tools wheel: compress, metadata, edit, annotate, add background, crop and redact" },
    { src: actionsWheel, name: "actions", alt: "Tau's Actions wheel: share, shelf, copy, move, copy path and terminal" },
];

// Rendered by the app itself, from its --render-wheel command
const TauWheels = () => (
    <ul className="tau-wheels">
        {WHEELS.map((wheel) => (
            <li key={wheel.name}>
                <img src={wheel.src} alt={wheel.alt} width="451" height="451" loading="lazy" />
                <span className="mono">{wheel.name}</span>
            </li>
        ))}
    </ul>
);

export default TauWheels;
