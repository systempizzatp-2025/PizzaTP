import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./route/index.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import toast, { Toaster } from "react-hot-toast";
import { LogoutModalProvider } from "./components/LogoutModalManager";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <LogoutModalProvider>
          <RouterProvider router={router} />
        </LogoutModalProvider>
      </Provider>
    </GoogleOAuthProvider>
    <Toaster />
  </StrictMode>
);
