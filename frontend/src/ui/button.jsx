import React from "react";
import "./button.css";

const Button = () => {
  return (
    <div className="container">
      <a href="#" className="button type--A">
        <div className="button__line" />
        <div className="button__line" />
        <span className="button__text font-bold">Get Started</span>
        <div className="button__drow1" />
        <div className="button__drow2" />
      </a>
    </div>
  );
};

export default Button;
