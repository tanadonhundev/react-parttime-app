import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import router from "./routes/root";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
