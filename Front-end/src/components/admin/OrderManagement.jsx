import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import "../../styles/UserManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      setNotification("Lỗi khi tải danh sách đơn hàng!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá đơn hàng này?")) {
      try {
        await api.delete(`/orders/${id}`);
        setOrders((prev) => prev.filter((o) => o._id !== id));
        showNotification("Xoá đơn hàng thành công!");
      } catch {
        setNotification("Lỗi khi xoá đơn hàng!");
      }
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000);
  };

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hiển thị chi tiết sản phẩm tuỳ loại
  const renderProductDetails = (order) => {
    if (order.productType === "flight" && order.productDetails) {
      return (
        <div>
          <div>Chuyến bay: {order.productDetails.flightNumber}</div>
          <div>Ngày: {order.productDetails.date}</div>
          <div>Ghế: {order.productDetails.seat}</div>
        </div>
      );
    }
    if (order.productType === "hotel" && order.productDetails) {
      return (
        <div>
          <div>Khách sạn: {order.productDetails.hotelName}</div>
          <div>Phòng: {order.productDetails.roomType}</div>
          <div>Ngày: {order.productDetails.date}</div>
        </div>
      );
    }
    if (order.productType === "bus" && order.productDetails) {
      return (
        <div>
          <div>Tuyến: {order.productDetails.routeName}</div>
          <div>Ngày: {order.productDetails.date}</div>
          <div>Ghế: {order.productDetails.seat}</div>
        </div>
      );
    }
    // Nếu không xác định, hiển thị JSON
    return (
      <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
        {JSON.stringify(order.productDetails, null, 2)}
      </pre>
    );
  };

  return (
    <div className="container">
      <h2>Quản lý Đơn đặt hàng</h2>
      {notification && <div className="notification">{notification}</div>}
      <table>
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>ID Người dùng</th>
            <th>Loại sản phẩm</th>
            <th>Chi tiết sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá tổng cộng</th>
            <th>Trạng thái</th>
            <th>Thời gian đặt</th>
            <th>Phương thức thanh toán</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId}</td>
              <td>{order.productType}</td>
              <td>{renderProductDetails(order)}</td>
              <td>{order.quantity}</td>
              <td>
                {order.total
                  ? order.total.toLocaleString("vi-VN") + " VND"
                  : ""}
              </td>
              <td>{order.status}</td>
              <td>
                {order.date ? new Date(order.date).toLocaleString("vi-VN") : ""}
              </td>
              <td>{order.paymentMethod}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(order._id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(orders.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
