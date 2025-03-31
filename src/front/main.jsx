import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";  
import './index.css';
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from 'aos';
import 'aos/dist/aos.css';



const Main = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true }); 
    }, []);
    return (
        <React.StrictMode>  
            <StoreProvider> 
                <RouterProvider router={router} />
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </StoreProvider>
        </React.StrictMode> 
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
