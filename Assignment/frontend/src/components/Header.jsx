import React from 'react';
import { NavLink,Link } from "react-router-dom";
function Header() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <a className="navbar-brand" href="/">BLOG</a>
          <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
            
            
            <ul className="navbar-nav">
              <li>
            <Link className="nav-link" to="/post">All Posts</Link>
            </li>
          <li>
            <Link className="nav-link" to="/event">Events</Link>
          </li>
          <li>
            <Link className="nav-link" to="/job">Jobs</Link>
          </li>
          <li>
            <Link className="nav-link" to="/news">News</Link>
          </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
