import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, setError, setLoading, setuser } from "../../Redux/Slices/authslice";
import axios from "axios";
import "../../css/auth/editprofile.css";
import Input from "../Common/input";
import { CiUser } from "react-icons/ci";

const EditProfile = ({ onClose }) => {
    const dispatch = useDispatch();
    const { user, token, isLoading, error } = useSelector((state) => state.auth);

    const [name, setName] = React.useState(user?.name || "");
    const [email, setEmail] = React.useState(user?.email || "");

    // update password
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [showPasswordFields, setShowPasswordFields] = React.useState(false);

    const [previewImage, setPreviewImage] = React.useState(user?.avatar || "");
    const [base64Image, setBase64Image] = React.useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPreviewImage(user.avatar || "");
        }
    }, [user]);

    // for imagekit => raw image to base64Image

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

    // submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        const payload = {};

        if (name && name !== user.name) payload.name = name;
        if (email && email !== user.email) payload.email = email;
        if (base64Image) payload.avatar = base64Image;

        if (showPasswordFields) {
            if (!currentPassword || !newPassword) {
                dispatch(setError("To Change Password, both fields are required"));
                return;
            }

            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }


        if (Object.keys(payload).length === 0) {
            dispatch(setError("please update atleast one field"));
            return;
        }
        dispatch(setLoading(true));

        try {
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/auth/profile`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data || {};
            dispatch(setuser({
                user: data.user,
                token: token || localStorage.getItem("token")
            }));

            if (onClose) {
                dispatch(clearError());
                onClose();
            }

            console.log("Profile Updated!");
        } catch (error) {
            let serverMessage = error?.response?.data?.message || error?.response?.data?.error;
            dispatch(setError(serverMessage || "Profile update failed! please try again.."));
        }
        finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="edit-profile-wrapper">
            <h3 className="editprofile-title">Edit Profile</h3>
            <p className="editprofile-subtitle">Update your profile information</p>

            <form className="edit-profile-form" onSubmit={handleSubmit}>

                {!showPasswordFields && (
                    <>
                        <div className="profile-image-section">
                            <div className="profile-image-container">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="profile-img-preview" />
                                ) : (
                                    <div className="profile-placeholder">
                                        <CiUser size={60} />
                                    </div>
                                )}
                            </div>
                            <label className="image-upload-btn">
                                Change Photo
                                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                            </label>
                        </div>
                        <Input
                            label={"Name"}
                            type={"text"}
                            placeholder={"Enter your name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label={"Email"}
                            type={"email"}
                            placeholder={"Enter your email"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </>
                )}

                <div className="password-section">
                    <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                    >
                        {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                    </button>

                    {showPasswordFields && (
                        <div className="password-fields">
                            <Input
                                label={"Current Password"}
                                type={"password"}
                                placeholder={"Enter current password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <Input
                                label={"New Password"}
                                type={"password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button type="button" className="editprofile-password-toggle-btn"
                        onClick={() => setShowPasswordFields(!showPasswordFields)}>
                        {showPasswordFields ? "Cancel" : "Change Password"}
                    </button>
                    <div className="editprofile-actions">

                        <button type="button" className="editprofile-btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="editprofile-btn-submit">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};


export default EditProfile;