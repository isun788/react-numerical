import React from 'react';
import "./App.css"
import {  Link } from "react-router-dom";
const Nav= () =>{
  return (
  <div className="navbar">
      <ul className="nav-links">
    <li>
      <Link to="/">Chapter1</Link>
    </li>
    <li>
      <Link to="/chapter2">Chapter2</Link>
    </li>
    </ul>
  </div>
  );
}
export default Nav;