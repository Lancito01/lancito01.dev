import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
// import Footer from './Footer'

import "./Layout.scss";

const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="outlet-wrapper">
                <Outlet />
            </div>
            {/* <Footer /> */}
        </>
    );
};
export default Layout;
