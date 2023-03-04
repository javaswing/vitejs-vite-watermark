import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // strictMode 会让app 多 render一次
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
