import "./style.scss";

import React, { Fragment, FunctionComponent, useEffect } from "react";

import { Link } from "react-router-dom";
import { Routes } from "./Routes";
import { setPageTitle } from "../../utils";

type AuthenticationProps = {};

const Authentication: FunctionComponent<AuthenticationProps> = () => {
  useEffect(() => {
    setPageTitle("Login");
  }, []);
  return (
    <Fragment>
      <section id="user-auth">
        <div className="container">
          <div className="row align-items-center fullHeight my-row">
            <div className="col-lg-6 col-12 flex-center">
              <div className="logo flex-center">
                <Link className="navbar-brand" to="/">
                  <img src="/img/logo-blue.png" alt="logo" />
                </Link>
              </div>
              <Routes />
              <div className="copy-note">
                <p>© 2020 Traders of Africa</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

Authentication.defaultProps = {};

export default Authentication;
