import React, { FunctionComponent, useEffect, useState } from "react";

import BtnLoader from "../../../components/BtnLoader/BtnLoader";
import { Link } from "react-router-dom";
import Request from "../../../api/requests";
import Verify from "../Verify/Verify";
import { setPageTitle } from "../../../utils";
import { toast } from "react-toastify";

type RegisterProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  loading?: boolean;
  hasRegistered?: boolean;
};

const Register: FunctionComponent<RegisterProps> = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    loading: false,
    hasRegistered: false,
  });

  useEffect(() => {
    setPageTitle("Create an Account");
  }, []);

  const register = async (e: any) => {
    e.preventDefault();

    if (
      user.email === "" ||
      user.password === "" ||
      user.firstName === "" ||
      user.lastName === ""
    ) {
      toast.error("Email or password cannot be empty");
      return;
    }

    if (user.password !== user.confirmPassword) {
      toast.error("The password you entered does not match");
      return;
    }

    setUser({ ...user, loading: true });
    await Request("POST", "customer/register", {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phoneNumber,
    })
      .then((response: any) => {
        if (response.data.status === true) {
          setUser({ ...user, loading: false, hasRegistered: true });
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
    <>
      {user.hasRegistered ? (
        <Verify props={{ email: user.email }} />
      ) : (
        <div className="user-auth-wrap signup">
          <h2>Sign up for free</h2>
          <form>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        firstName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        lastName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone number"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        phoneNumber: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        password: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        confirmPassword: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary auth-btn"
                    onClick={(e) => {
                      !user.loading && register(e);
                    }}
                  >
                    {user.loading ? <BtnLoader /> : "Sign up"}
                  </button>
                </div>
              </div>
              {/* <div className="col">
                <h5 className="mt-2">OR</h5>
              </div> */}
            </div>
            {/* <div className="line"></div>
            <div className="row">
              <div className="col">
                <div className="social-login mt-3">
                  <button className="btn btn-white">Sign up with Google  <img src="/img/google.svg" alt="google" /></button>
                </div>
              </div>
              <div className="col">
                <div className="social-login mt-3">
                  <button className="btn btn-white">Sign up with Facebook  <img src="/img/fb.svg" alt="facebook" /></button>
                </div>
              </div>
            </div> */}
            <div className="line"></div>
            <div>
              <p>
                Already have an account?{" "}
                <Link to={`login`}>
                  <span>Login now</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

Register.defaultProps = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  loading: false,
  hasRegistered: false,
};

export default Register;
