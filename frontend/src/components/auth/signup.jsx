import React, { useState } from "react";
import Input from "../Common/input";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import axios from "axios";
import { setLoading, setuser, setError, clearError } from "../../Redux/Slices/authslice";
import { closeAuthModal, switchAuthMode } from "../../Redux/Slices/uislices";
import "../../css/auth/Signup.css"; // Ensure CSS is imported

const Signup = () => {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/profile.png");

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
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

        if (password.length < 6) {
            dispatch(setError("Password must be at least 6 characters"));
            return;
        }

        if (password !== confirmPassword) {
            dispatch(setError("Passwords do not match"));
            return;
        }

        dispatch(setLoading(true));
        try {
            const res = await axios.post("/api/auth/signup", {
                name,
                email,
                password,
                avatar // sending base64 string
            });
            const data = res.data || {};

            dispatch(
                setuser({
                    user: data.user,
                    token: data.token,
                })
            );

            localStorage.setItem("token", data.token);
            dispatch(closeAuthModal());
            console.log("Signup Successful");
        } catch (error) {
            const servermessage = error?.response?.data?.message ||
                error?.response?.data?.error;
            dispatch(setError(servermessage || "Signup Failed"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="signup-wrapper">
            <h3 className="signup-title">Create Account</h3>
            <p className="signup-subtitle">Join us to experience music like never before</p>

            <form className="signup-form" onSubmit={handleSignup}>
                <div className="profile-image-container">
                    <img src={avatarPreview} alt="Avatar Preview" className="profile-image" />
                    <label htmlFor="avatar-upload" className="image-upload-icon">
                        <i className="fas fa-camera text-white"></i>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: "none" }}
                        />
                    </label>
                </div>

                <Input
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    label="Full Name"
                    placeholder="Enter your full name"
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
                    placeholder="Create a password"
                    type="password"
                />

                <Input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                />

                <span className="forgot-link" onClick={() => {
                    dispatch(clearError());
                    dispatch(switchAuthMode("login"));
                }}
                >
                    Do you already have an account</span>
                {error && <div className="signup-error">{error}</div>}

                <div className="signup-actions">
                    <button type="submit" className="signup-btn-submit" disabled={isLoading}>
                        <span>{isLoading ? "creating..." : "Sign Up"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Signup;