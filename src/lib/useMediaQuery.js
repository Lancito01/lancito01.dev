import { useEffect, useState } from "react";

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const list = window.matchMedia(query);
        const onChange = () => setMatches(list.matches);
        list.addEventListener("change", onChange);
        onChange();
        return () => list.removeEventListener("change", onChange);
    }, [query]);

    return matches;
};

export default useMediaQuery;
