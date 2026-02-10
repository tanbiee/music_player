import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { MdAddAPhoto } from "react-icons/md";
import Input from "../Common/input";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import axios from "axios";
import { setLoading, setuser, setError, clearError } from "../../Redux/Slices/authslice";
import { closeAuthModal, switchAuthMode } from "../../Redux/Slices/uislices";
import "../../css/auth/Login.css";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [avatar, setAvatar] = useState(""); // base64
    const [previewImage, setPreviewImage] = useState("");

    const dispatch = useDispatch();

    const { isLoading, error } = useSelector((state) => state.auth);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreviewImage(reader.result);
            setAvatar(reader.result);
        };
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        if (!name) {
            dispatch(setError("Please enter your name"));
            return;
        }

        if (!validator.isEmail(email)) {
            dispatch(setError("Please enter a valid email address"));
            return;
        }

        if (!password || password.length < 6) {
            dispatch(setError("Password must be at least 6 characters"));
            return;
        }

        dispatch(setLoading(true));
        try {
            const payload = { name, email, password };
            if (avatar) payload.avatar = avatar;

            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, payload);
            const data = res.data || {};

            dispatch(
                setuser({
                    user: data.user,
                    token: data.token,
                })
            );

            localStorage.setItem("token", data.token);
            dispatch(closeAuthModal());
            console.log("Signup Successfull");
        } catch (error) {
            const servermessage = error?.response?.data?.message ||
                error?.response?.data?.error;
            dispatch(setError(servermessage || "Signup Failed"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="login-wrapper">
            <h3 className="login-title">Create Account</h3>
            <p className="login-subtitle">Sign up to get started</p>

            <form className="login-form" onSubmit={handleSignup}>
                {/* Profile Image Upload */}
                <div className="profile-upload-container">
                    {previewImage ? (
                        <img src={previewImage} alt="Preview" className="profile-upload-preview" />
                    ) : (
                        <div className="profile-upload-placeholder">
                            <CiUser size={48} />
                        </div>
                    )}
                    <label className="profile-upload-btn-icon">
                        <MdAddAPhoto size={16} />
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </label>
                </div>

                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Full Name"
                    placeholder="Enter your name"
                    type="text"
                />
                <Input
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                />
                <Input
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                />

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="login-submit-btn" disabled={isLoading}>
                    <span>{isLoading ? "Signing Up..." : "Signup"}</span>
                </button>

                <div className="login-switch-wrapper" style={{ marginTop: "1rem", textAlign: "center" }}>
                    <p style={{ color: "#9ca3af" }}>
                        Already have an account? {" "}
                        <span
                            onClick={() => dispatch(switchAuthMode("login"))}
                            style={{ cursor: "pointer", color: "#a855f7", fontWeight: "bold" }}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Signup;
