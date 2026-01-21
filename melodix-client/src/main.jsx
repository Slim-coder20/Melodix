import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ToastProvider } from "./context/ToastContext.jsx";
import WishlistProvider from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
  <BrowserRouter>
    <ToastProvider> 
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </ToastProvider>
  </BrowserRouter>
  </StrictMode>
);
