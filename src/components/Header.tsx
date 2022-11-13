import React from "react";
import "./Header.css";

type HeaderProps = {
  text: string;
};

function Header({ text }: HeaderProps): React.ReactElement {
  return (
    <div className="Header">
      <h2>{text}</h2>
    </div>
  );
}

export default Header;
