import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthModal } from "../../Redux/Slices/uislices";
import Login from "../auth/login";
import Signup from "../auth/signup";
import "../../css/common/Modal.css";

const Modal = () => {
    const dispatch = useDispatch();
    const { authModalOpen, authModalType } = useSelector((state) => state.ui);

    if (!authModalOpen) return null;

    const handleClose = () => {
        dispatch(closeAuthModal());
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-container">
                <button className="modal-close-btn" onClick={handleClose}>
                    ×
                </button>
                <div className="modal-content">
                    {authModalType === "login" ? <Login /> : <Signup />}
                </div>
            </div>
        </div>
    );
};

export default Modal;
