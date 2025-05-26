import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ handleLogout, navigateToHome }) => {
  const role = localStorage.getItem("role");
  return (
    <div className="sidebar">
      <h2>Admin</h2>
      <ul>
        <li>
          <Link to="/admin/dashboard">Tổng quan</Link>
        </li>
        <li>
          <Link to="/admin/users">Quản lý Người dùng</Link>
        </li>

        <li>
          <Link to="/admin/tickets">Quản lý Chuyến bay</Link>
        </li>
        <li>
          <Link to="/admin/hotels">Quản lý khách sạn</Link>
        </li>
        <li>
          <Link to="/admin/bus-companies">Quản lý xe taxi</Link>
        </li>
        <li>
          <Link to="/admin/promotions">Quản lý Khuyến mãi</Link>
        </li>
        <li>
          <Link to="/admin/posts">Quản lý bài viết</Link>
        </li>

        {role === "Admin" && (
          <li>
            <Link to="/admin/permission">Chỉnh sửa quyền</Link>
          </li>
        )}
        <li onClick={handleLogout}>Đăng xuất</li>
      </ul>
    </div>
  );
};

export default Sidebar;
