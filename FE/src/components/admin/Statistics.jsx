/*
import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import "../../styles/Statistics.css";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalOrders: 12,
    totalRevenue: 15,
    totalTicketsSold: 45,
    totalUsers: 6,
    bestSellingFlight: "VietNam Airlines",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Lấy dữ liệu từ các API
      const [ordersRes, ticketsRes, usersRes] = await Promise.all([
        api.get("/admin/orders"),
        api.get("/admin/tickets"),
        api.get("/admin/users"),
      ]);
      const orders = ordersRes.data || [];
      const tickets = ticketsRes.data || [];
      const totalUsers = usersRes.data?.data?.totalCount || 0;
      // Tính toán thống kê
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const totalTicketsSold = tickets.length;

      // Thống kê chuyến bay bán chạy nhất
      const flightCount = {};
      tickets.forEach((t) => {
        if (t.flightId) {
          flightCount[t.flightId] = (flightCount[t.flightId] || 0) + 1;
        }
      });
      let bestSellingFlight = "N/A";
      let max = 0;
      for (const [flight, count] of Object.entries(flightCount)) {
        if (count > max) {
          max = count;
          bestSellingFlight = flight;
        }
      }

      setStats({
        totalOrders,
        totalRevenue,
        totalTicketsSold,
        totalUsers,
        bestSellingFlight,
      });
    } catch (error) {
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalTicketsSold: 0,
        totalUsers: 0,
        bestSellingFlight: "N/A",
      });
    }
  };

  return (
    <div className="statistics-container">
      <h2>Thống kê</h2>
      <div className="stats-overview">
        <div className="stat-item">
          <h3>Tổng số đơn đặt vé</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-item">
          <h3>Doanh thu tổng</h3>
          <p>
            {stats.totalRevenue ? stats.totalRevenue.toLocaleString() : "0"} VND
          </p>
        </div>
        <div className="stat-item">
          <h3>Tổng số vé đã bán</h3>
          <p>{stats.totalTicketsSold}</p>
        </div>
        <div className="stat-item">
          <h3>Tổng số người dùng</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-item">
          <h3>Chuyến bay bán chạy nhất</h3>
          <p>{stats.bestSellingFlight}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
*/
import React from "react";
import "../../styles/Statistics.css";

const Statistics = () => {
  return (
    <div
      className="statistics-container"
      style={{ textAlign: "center", padding: "60px 0" }}
    >
      <h2>Xin chào Quản trị viên!</h2>
      <p style={{ fontSize: 20, marginTop: 24 }}>
        Chào mừng bạn đến với trang quản trị hệ thống bán vé máy bay.
        <br />
        Hãy sử dụng menu bên trái để quản lý người dùng, phòng khách sạn, chuyến
        bay, đơn đặt vé, v.v.
      </p>
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="Welcome"
        style={{ width: 120, marginTop: 32, opacity: 0.8 }}
      />
    </div>
  );
};

export default Statistics;
