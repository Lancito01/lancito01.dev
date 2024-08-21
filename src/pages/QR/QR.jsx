import { useEffect } from 'react'

const Skull = () => {
    useEffect(() => {
        window.location.href = '';
    }, []);

    return null;
}

export default Skull