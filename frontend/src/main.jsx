import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { OperationsProvider } from "./context/OperationsContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <OperationsProvider>
        <App />
      </OperationsProvider>
    </AuthProvider>
  </React.StrictMode>
);
