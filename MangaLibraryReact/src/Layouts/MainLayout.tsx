import Header from "../Components/Header";

import { useState } from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [showHeader, setShowHeader] = useState(false);

  const closeHeader = () => {
    setShowHeader(false);
  };

  const openHeader = () => {
    setShowHeader(true);
  };

  return (
    <>
      <Header closeHeader={closeHeader} show={showHeader}></Header>
      <div className="content">
        <img
          className="menuButton"
          src="/menu-button.webp"
          onClick={() => openHeader()}
        />
        <Outlet></Outlet>
      </div>
      <div className="overlay" onClick={() => closeHeader()}></div>
    </>
  );
}

export default MainLayout;
