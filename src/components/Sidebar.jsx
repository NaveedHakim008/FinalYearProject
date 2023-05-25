import React from 'react';
import {
  FaTh,
  FaBars,
  FaUserAlt,
  FaRegChartBar,
  FaFileUpload,
  FaCommentAlt,
  FaShoppingBag,
  FaThList
} from "react-icons/fa";
import { BsPlusCircleFill } from "react-icons/bs";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const menuItem = [
    {
      path: "/",
      name: "DASHBOARD",
      icon: <FaTh />,
      title: "DASHBOARD"
    },
    {
      path: "/uploadform",
      name: "UPLOAD VIDEOS",
      icon: <FaFileUpload />
    },
    // {
    //   path: "/currentlogs",
    //   name: "CURRENT LOGS",
    //   icon: <FaFileUpload />
    // },
    {
      path: "/pictureform",
      name: "ADD KNOWN PERSONS",
      icon: <FaFileUpload />
    },
    {
      path: "/logs",
      name: "LOGS",
      icon: <FaFileUpload />
    }
  ];

  return (
    <div className="container inline">
      <div className="sidebar">
        <div className="top_section">
          <h1 className="logo"></h1>
          <div className="bars">
            <FaBars />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeClassName="active"
          >
            <div className="icon">{item.icon}</div>
            <div className="link_text">{item.name}</div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
