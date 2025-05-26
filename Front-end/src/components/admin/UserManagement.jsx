/*
import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import "../../styles/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    email: "",
    status: "",
    address: "",
    phone: "",
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      const res = await api.get(
        `/admin/users?limit=${itemsPerPage}&page=${page}`
      );
      const userList = res.data?.data?.users || [];
      setUsers(userList);
      setTotalPage(res.data?.data?.totalPage || 1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      setUsers([]);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      showNotification("Xoá người dùng thành công!");
    } catch (error) {
      alert("Lỗi khi xoá người dùng!");
      console.error("Lỗi khi xoá người dùng:", error);
    }
  };

  const handleEdit = async (user) => {
    try {
      // Lấy chi tiết user để lấy đủ thông tin (address, phone,...)
      const res = await api.get(`/admin/users/${user.userId}`);
      const detail = res.data?.data || {};
      setFormData({
        userId: user.userId,
        fullName: detail.fullName || "",
        email: detail.email || "",
        status: detail.status || "",
        address: detail.address || "",
        phone: detail.phone || "",
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      alert("Không thể lấy thông tin chi tiết người dùng!");
    }
  };

  const handleViewDetail = async (user) => {
    try {
      const res = await api.get(`/admin/users/${user.userId}`);
      setDetailUser(res.data?.data || null);
      setIsDetailModalOpen(true);
    } catch (error) {
      alert("Không thể lấy thông tin chi tiết người dùng!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrEditUser = async (e) => {
    e.preventDefault();
    if (!formData.userId) {
      alert("Không xác định được người dùng để cập nhật!");
      return;
    }
    try {
      const updateData = {
        email: formData.email,
        fullName: formData.fullName,
        address: formData.address,
        status: formData.status,
        phone: formData.phone,
      };
      await api.patch(`/admin/users/${formData.userId}`, updateData);
      fetchUsers(currentPage);
      showNotification("Cập nhật thông tin người dùng thành công!");
      setIsModalOpen(false);
      setIsEditMode(false);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Có lỗi khi cập nhật người dùng. Vui lòng kiểm tra lại dữ liệu!"
      );
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  // Phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2>Quản lý Người dùng</h2>
      {notification && <div className="notification">{notification}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đầy đủ</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(user.userId)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(user)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(user)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    
      <div className="pagination">
        {Array.from({ length: totalPage }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

     
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
              }}
            >
              ×
            </button>
            <h3>Sửa thông tin người dùng</h3>
            <form onSubmit={handleAddOrEditUser}>
              <label>Họ tên đầy đủ:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label>Trạng thái:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <button type="submit" className="submit-btn">
                Cập nhật
              </button>
            </form>
          </div>
        </div>
      )}

     
      {isDetailModalOpen && detailUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => {
                setIsDetailModalOpen(false);
                setDetailUser(null);
              }}
            >
              ×
            </button>
            <h3>Chi tiết người dùng</h3>
            <div>
              <div style={{ marginBottom: 8 }}>
                <strong>Họ tên đầy đủ:</strong> {detailUser.fullName}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Email:</strong> {detailUser.email}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Trạng thái:</strong> {detailUser.status}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Địa chỉ:</strong>{" "}
                {detailUser.address || "Chưa cập nhật"}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Số điện thoại:</strong>{" "}
                {detailUser.phone || "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
*/
import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import "../../styles/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    email: "",
    status: "",
    address: "",
    phone: "",
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  // State cho modal thêm người dùng
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    status: "active",
    phone: "",
    role: "user",
    password: "",
  });

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      const res = await api.get(
        `/admin/users?limit=${itemsPerPage}&page=${page}`
      );
      const userList = res.data?.data?.users || [];
      setUsers(userList);
      setTotalPage(res.data?.data?.totalPage || 1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      setUsers([]);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá người dùng này?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      showNotification("Xoá người dùng thành công!");
    } catch (error) {
      alert("Lỗi khi xoá người dùng!");
      console.error("Lỗi khi xoá người dùng:", error);
    }
  };

  const handleEdit = async (user) => {
    try {
      // Lấy chi tiết user để lấy đủ thông tin (address, phone,...)
      const res = await api.get(`/admin/users/${user.userId}`);
      const detail = res.data?.data || {};
      setFormData({
        userId: user.userId,
        fullName: detail.fullName || "",
        email: detail.email || "",
        status: detail.status || "",
        address: detail.address || "",
        phone: detail.phone || "",
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error) {
      alert("Không thể lấy thông tin chi tiết người dùng!");
    }
  };

  const handleViewDetail = async (user) => {
    try {
      const res = await api.get(`/admin/users/${user.userId}`);
      setDetailUser(res.data?.data || null);
      setIsDetailModalOpen(true);
    } catch (error) {
      alert("Không thể lấy thông tin chi tiết người dùng!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrEditUser = async (e) => {
    e.preventDefault();
    if (!formData.userId) {
      alert("Không xác định được người dùng để cập nhật!");
      return;
    }
    try {
      const updateData = {
        email: formData.email,
        fullName: formData.fullName,
        address: formData.address,
        status: formData.status,
        phone: formData.phone,
      };
      await api.patch(`/admin/users/${formData.userId}`, updateData);
      fetchUsers(currentPage);
      showNotification("Cập nhật thông tin người dùng thành công!");
      setIsModalOpen(false);
      setIsEditMode(false);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Có lỗi khi cập nhật người dùng. Vui lòng kiểm tra lại dữ liệu!"
      );
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  // Thêm người dùng
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", addFormData);
      fetchUsers(currentPage);
      showNotification("Thêm người dùng thành công!");
      setIsAddModalOpen(false);
      setAddFormData({
        email: "",
        fullName: "",
        address: "",
        status: "active",
        phone: "",
        role: "user",
        password: "",
      });
    } catch (error) {
      showNotification(
        error?.response?.data?.message ||
          "Có lỗi khi thêm người dùng. Vui lòng kiểm tra lại dữ liệu!"
      );
    }
  };

  // Phân trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2>Quản lý Người dùng</h2>
      {notification && <div className="notification">{notification}</div>}

      {/* Nút thêm người dùng */}
      <button
        className="add-btn"
        style={{ marginBottom: 12 }}
        onClick={() => setIsAddModalOpen(true)}
      >
        Thêm người dùng
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đầy đủ</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(user.userId)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(user)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(user)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        {Array.from({ length: totalPage }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal sửa thông tin người dùng */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
              }}
            >
              ×
            </button>
            <h3>Sửa thông tin người dùng</h3>
            <form onSubmit={handleAddOrEditUser}>
              <label>Họ tên đầy đủ:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label>Trạng thái:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <button type="submit" className="submit-btn">
                Cập nhật
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal thêm người dùng */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setIsAddModalOpen(false)}
            >
              ×
            </button>
            <h3>Thêm người dùng mới</h3>
            <form onSubmit={handleAddUser}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={addFormData.email}
                onChange={handleAddInputChange}
                required
              />
              <label>Họ tên đầy đủ:</label>
              <input
                type="text"
                name="fullName"
                value={addFormData.fullName}
                onChange={handleAddInputChange}
                required
              />
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={addFormData.address}
                onChange={handleAddInputChange}
              />
              <label>Trạng thái:</label>
              <select
                name="status"
                value={addFormData.status}
                onChange={handleAddInputChange}
                required
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={addFormData.phone}
                onChange={handleAddInputChange}
              />
              <label>Vai trò:</label>
              <input
                type="text"
                name="role"
                value={addFormData.role}
                onChange={handleAddInputChange}
                required
                placeholder="Nhập vai trò, ví dụ: user hoặc admin"
              />
              <label>Mật khẩu:</label>
              <input
                type="password"
                name="password"
                value={addFormData.password}
                onChange={handleAddInputChange}
                required
              />
              <button type="submit" className="submit-btn">
                Thêm người dùng
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết người dùng */}
      {isDetailModalOpen && detailUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => {
                setIsDetailModalOpen(false);
                setDetailUser(null);
              }}
            >
              ×
            </button>
            <h3>Chi tiết người dùng</h3>
            <div>
              <div style={{ marginBottom: 8 }}>
                <strong>Họ tên đầy đủ:</strong> {detailUser.fullName}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Email:</strong> {detailUser.email}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Trạng thái:</strong> {detailUser.status}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Địa chỉ:</strong>{" "}
                {detailUser.address || "Chưa cập nhật"}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Số điện thoại:</strong>{" "}
                {detailUser.phone || "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
