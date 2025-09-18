import Header from "../Components/Header";

import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div className="main-layout">
            <Header></Header>
            <div className="content">
                <Outlet></Outlet>
            </div>
        </div>
    );
}

export default MainLayout;
