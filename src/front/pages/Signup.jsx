import { Link, useNavigate } from "react-router-dom";
 import useGlobalReducer from "../hooks/useGlobalReducer";
 import "../index.css"
 
 export const Signup = () => {
     const { dispatch } = useGlobalReducer();
     const navigate = useNavigate();
 
     const handleSubmit = async (event) => {
         event.preventDefault();
 
         const email = event.target.emailInput.value;
         const password = event.target.passwordInput.value;
         const confirmPassword = event.target.confirmPasswordInput.value;
 
         if (password !== confirmPassword) {
             alert("passwords do not match");
             return
         }
 
         const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                 email: email.toLowerCase(),
                 password: password
             })
 
         });
 
         if (!response.ok) {
             const errorData = await response.json();
             alert(errorData.msg || "Sign up failed. Please try again or Not");
             return;
         }
 
         const data = await response.json();
         console.log("data from signup", data);
         alert("signup succesfull please login");
         navigate("/login");
     }
 
     return (
         <div className="authDiv">
             <h2> Sign Up </h2>
             <form onSubmit={handleSubmit}>
                 <input type="email" name="emailInput" placeholder="enter email" required />
                 <input type="password" name="passwordInput" placeholder="enter password" required />
                 <input type="password" name="confirmPasswordInput" placeholder="confirm password" required />
                 <button className="btn btn-dark mt-2" type="submit">
                     SignUp
                 </button>
 
             </form>
         </div>
     );
 };