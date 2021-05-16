import React, { FunctionComponent, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import PasswordReset from "../PasswordReset/PasswordReset";
import Request from "../../../api/requests";
import { setPageTitle } from "../../../utils";
import { toast } from "react-toastify";

type ForgotPasswordProps = {
  email?: string;
  loading?: boolean;
  isLinkSent?: boolean;
};

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = () => {
  const [user, setUser] = useState({
    email: "",
    loading: false,
    isLinkSent: false,
  });
  useEffect(() => {
    setPageTitle("Recover password");
  }, []);

  const recoverPassword = async (e: any) => {
    e.preventDefault();
    if (user.email === "") {
      toast.error("Email cannot be empty");
      return;
    }

    setUser({ ...user, loading: true });
    await Request("POST", "customer/recover", {
      email: user.email,
    })
      .then((response: any) => {
        if (response.status === 200) {
          setUser({ ...user, loading: false, isLinkSent: true });
        } else {
          setUser({ ...user, loading: false });
          toast.error("Could not reset password. try again later");
        }
      })
      .catch((e) => {
        setUser({ ...user, loading: false, isLinkSent: false });
        console.error(e);
      });
  };

  return (
    <div className="user-auth-wrap passreset">
      {user.isLinkSent ? (
        <PasswordReset />
      ) : (
        <>
          <h2>Recover your Password</h2>
          <form>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter Email"
                onChange={(e) =>
                  setUser({
                    ...user,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <button
              type="submit"
              onClick={(e) => !user.loading && recoverPassword(e)}
              className="btn btn-primary auth-btn"
            >
              {user.loading ? "loading" : "Reset Password"}
            </button>
            <div className="line"></div>
            <div className={`flex-center`}>
              <p>
                Remember your password?{" "}
                <Link to={`login`}>
                  <span>Login</span>
                </Link>
              </p>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

ForgotPassword.defaultProps = {
  email: "",
  loading: false,
  isLinkSent: false,
};

export default ForgotPassword;
