import Header from "../Components/Header";

import { useState } from 'react';
import { Outlet } from "react-router-dom";

function MainLayout() {
    const [ showHeader, setShowHeader ] = useState(false);

    const toggleShowHeader = () => {
        setShowHeader(prev => !prev);
    };

    return (
        <div className="main-layout">
            <Header toggleShowHeader={toggleShowHeader} show={showHeader} ></Header>
            <div className="overlay" onClick={() => toggleShowHeader()}></div>
            <div className="content">
                <img className="menuButton" src="menu-button.webp" onClick={() => toggleShowHeader()}/>
                <Outlet></Outlet>
            </div>
        </div>
    );
}

export default MainLayout;
