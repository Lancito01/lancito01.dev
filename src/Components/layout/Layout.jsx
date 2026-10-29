import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

import "./Layout.scss";

const Layout = () => {
    const location = useLocation();
    // useOutlet (not <Outlet />) so the leaving page keeps rendering while it fades out
    const outlet = useOutlet();

    return (
        <div className="layout">
            <Navbar />
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                <motion.main
                    key={location.pathname}
                    className="layout__main"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                >
                    {outlet}
                </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    );
};

export default Layout;
