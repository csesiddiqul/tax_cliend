//import node module libraries
import { Outlet } from "react-router";
import Sidebar from "components/navbars/sidebar/Sidebar";
import UserSideBar from "components/navbars/sidebar/UserSideBar";
import Header from "components/navbars/topbar/Header";
import { useState } from "react";
import { useSelector } from "react-redux";

const RootLayout = () => {
  const [showMenu, setShowMenu] = useState(true);
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };
  const { token, roles } = useSelector((state: any) => state.auth);

 
  return (
    <section className="bg-light">
      <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
        <div className="navbar-vertical navbar">
          {token && roles?.[0] === 'client' ? (
            <UserSideBar showMenu={showMenu} toggleMenu={ToggleMenu} />
          ) : (
            <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
          )}


        </div>
        <div id="page-content">
          <div className="header">
            <Header toggleMenu={ToggleMenu} />
          </div>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default RootLayout;
