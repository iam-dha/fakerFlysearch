import React, { useEffect, useState } from "react";
import api from "../../services/api.admin";

const BusRoute = ({ company, onClose }) => {
  const [routes, setRoutes] = useState([]);
  const [notification, setNotification] = useState("");
  const [isAddRoute, setIsAddRoute] = useState(false);
  const [isEditRoute, setIsEditRoute] = useState(false);
  const [editRouteId, setEditRouteId] = useState(null);
  const [formData, setFormData] = useState({
    from_iata: "",
    car_type: "",
    price: "",
    max_passengers: "",
    max_baggage: "",
  });

  useEffect(() => {
    if (company) fetchRoutes();
  }, [company]);

  const fetchRoutes = async () => {
    try {
      const res = await api.get("/admin/bus-routes");
      setRoutes(
        (res.data.data || []).filter(
          (r) => r.company === company._id || r.company?._id === company._id // trường hợp company là object
        )
      );
    } catch {
      setNotification("Không thể tải danh sách tuyến!");
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2000);
  };

  const resetForm = () => {
    setFormData({
      from_iata: "",
      car_type: "",
      price: "",
      max_passengers: "",
      max_baggage: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (
      !formData.from_iata.trim() ||
      !formData.car_type.trim() ||
      !formData.price ||
      !formData.max_passengers ||
      !formData.max_baggage
    ) {
      showNotification("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const payload = {
        from_iata: formData.from_iata,
        car_type: formData.car_type,
        price: Number(formData.price),
        max_passengers: Number(formData.max_passengers),
        max_baggage: Number(formData.max_baggage),
      };
      await api.post(`/admin/bus-routes/${company._id}`, payload);
      await fetchRoutes();
      setIsAddRoute(false);
      resetForm();
      showNotification("Thêm tuyến thành công!");
    } catch {
      showNotification("Có lỗi khi thêm tuyến!");
    }
  };

  const handleEditRoute = (route) => {
    setIsEditRoute(true);
    setEditRouteId(route._id);
    setFormData({
      from_iata: route.from_iata || "",
      car_type: route.car_type || "",
      price: route.price || "",
      max_passengers: route.max_passengers || "",
      max_baggage: route.max_baggage || "",
    });
  };

  const handleUpdateRoute = async (e) => {
    e.preventDefault();
    if (
      !formData.from_iata.trim() ||
      !formData.car_type.trim() ||
      !formData.price ||
      !formData.max_passengers ||
      !formData.max_baggage
    ) {
      showNotification("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const payload = {
        from_iata: formData.from_iata,
        car_type: formData.car_type,
        price: Number(formData.price),
        max_passengers: Number(formData.max_passengers),
        max_baggage: Number(formData.max_baggage),
      };
      await api.patch(`/admin/bus-routes/${editRouteId}`, payload);
      await fetchRoutes();
      setIsEditRoute(false);
      setEditRouteId(null);
      resetForm();
      showNotification("Cập nhật tuyến thành công!");
    } catch {
      showNotification("Có lỗi khi cập nhật tuyến!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá tuyến này?")) return;
    try {
      await api.delete(`/admin/bus-routes/${id}`);
      await fetchRoutes();
      showNotification("Xoá tuyến thành công!");
    } catch {
      showNotification("Không thể xoá tuyến!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 800 }}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Quản lý tuyến - {company?.name}</h3>
        {notification && <div className="notification">{notification}</div>}
        <button
          className="add-btn"
          onClick={() => {
            setIsAddRoute(true);
            setIsEditRoute(false);
            resetForm();
          }}
        >
          Thêm tuyến mới
        </button>
        {(isAddRoute || isEditRoute) && (
          <form
            onSubmit={isEditRoute ? handleUpdateRoute : handleAddRoute}
            style={{ margin: "16px 0" }}
          >
            <label>Điểm xuất phát (from_iata):</label>
            <input
              type="text"
              name="from_iata"
              value={formData.from_iata}
              onChange={handleInputChange}
              required
            />
            <label>Loại xe (car_type):</label>
            <input
              type="text"
              name="car_type"
              value={formData.car_type}
              onChange={handleInputChange}
              required
            />
            <label>Giá mỗi km (price):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <label>Số hành khách tối đa (max_passengers):</label>
            <input
              type="number"
              name="max_passengers"
              value={formData.max_passengers}
              onChange={handleInputChange}
              required
            />
            <label>Số hành lý tối đa (max_baggage):</label>
            <input
              type="number"
              name="max_baggage"
              value={formData.max_baggage}
              onChange={handleInputChange}
              required
            />
            <button type="submit" className="submit-btn">
              {isEditRoute ? "Cập nhật tuyến" : "Thêm tuyến"}
            </button>
          </form>
        )}
        <table>
          <thead>
            <tr>
              <th>Điểm xuất phát</th>
              <th>Loại xe</th>
              <th>Giá mỗi km</th>
              <th>Hành khách tối đa</th>
              <th>Hành lý tối đa</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Chưa có tuyến nào.
                </td>
              </tr>
            ) : (
              routes.map((route) => (
                <tr key={route._id}>
                  <td>{route.from_iata}</td>
                  <td>{route.car_type}</td>
                  <td>{route.price}</td>
                  <td>{route.max_passengers}</td>
                  <td>{route.max_baggage}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditRoute(route)}
                    >
                      Sửa
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(route._id)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusRoute;
