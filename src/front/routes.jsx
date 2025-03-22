import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Home from "./pages/Home"; 
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/restaurants",
    element: <Restaurants />,
  },
  {
    path: "/restaurant/:id",
    element: <RestaurantDetails />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
]);




export default function App() {
  return <RouterProvider router={router} />;
}
