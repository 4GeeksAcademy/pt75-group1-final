import { Link } from "react-router-dom";
 import useGlobalReducer from "../hooks/useGlobalReducer";
 import "../index.css"
 
 
 export const Login = () => {
     //const {dispatch} = useGlobalReducer();
 
     const handleSubmit = async (event) => {
         event.preventDefault();
 
     }
 
     return (
         <div className="authDiv">
             <h2> Login </h2>
             <form onSubmit={handleSubmit}>
                 <input type = "email" name="emailInput" placeholder="enter email" required />
                 <input type = "password" name="passwordInput" placeholder="enter password" required />
                 <button className="btn btn-dark mt-2" type="submit">
                     LogIn
                     </button> 
 
             </form>
         </div>
     );
 };