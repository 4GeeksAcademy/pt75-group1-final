import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Home from "./pages/Home"; // ✅ Ensure this path is correct

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // ✅ This sets Home as the default page
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
