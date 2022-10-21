import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
let position = navigator.geolocation.getCurrentPosition((position) => {
  console.log(position);
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
