import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import WriteReview from "./pages/WriteReview";
import ReviewForm from "./pages/ReviewForm";
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
  {
    path: "/write-review",
    element: <WriteReview />,
  },
  {
    path: "/write-review/:id",
    element: <ReviewForm />,
  },
]);


