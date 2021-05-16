import "./style.scss";
import React, { FunctionComponent, useEffect, useState } from "react";

import BtnLoader from "../../../components/BtnLoader/BtnLoader";
import { Link } from "react-router-dom";
import Request from "../../../api/requests";
import { setPageTitle } from "../../../utils";
import { toast } from "react-toastify";

type LoginProps = {
  email?: string;
  password?: string;
  loading?: boolean;
};

const Login: FunctionComponent<LoginProps> = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    loading: false,
  });

  useEffect(() => {
    setPageTitle("Login");
  }, []);

  const login = async (e: any) => {
    e.preventDefault();

    if (user.email === "" || user.password === "") {
      toast.error("Email or password cannot be empty");
      return;
    }

    setUser({ ...user, loading: true });
    await Request("POST", "customer/login", {
      email: user.email,
      password: user.password,
    })
      .then((response: any) => {
        if (response.data.status === true) {
          localStorage.setItem("bcdNgAuth", JSON.stringify(response.data));
          toast.success("Login Successful");
          setUser({ ...user, loading: false });
          window.location.href = "/home/my-account";
        } else {
          setUser({ ...user, loading: false });
          toast.error(response.data.message);
        }
      })
      .catch((e) => {
        setUser({ ...user, loading: false });
        console.error(e);
      });
  };

  return (
    <div className="user-auth-wrap login">
      <h2>Login to continue</h2>
      <form>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter Email"
            onChange={(e) => {
              setUser({
                ...user,
                email: e.target.value,
              });
            }}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            onChange={(e) => {
              setUser({
                ...user,
                password: e.target.value,
              });
            }}
          />
        </div>
        <button
          className="btn btn-primary auth-btn"
          onClick={(e) => !user.loading && login(e)}
        >
          {user.loading ? <BtnLoader /> : "Login"}
        </button>
        {/* <h5 className='social-option center-text'>OR</h5>
          <div className='social-login'>
              <button className='btn btn-white'>Login with Google  <img src='/img/google.svg' alt='google'/></button>
              <button className='btn btn-white'>Login with Facebook  <img src='/img/fb.svg' alt='facebook'/></button>
          </div> */}
        <div className="line"></div>
        <p>
          <Link to="forgot-password">Forgot Password?</Link>
          <Link to="register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

Login.defaultProps = {
  email: "",
  password: "",
  loading: false,
};

export default Login;
