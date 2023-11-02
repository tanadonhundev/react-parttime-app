import { createBrowserRouter } from "react-router-dom";

import HomePage from "../components/pages/home-page";
import RegisterPage from "../components/pages/register-page";
import LoginPage from "../components/pages/login-page";

import routeDashboardAdmin from "./admin";
import routeDashboardOwner from "./owner";
import routeDashboardEmployee from "./employee";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  ...routeDashboardAdmin,
  ...routeDashboardOwner,
  ...routeDashboardEmployee
]);

export default router;
