import React from "react";
import logo from "../images/logo.svg";
import { Routes, Route, Link, useLocation } from "react-router-dom";

export default function Header({ loggedIn, email, logOut }) {
  const location = useLocation();
  const linkText = location.pathname === "/sign-in" ? "Регистрация" : "Войти";
  const buttonText = loggedIn ? "Выйти" : linkText;

  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="Логотип проекта Mesto"
      />
      <div className="header__links">
        <Routes>
          <Route
            path="/sign-up"
            element={<Link to="/sign-in" className="header__link header__button">Войти</Link>
            }
          />
          <Route
            path="/sign-in"
            element={<Link to="/sign-up" className="header__link header__button">Регистрация</Link>}
          />
          <Route
            path="/"
            element={
              <>
                <p
                  className="header__email"
                >
                  {email}
                </p>
                <button
                  className="header__link header__button"
                  onClick={logOut}
                >
                  {buttonText}
                </button>
              </>
            }
          />
        </Routes>
      </div>
    </header>
  );
}