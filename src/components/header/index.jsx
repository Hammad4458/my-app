import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "antd"; 
import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons"; 
import "./header.css"; 

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token"); 
    navigate("/login", { replace: true }); 
  };

  return (
    <div className="header-container">
      <Button
        icon={<ArrowLeftOutlined />}
        className="back-button"
        type="primary"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Button
        type="primary"
        danger
        icon={<LogoutOutlined />}
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};
