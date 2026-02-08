import React from "react";
import "../../css/auth/Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal, closeAuthModal } from "../../Redux/Slices/uislices";
import { clearError, logout } from "../../Redux/Slices/authslice";
import Modal from "../Common/Modal";
import Login from "./login";
import Signup from "./signup";
import "../../css/auth/Login.css";
import "../../css/auth/Signup.css";
import "../../css/common/Modal.css";


const Auth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { authModalOpen, authmode } = useSelector((state) => state.ui);

  const handleSignupClick = () => {
    dispatch(clearError());
    dispatch(openAuthModal("signup"));
  };

  const handleLoginClick = () => {
    dispatch(clearError());
    dispatch(openAuthModal("login"));
  };

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  return (
    <React.Fragment>
      <div className="auth-container">
        {!isAuthenticated ? (
          <React.Fragment>
            <button className="auth-btn signup" onClick={handleSignupClick}>
              Signup
            </button>
            <button className="auth-btn login" onClick={handleLoginClick}>
              Login
            </button>
          </React.Fragment>
        ) : (
          <button className="auth-btn logout" onClick={handleLogoutClick}>
            Logout
          </button>
        )}
      </div>

      {authModalOpen && (
        <Modal
          onClose={() => {
            dispatch(closeAuthModal());
            dispatch(clearError());
          }}
        >
          {authmode === "signup" && <Signup />}
          {(authmode === "login" || authmode === "forgot") && <Login />}
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Auth;
