import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";
import Logout from "./Log/Logout";

const NavBar = () => {
  const uid = useContext(UidContext);
  const userData = useSelector((state) => state.rootReducer.userReducer);

  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <NavLink exact to="/">
            <div className="logo">
              <img src="./img/LionLogo.jpeg" alt="logo" />
              <h3>Twittos</h3>
            </div>
          </NavLink>
        </div>
        {uid ? (
          <ul>
            <li></li>
            <li className="welcome">
              <NavLink exact to="/profil">
                <h5>Bienvenue {userData.pseudo}</h5>
              </NavLink>
            </li>
            <Logout />
          </ul>
        ) : (
          <ul>
            <li></li>
            <NavLink exact to="/profil">
              <img src="./img/icons/login.svg" alt="logo log out/in" />
            </NavLink>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
