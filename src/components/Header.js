import React from "react";
import "./Header.css";
function Header({ text }) {
    return (React.createElement("div", { className: "Header" },
        React.createElement("h2", null, text)));
}
export default Header;
