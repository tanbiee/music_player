import React, { useState } from "react";
import "../../css/auth/Resetpass.css";
import "../../common/input.css";
import Input from "../Common/input";

const Resetpass = () => {

    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setpassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const handleReset = async () => {
        if (!password || password.length < 6) {
            setStatus("error");
            setMessage("Password must be atleast 6 Characters");
            return;
        }

        try {
            setLoading(true);
            setStatus("info");
            setMessage("Reseting Password");

            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/reset-password`, {
                token,
                password,
            });

            setStatus("success");
            setMessage("Password reset successfully! You can now login");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setStatus("error");
            setMessage(error?.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="reset-wrapper">
            <h3 className="Reset-title">Reset Password</h3>
            <p className="reset-subtitle">Enter your new password to regain access to your account</p>

            <div className="reset-form">
                <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                {status === "error" && <div className="reset-error">{message}</div>}
                {status === "success" && <div className="reset-success">{message}</div>}

                <button className="reset-submit-bttn" onclick={handleResetPassword} disabled={loading}><span>{loading ? "Resetting..." : "Reset Password"}</span></button>
            </div>

        </div>
    );
};

export default Resetpass;