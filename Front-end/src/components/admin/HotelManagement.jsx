import React, { useState, useEffect } from "react";
import RoomManagement from "./RoomManagement";
import api from "../../services/api";

const HotelManagement = () => {
  const [roomHotel, setRoomHotel] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [notification, setNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    stars: 1,
    iata: "",
    phone: "",
    email: "",
    contact_email: "",
    thumbnail: null, // file object
    previewThumbnail: "", // preview url
    status: "active",
    _id: "",
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailHotel, setDetailHotel] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHotels(currentPage);
  }, [currentPage]);

  const fetchHotels = async (page = 1) => {
    try {
      const res = await api.get(
        `/admin/hotels?page=${page}&limit=${itemsPerPage}&sort=createdAt&order=desc`
      );
      setHotels(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      setNotification("Không thể tải danh sách khách sạn!");
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2500);
  };

  const handleOpenModal = (hotel = null) => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        address: hotel.address || "",
        description: hotel.description || "",
        stars: hotel.stars || 1,
        iata: hotel.iata || "",
        phone: hotel.phone || "",
        email: hotel.email || "",
        contact_email: hotel.contact_email || "",
        thumbnail: null, // reset file object
        previewThumbnail: hotel.thumbnail || "",
        status: hotel.status || "active",
        _id: hotel._id || "",
      });
      setIsEditMode(true);
    } else {
      setFormData({
        name: "",
        address: "",
        description: "",
        stars: 1,
        iata: "",
        phone: "",
        email: "",
        contact_email: "",
        thumbnail: null,
        previewThumbnail: "",
        status: "active",
        _id: "",
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      address: "",
      description: "",
      stars: 1,
      iata: "",
      phone: "",
      email: "",
      contact_email: "",
      thumbnail: null,
      previewThumbnail: "",
      status: "active",
      _id: "",
    });
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      showNotification("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      if (isEditMode) {
        // Sử dụng FormData như room
        const data = new FormData();
        data.append("name", formData.name);
        data.append("address", formData.address);
        data.append("description", formData.description);
        data.append("stars", formData.stars);
        data.append("iata", formData.iata);
        data.append("phone", formData.phone);
        data.append("email", formData.email);
        data.append("contact_email", formData.contact_email);
        data.append("status", formData.status);
        if (formData.thumbnail) {
          data.append("thumbnail", formData.thumbnail);
        }
        // Nếu muốn xoá ảnh
        if (formData.previewThumbnail === "" && !formData.thumbnail) {
          data.append("removeThumbnail", true);
        }
        await api.patch(`/admin/hotels/${formData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Cập nhật khách sạn thành công!");
      } else {
        // Thêm mới giữ nguyên như cũ
        const data = new FormData();
        data.append("name", formData.name);
        data.append("address", formData.address);
        data.append("description", formData.description);
        data.append("stars", formData.stars);
        data.append("iata", formData.iata);
        data.append("phone", formData.phone);
        data.append("email", formData.email);
        data.append("contact_email", formData.contact_email);
        data.append("status", formData.status);
        if (formData.thumbnail) {
          data.append("thumbnail", formData.thumbnail);
        }
        await api.post("/admin/hotels", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Thêm khách sạn thành công!");
      }
      await fetchHotels(currentPage);
      handleCloseModal();
    } catch (error) {
      showNotification(
        error?.response?.data?.message || "Có lỗi khi lưu khách sạn!"
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá khách sạn này?")) {
      try {
        await api.delete(`/admin/hotels/${id}`);
        await fetchHotels(currentPage);
        showNotification("Xoá khách sạn thành công!");
      } catch {
        showNotification("Không thể xoá khách sạn!");
      }
    }
  };

  const handleViewDetail = (hotel) => {
    setDetailHotel(hotel);
    setIsDetailModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Chọn file ảnh đại diện
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        previewThumbnail: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="container">
      <h2>Quản lý Khách sạn</h2>
      {notification && <div className="notification">{notification}</div>}
      <button className="add-btn" onClick={() => handleOpenModal()}>
        Thêm khách sạn
      </button>
      <table>
        <thead>
          <tr>
            <th>Tên khách sạn</th>
            <th>Ảnh đại diện</th>
            <th>IATA</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel._id}>
              <td>{hotel.name}</td>
              <td>
                {hotel.thumbnail ? (
                  <img
                    src={hotel.thumbnail}
                    alt="hotel"
                    style={{
                      width: 100,
                      height: 60,
                      objectFit: "cover",
                      border: "1px solid #eee",
                      borderRadius: 4,
                    }}
                  />
                ) : (
                  <span>Chưa có</span>
                )}
              </td>
              <td>{hotel.iata}</td>
              <td>{hotel.phone}</td>
              <td>{hotel.email}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleOpenModal(hotel)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(hotel._id)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(hotel)}
                >
                  Xem chi tiết
                </button>
                <button
                  className="action-btn"
                  onClick={() => setRoomHotel(hotel)}
                >
                  Quản lý phòng
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setCurrentPage(idx + 1)}
            className={currentPage === idx + 1 ? "active" : ""}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <h3>{isEditMode ? "Sửa khách sạn" : "Thêm khách sạn"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Tên khách sạn:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              <label>Số sao:</label>
              <input
                type="number"
                name="stars"
                value={formData.stars}
                min={1}
                max={5}
                onChange={handleInputChange}
              />
              <label>IATA:</label>
              <input
                type="text"
                name="iata"
                value={formData.iata}
                onChange={handleInputChange}
              />
              <label>Điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <label>Email liên hệ:</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
              />
              <label>Ảnh đại diện (chọn ảnh):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.previewThumbnail && (
                <div style={{ margin: "8px 0" }}>
                  <img
                    src={formData.previewThumbnail}
                    alt="hotel"
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      border: "1px solid #eee",
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}
              <label>Trạng thái:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
              <button
                type="submit"
                className="submit-btn"
                style={{ marginTop: 16 }}
              >
                {isEditMode ? "Cập nhật" : "Thêm"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDetailModalOpen && detailHotel && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button
              className="modal-close"
              onClick={() => {
                setIsDetailModalOpen(false);
                setDetailHotel(null);
              }}
            >
              ×
            </button>
            <h3>Chi tiết khách sạn</h3>
            <div style={{ marginBottom: 8 }}>
              <strong>Tên khách sạn:</strong> {detailHotel.name}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Địa chỉ:</strong> {detailHotel.address}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Mô tả:</strong> {detailHotel.description}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Số sao:</strong> {detailHotel.stars}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>IATA:</strong> {detailHotel.iata}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Điện thoại:</strong> {detailHotel.phone}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Email:</strong> {detailHotel.email}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Email liên hệ:</strong> {detailHotel.contact_email}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Ảnh đại diện:</strong>
              <br />
              {detailHotel.thumbnail ? (
                <img
                  src={detailHotel.thumbnail}
                  alt="hotel"
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    border: "1px solid #eee",
                    borderRadius: 4,
                  }}
                />
              ) : (
                <span>Chưa có</span>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Trạng thái:</strong> {detailHotel.status || "active"}
            </div>
          </div>
        </div>
      )}
      {roomHotel && (
        <RoomManagement hotel={roomHotel} onClose={() => setRoomHotel(null)} />
      )}
    </div>
  );
};

export default HotelManagement;
