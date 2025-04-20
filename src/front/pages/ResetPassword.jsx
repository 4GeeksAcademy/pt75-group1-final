// src/front/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, new_password: newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Password reset successfully. Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.msg || "Something went wrong");
      }
    } catch (err) {
      setMessage("Unexpected error: " + err.message);
    }
  };

  return (
    <div className="authDivSign">
      <h2>Reset Password</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="form-control mb-2"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-dark w-100 mt-2">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
