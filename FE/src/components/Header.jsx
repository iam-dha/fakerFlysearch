import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";
import { getUserSettings } from "../services/api";
import Cookies from "js-cookie";
const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [name, setName] = useState("");
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const accessToken = Cookies.get("accessToken");
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getUserSettings(accessToken);
        setName(res.data.fullName);
        // console.log(res);
      } catch (err) {
        console.error("Lỗi khi lấy user settings:", err);
      }
    };

    fetchSettings();
  }, []);
  return (
    <header className="homepage-header">
      <h1 className="logo_home">TravelFly ✈️</h1>
      <nav>
        <a href="/home">Trang chủ</a>
        <a href="/hotel">Khách sạn</a>
        <a href="/flight">Vé máy bay</a>
        <a href="/transfer">Đưa đón sân bay</a>
        <a href="/promotion">Ưu đãi</a>
      </nav>
      <div className="user-avatar" onClick={toggleMenu}>
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="User Avatar"
          className="avatar-image"
        />
        <div className="container_point_name">
          <p className="text_name_ava">{name}</p>
          <div className="height_ava"></div>
          <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v3/c/c00ab1f427ddf2519a3e080d9d9c1436.svg" />
          <p className="text_point_ava">318 Điểm</p>
        </div>
      </div>

      {menuVisible && (
        <div className="user-menu">
          <ul>
            <li>
              <Link to="/user/account">Hồ sơ người dùng</Link>
            </li>
            <li>
              <a href="/transaction-history">Lịch sử giao dịch</a>
            </li>
            <li>
              <a href="/sign-in">Đăng xuất</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
