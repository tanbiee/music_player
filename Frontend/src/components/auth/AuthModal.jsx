import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../Common/Modal";
import Login from "./login";
import Signup from "./signup";
import EditProfile from "./editprofile"; // Import EditProfile
import { closeAuthModal } from "../../Redux/Slices/uislices";

const AuthModal = () => {
    const { authModalOpen, authModalType } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    if (!authModalOpen) return null;

    const handleClose = () => {
        dispatch(closeAuthModal());
    };

    return (
        <Modal onclose={handleClose}>
            {authModalType === "login" && <Login />}
            {authModalType === "signup" && <Signup />}
            {authModalType === "editProfile" && <EditProfile onClose={handleClose} />}
        </Modal>
    );
};

export default AuthModal;
