import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import "../../styles/PromotionManagement.css";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    code: "",
    description: "",
    thumbnail: "",
    imageFile: null,
    startDate: "",
    endDate: "",
    totalSlot: 0,
    isIncluded: false,
    isActive: true,
    discountValue: 0,
  });
  const [notification, setNotification] = useState("");
  const [slugEdit, setSlugEdit] = useState("");
  const [detailPromotion, setDetailPromotion] = useState(null);
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    const res = await api.get("/admin/promotions?limit=100");
    setPromotions(res.data?.data?.promotions || []);
  };

  const handleDelete = async (slug) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bài viết này?")) {
      try {
        await api.delete(`/admin/promotions/${slug}`);
        await fetchPromotions();
        showNotification("Xoá khuyến mãi thành công!");
      } catch {
        showNotification("Không thể xoá khuyến mãi!");
      }
    }
  };

  const handleEdit = (promo) => {
    setFormData({
      label: promo.label || "",
      code: promo.code || "",
      description: promo.description || "",
      thumbnail: promo.thumbnail || "",
      imageFile: null,
      startDate: promo.startDate ? promo.startDate.slice(0, 10) : "",
      endDate: promo.endDate ? promo.endDate.slice(0, 10) : "",
      totalSlot: promo.totalSlot || 0,
      isIncluded: promo.isIncluded || false,
      isActive: promo.isActive || true,
      discountValue: promo.discountValue || 0,
    });
    setSlugEdit(promo.slug);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleViewDetail = (promo) => {
    setDetailPromotion(promo);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        thumbnail: URL.createObjectURL(file), // chỉ để preview
      }));
    }
  };

  const handleAddOrEditPromotion = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Sửa: gửi FormData (có thể có file)
        const data = new FormData();
        data.append("label", formData.label);
        data.append("code", formData.code);
        data.append("description", formData.description);
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("totalSlot", formData.totalSlot);
        data.append("isIncluded", formData.isIncluded);
        data.append("isActive", formData.isActive);
        data.append("discountValue", formData.discountValue);
        if (formData.imageFile) {
          data.append("thumbnail", formData.imageFile);
        }
        await api.patch(`/admin/promotions/${slugEdit}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Cập nhật khuyến mãi thành công!");
      } else {
        // Thêm mới giữ nguyên như cũ
        const data = new FormData();
        data.append("label", formData.label);
        data.append("code", formData.code);
        data.append("description", formData.description);
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("totalSlot", formData.totalSlot);
        data.append("isIncluded", formData.isIncluded);
        data.append("isActive", formData.isActive);
        data.append("discountValue", formData.discountValue);
        if (formData.imageFile) {
          data.append("thumbnail", formData.imageFile);
        }
        await api.post("/admin/promotions", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Thêm khuyến mãi thành công!");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setSlugEdit("");
      setFormData({
        label: "",
        code: "",
        description: "",
        thumbnail: "",
        imageFile: null,
        startDate: "",
        endDate: "",
        totalSlot: 0,
        isIncluded: false,
        isActive: true,
        discountValue: 0,
      });
      fetchPromotions();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Có lỗi khi thêm/cập nhật khuyến mãi!"
      );
    }
  };

  return (
    <div className="container">
      <h2>Quản lý Khuyến mãi</h2>
      {notification && <div className="notification">{notification}</div>}
      <button
        className="add-btn"
        onClick={() => {
          setIsModalOpen(true);
          setIsEditMode(false);
          setSlugEdit("");
          setFormData({
            label: "",
            code: "",
            description: "",
            thumbnail: "",
            imageFile: null,
            startDate: "",
            endDate: "",
            totalSlot: 0,
            isIncluded: false,
            isActive: true,
            discountValue: 0,
          });
        }}
      >
        Thêm khuyến mãi
      </button>

      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Mã code</th>
            <th>Ảnh</th>
            <th>Giảm giá</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo) => (
            <tr key={promo.slug}>
              <td>{promo.label}</td>
              <td>{promo.code}</td>
              <td>
                {promo.thumbnail && (
                  <img
                    src={promo.thumbnail}
                    alt="promotion"
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                )}
              </td>
              <td>{promo.discountValue}</td>
              <td>
                {promo.startDate
                  ? new Date(promo.startDate).toLocaleDateString()
                  : ""}
              </td>
              <td>
                {promo.endDate
                  ? new Date(promo.endDate).toLocaleDateString()
                  : ""}
              </td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(promo.slug)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(promo)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(promo)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setSlugEdit("");
              }}
            >
              ×
            </button>
            <h3>{isEditMode ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}</h3>
            <form onSubmit={handleAddOrEditPromotion}>
              <label>Tên khuyến mãi:</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                required
              />

              <label>Mã code:</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />

              <label>Ảnh (chọn từ thiết bị):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.thumbnail && (
                <img
                  src={formData.thumbnail}
                  alt="preview"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    marginTop: 8,
                  }}
                />
              )}
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>

              <label>Ngày bắt đầu:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />

              <label>Ngày kết thúc:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />

              <label>Số lượng slot:</label>
              <input
                type="number"
                name="totalSlot"
                value={formData.totalSlot}
                onChange={handleInputChange}
              />

              <label>Giảm giá:</label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleInputChange}
                required
              />

              <label>
                <input
                  type="checkbox"
                  name="isIncluded"
                  checked={formData.isIncluded}
                  onChange={handleInputChange}
                />
                Áp dụng cho tất cả
              </label>

              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Đang hoạt động
              </label>

              <button type="submit" className="submit-btn">
                {isEditMode ? "Cập nhật" : "Thêm"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết khuyến mãi */}
      {detailPromotion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setDetailPromotion(null)}
            >
              ×
            </button>
            <h3>Chi tiết khuyến mãi</h3>
            <div>
              <strong>Tên khuyến mãi:</strong> {detailPromotion.label}
            </div>
            <div>
              <strong>Mã code:</strong> {detailPromotion.code}
            </div>
            <div>
              <strong>Ảnh:</strong>
              {detailPromotion.thumbnail && (
                <img
                  src={detailPromotion.thumbnail}
                  alt="promotion"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    border: "1px solid #eee",
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                />
              )}
            </div>
            <div>
              <strong>Mô tả:</strong> {detailPromotion.description}
            </div>
            <div>
              <strong>Ngày bắt đầu:</strong>{" "}
              {detailPromotion.startDate
                ? new Date(detailPromotion.startDate).toLocaleDateString()
                : ""}
            </div>
            <div>
              <strong>Ngày kết thúc:</strong>{" "}
              {detailPromotion.endDate
                ? new Date(detailPromotion.endDate).toLocaleDateString()
                : ""}
            </div>
            <div>
              <strong>Số lượng slot:</strong> {detailPromotion.totalSlot}
            </div>
            <div>
              <strong>Giảm giá:</strong> {detailPromotion.discountValue}
            </div>
            <div>
              <strong>Áp dụng cho tất cả:</strong>{" "}
              {detailPromotion.isIncluded ? "Có" : "Không"}
            </div>
            <div>
              <strong>Đang hoạt động:</strong>{" "}
              {detailPromotion.isActive ? "Có" : "Không"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
