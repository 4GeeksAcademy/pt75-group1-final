import { useState } from "react";
import "../index.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.msg || "Something went wrong.");
                return;
            }

            setSuccessMessage(data.msg);
            setErrorMessage("");
            setEmail("");
        } catch (err) {
            console.error("❌ Forgot password error:", err);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="authDivSign">
            <h2>Forgot Password</h2>

            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="form-control mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="btn btn-dark mt-2" type="submit">
                    Send Reset Link
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
