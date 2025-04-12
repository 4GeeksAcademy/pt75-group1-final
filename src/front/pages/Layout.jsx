import { Outlet } from "react-router-dom/dist"
// import ScrollToTop from "../components/ScrollToTop"
import Navbar from "../components/Navbar"
import { Footer } from "../components/Footer"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                closeButton={false}
                style={{
                    top: '20px',
                    right: '20px'
                }}
                toastStyle={{
                    minHeight: 'auto',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    margin: '0 0 8px 0'
                }}
            />
        </div>

    )
}