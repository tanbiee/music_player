import React, { useState } from "react";
import Input from "../Common/input";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import axios from "axios";
import { setLoading, setuser, setError, clearError } from "../../Redux/Slices/authslice";
import { closeAuthModal } from "../../Redux/Slices/uislices";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Avatar States
    const [previewImage, setPreviewImage] = useState("");
    const [base64Image, setBase64Image] = useState("");

    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            setPreviewImage(reader.result);
            setBase64Image(reader.result);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        if (!fullName || !email || !password) {
            dispatch(setError("Please fill all fields"));
            return;
        }

        dispatch(setLoading(true));
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
                {
                    name: fullName,
                    email,
                    password,
                    avatar: base64Image ? base64Image : undefined,
                }
            );

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
            const serverMessage = error?.response?.data?.message ||
                error?.response?.data?.error;
            dispatch(setError(serverMessage || "Signup Failed"));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="signup-wrapper">
            <h3 className="signup-title">Create an Account</h3>
            <p className="signup-subtitle">
                Join us today by entering the details
            </p>

            <form className="signup-form">
                <div>
                    <div className="profile-image-container">
                        <div className="profile-placeholder">
                            <User size={40} />
                        </div>
                    </div>

                    <label className="image-upload-icon">
                        📷
                        <input type="file" accept="image/*" hidden />
                    </label>
                </div>

                <Input
                    label={"Name"}
                    type={"text"}
                    placeholder={"Enter your name"}
                    value={fullName}
                    onChange={(e) => {
                        setFullName(e.target.value);
                    }}
                />

                <Input
                    label={"Email"}
                    type={"email"}
                    placeholder={"Enter your Email id"}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                <Input
                    label={"Password"}
                    type={"password"}
                    placeholder={"Enter your Email"}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                {error && <div className="signup-error">{error}</div>}

                <button type="submit" className="signup-submit-button" disabled={isLoading}>
                    <span>{isLoading ? "Creating Account..." : "Sign Up"}</span>
                </button>
            </form>
        </div>
    );
};

export default Signup;
