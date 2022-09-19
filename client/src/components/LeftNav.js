import React from "react";
import { NavLink } from "react-router-dom";

const LeftNav = () => {
  return (
    <div className="left-nav-container">
      <div className="icons">
        <div className="icons-bis">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active-left-nav" : "left-nav"
            }
          >
            <img src="./img/icons/home.svg" alt="Home" />
          </NavLink>
          <br />
          <NavLink
            to="/trending"
            className={({ isActive }) =>
              isActive ? "active-left-nav" : "left-nav"
            }
          >
            <img src="./img/icons/rocket.svg" alt="Profil" />
          </NavLink>
          <br />
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              isActive ? "active-left-nav" : "left-nav"
            }
          >
            <img src="./img/icons/user.svg" alt="Trending" />
          </NavLink>
          <br />
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
