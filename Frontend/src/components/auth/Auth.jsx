import React from "react";
import "../../css/auth/Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../Redux/Slices/uislices";
import { logout } from "../../Redux/Slices/authslice";

const Auth = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  if (user) {
    return (
      <div className="auth-container">
        <button
          className="auth-btn login"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <button
        className="auth-btn signup"
        onClick={() => dispatch(openAuthModal("signup"))}
      >
        Signup
      </button>
      <button
        className="auth-btn login"
        onClick={() => dispatch(openAuthModal("login"))}
      >
        Login
      </button>
    </div>
  );
};

export default Auth;
