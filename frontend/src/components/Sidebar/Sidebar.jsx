// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTable,
  FaBell,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaArrowCircleUp,
} from "react-icons/fa"; // Import icons
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-header'>
        <h2>Bihebazar Dashboard</h2>
      </div>

      <ul className='sidebar-links'>
        <li>
          <Link to='/dashboard'>
            <FaHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link to='/bookings'>
            <FaHome /> Bookings
          </Link>
        </li>
        <li>
          <Link to='/clients'>
            <FaHome /> Clients
          </Link>
        </li>
        <li>
          <Link to='/vendors'>
            <FaHome /> Vendors
          </Link>
        </li>
        <li>
          <Link to='/services'>
            <FaHome /> Services
          </Link>
        </li>
        <li>
          <Link to='/signout'>
            <FaUserPlus /> Sign out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
