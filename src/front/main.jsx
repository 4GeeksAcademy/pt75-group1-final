import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";  // Import Bootstrap styles
import './index.css';
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Main = () => {
    return (
        <React.StrictMode>  
            <StoreProvider> 
                <RouterProvider router={router} />
            </StoreProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
