import { Link, useNavigate } from "react-router-dom";
 import useGlobalReducer from "../hooks/useGlobalReducer";
 import "../index.css"
 
 export const Signup = () => {
     const { dispatch } = useGlobalReducer();
     const navigate = useNavigate();
 
     const handleSubmit = async (event) => {
         event.preventDefault();
 
         const userName = event.target.userNameInput.value;
         const firstName = event.target.firstNameInput.value;
         const lastName = event.target.lastNameInput.value;
         const email = event.target.emailInput.value;
         const password = event.target.passwordInput.value;
         const confirmPassword = event.target.confirmPasswordInput.value;
 
         if (password !== confirmPassword) {
             alert("passwords do not match");
             return
         }
 
         const response = await fetch(process.env.BACKEND_URL + "/api/user", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                username: userName,
                email: email.toLowerCase(),
                password: password,
                first_name: firstName,
                last_name: lastName
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
                 <input type="username" name="usernameInput" placeholder="choose a username" required />
                 <input type="firstName" name="nameInput" placeholder="enter your Name" required />
                 <input type="lastName" name="lastNameInput" placeholder="enter your Last Name" required />
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