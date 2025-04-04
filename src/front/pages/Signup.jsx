import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../index.css";
import { useState } from "react";

export const Signup = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userName = event.target.userNameInput.value;
    const firstName = event.target.firstNameInput.value;
    const lastName = event.target.lastNameInput.value;
    const email = event.target.emailInput.value;
    const password = event.target.passwordInput.value;
    const confirmPassword = event.target.confirmPasswordInput.value;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          email: email.toLowerCase(),
          password: password,
          first_name: firstName,
          last_name: lastName,
          is_active: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.msg || "Signup failed. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Signup success:", data);
      setSuccessMessage("Signup successful! Please log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMessage("An unexpected error occurred: " + err.message);
    }
  };

  return (
    <div className="authDivSign">
      <h2>Sign Up</h2>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="userNameInput"
          placeholder="Choose a username"
          className="form-control mb-2"
          required
        />
        <input
          type="text"
          name="firstNameInput"
          placeholder="Enter your first name"
          className="form-control mb-2"
          required
        />
        <input
          type="text"
          name="lastNameInput"
          placeholder="Enter your last name"
          className="form-control mb-2"
          required
        />
        <input
          type="email"
          name="emailInput"
          placeholder="Enter email"
          className="form-control mb-2"
          required
        />
        <input
          type="password"
          name="passwordInput"
          placeholder="Enter password"
          className="form-control mb-2"
          required
        />
        <input
          type="password"
          name="confirmPasswordInput"
          placeholder="Confirm password"
          className="form-control mb-2"
          required
        />
        <button className="btn btn-dark mt-2" type="submit">
          Sign Up
        </button>
      </form>
      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
