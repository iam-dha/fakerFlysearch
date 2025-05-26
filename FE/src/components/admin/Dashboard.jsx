import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import UserManagement from "./UserManagement.jsx";
import OrderManagement from "./OrderManagement.jsx";
import TicketManagement from "./TicketManagement.jsx";
import PromotionManagement from "./PromotionManagement.jsx";
import PostsManagement from "./PostsManagement.jsx";
import Statistics from "./Statistics.jsx";
import PermissionManagement from "./PermissionManagement";
import HotelManagement from "./HotelManagement.jsx";
import BusCompanyManagement from "./BusCompany.jsx";
import "../../styles/Dashboard.admin.css";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="dashboard">
      <Sidebar handleLogout={handleLogout} />
      <div className="content">
        <Routes>
          <Route path="/dashboard" element={<Statistics />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/tickets" element={<TicketManagement />} />
          <Route path="/posts" element={<PostsManagement />} />
          <Route path="/promotions" element={<PromotionManagement />} />
          <Route path="/permission" element={<PermissionManagement />} />
          <Route path="/hotels" element={<HotelManagement />} />
          <Route
            path="/bus-companies"
            element={<BusCompanyManagement />}
          />{" "}
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
