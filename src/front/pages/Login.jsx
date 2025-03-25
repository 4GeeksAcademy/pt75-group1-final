import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../index.css";

export const Login = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.emailInput.value;
    const password = event.target.passwordInput.value;

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("Login failed:", error);
        alert(error.msg || "Login failed. Please check your credentials.");
        return;
      }

      const data = await response.json();
      console.log("Login success:", data);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: data, 
      });

      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      alert("An unexpected error occurred." + err.message);
    }
  };

  return (
    <div className="authDiv">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="emailInput" placeholder="Enter email" required />
        <input type="password" name="passwordInput" placeholder="Enter password" required />
        <button className="btn btn-dark mt-2" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
};
