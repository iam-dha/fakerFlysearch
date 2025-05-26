/*
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import BusRoute from "./BusRoute";

const BusCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [notification, setNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    website: "",
    status: "active",
    logo: "",
    description: "",
    _id: "",
  });
  const [detailCompany, setDetailCompany] = useState(null);
  const [routeCompany, setRouteCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/admin/bus-companies");
      setCompanies((res.data.data || []).filter((c) => !c.deleted));
    } catch (error) {
      setNotification("Không thể tải danh sách công ty!");
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2500);
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: URL.createObjectURL(file),
      }));
      const form = new FormData();
      form.append("logo", file);
      try {
        const res = await api.post("/admin/bus-companies/upload-logo", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data?.url) {
          setFormData((prev) => ({
            ...prev,
            logo: res.data.url,
          }));
        } else {
          showNotification("Lỗi upload logo, vui lòng thử lại!");
        }
      } catch {
        showNotification("Lỗi upload logo, vui lòng thử lại!");
      }
    }
  };

  const handleOpenModal = (company = null) => {
    if (company) {
      setFormData({
        name: company.name || "",
        phone: company.contact?.phone || "",
        email: company.contact?.email || "",
        website: company.contact?.website || "",
        status: company.status || "active",
        logo: company.logo || "",
        description: company.description || "",
        _id: company._id || "",
      });
      setIsEditMode(true);
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        website: "",
        status: "active",
        logo: "",
        description: "",
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
      phone: "",
      email: "",
      website: "",
      status: "active",
      logo: "",
      description: "",
      _id: "",
    });
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("contact[phone]", formData.phone);
      data.append("contact[email]", formData.email);
      data.append("contact[website]", formData.website);
      data.append("description", formData.description);
      data.append("status", formData.status);
      if (formData.logo) {
        data.append("logo", formData.logo);
      }
      if (isEditMode) {
        await api.patch(`/admin/bus-companies/${formData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Cập nhật công ty xe bus thành công!");
      } else {
        await api.post("/admin/bus-companies", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Thêm công ty xe bus thành công!");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        website: "",
        status: "active",
        logo: "",
        description: "",
        _id: "",
      });
      fetchCompanies();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Có lỗi khi lưu công ty xe bus!"
      );
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá công ty này?")) {
      try {
        await api.delete(`/admin/bus-companies/${id}`);
        await fetchCompanies();
        showNotification("Xoá công ty thành công!");
      } catch {
        showNotification("Không thể xoá công ty!");
      }
    }
  };

  const handleViewDetail = (company) => {
    setDetailCompany(company);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <h2>Quản lý xe taxi</h2>
      {notification && <div className="notification">{notification}</div>}
      <button className="add-btn" onClick={() => handleOpenModal()}>
        Thêm công ty
      </button>
      <table>
        <thead>
          <tr>
            <th>Tên công ty</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Website</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.contact?.phone || ""}</td>
              <td>{company.contact?.email || ""}</td>
              <td>{company.contact?.website || ""}</td>
              <td>{company.status || "active"}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleOpenModal(company)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(company._id)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(company)}
                >
                  Xem chi tiết
                </button>
                <button
                  className="action-btn"
                  onClick={() => setRouteCompany(company)}
                >
                  Quản lý tuyến
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <h3>{isEditMode ? "Sửa công ty" : "Thêm công ty"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Tên công ty:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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
              <label>Website:</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
              <label>Logo:</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              {formData.logo && (
                <div style={{ margin: "8px 0" }}>
                  <img
                    src={formData.logo}
                    alt="logo"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      border: "1px solid #eee",
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
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

      
      {detailCompany && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button
              className="modal-close"
              onClick={() => setDetailCompany(null)}
            >
              ×
            </button>
            <h3>Chi tiết công ty</h3>
            <div style={{ marginBottom: 8 }}>
              <strong>Tên công ty:</strong> {detailCompany.name}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Điện thoại:</strong> {detailCompany.contact?.phone || ""}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Email:</strong> {detailCompany.contact?.email || ""}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Website:</strong> {detailCompany.contact?.website || ""}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Logo:</strong>
              {detailCompany.logo ? (
                <img
                  src={detailCompany.logo}
                  alt="logo"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    border: "1px solid #eee",
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                />
              ) : (
                <span>Chưa có</span>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Mô tả:</strong> {detailCompany.description}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Trạng thái:</strong> {detailCompany.status || "active"}
            </div>
          </div>
        </div>
      )}

      
      {routeCompany && (
        <BusRoute
          company={routeCompany}
          onClose={() => setRouteCompany(null)}
        />
      )}
    </div>
  );
};

export default BusCompany;
*/
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import BusRoute from "./BusRoute";

const BusCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [notification, setNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    website: "",
    status: "active",
    logo: "",
    logoFile: null,
    logoPreview: "",
    description: "",
    _id: "",
  });
  const [detailCompany, setDetailCompany] = useState(null);
  const [routeCompany, setRouteCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/admin/bus-companies");
      setCompanies((res.data.data || []).filter((c) => !c.deleted));
    } catch (error) {
      setNotification("Không thể tải danh sách công ty!");
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2500);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleOpenModal = (company = null) => {
    if (company) {
      setFormData({
        name: company.name || "",
        phone: company.contact?.phone || "",
        email: company.contact?.email || "",
        website: company.contact?.website || "",
        status: company.status || "active",
        logo: company.logo || "",
        logoFile: null,
        logoPreview: company.logo || "",
        description: company.description || "",
        _id: company._id || "",
      });
      setIsEditMode(true);
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        website: "",
        status: "active",
        logo: "",
        logoFile: null,
        logoPreview: "",
        description: "",
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
      phone: "",
      email: "",
      website: "",
      status: "active",
      logo: "",
      logoFile: null,
      logoPreview: "",
      description: "",
      _id: "",
    });
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("contact[phone]", formData.phone);
      data.append("contact[email]", formData.email);
      data.append("contact[website]", formData.website);
      data.append("description", formData.description);
      data.append("status", formData.status);
      if (formData.logoFile) {
        data.append("logo", formData.logoFile);
      }
      if (isEditMode) {
        await api.patch(`/admin/bus-companies/${formData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Cập nhật công ty xe bus thành công!");
      } else {
        await api.post("/admin/bus-companies", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showNotification("Thêm công ty xe bus thành công!");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        website: "",
        status: "active",
        logo: "",
        logoFile: null,
        logoPreview: "",
        description: "",
        _id: "",
      });
      fetchCompanies();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Có lỗi khi lưu công ty xe bus!"
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá công ty này?")) {
      try {
        await api.delete(`/admin/bus-companies/${id}`);
        await fetchCompanies();
        showNotification("Xoá công ty thành công!");
      } catch {
        showNotification("Không thể xoá công ty!");
      }
    }
  };

  const handleViewDetail = (company) => {
    setDetailCompany(company);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <h2>Quản lý xe taxi</h2>
      {notification && <div className="notification">{notification}</div>}
      <button className="add-btn" onClick={() => handleOpenModal()}>
        Thêm công ty
      </button>
      <table>
        <thead>
          <tr>
            <th>Tên công ty</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Website</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.contact?.phone || ""}</td>
              <td>{company.contact?.email || ""}</td>
              <td>{company.contact?.website || ""}</td>
              <td>{company.status || "active"}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleOpenModal(company)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(company._id)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(company)}
                >
                  Xem chi tiết
                </button>
                <button
                  className="action-btn"
                  onClick={() => setRouteCompany(company)}
                >
                  Quản lý tuyến
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm/sửa công ty */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <h3>{isEditMode ? "Sửa công ty" : "Thêm công ty"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Tên công ty:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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
              <label>Website:</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
              <label>Logo:</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              {(formData.logoPreview ||
                (formData.logo && typeof formData.logo === "string")) && (
                <div style={{ margin: "8px 0" }}>
                  <img
                    src={
                      formData.logoPreview ||
                      (typeof formData.logo === "string" ? formData.logo : "")
                    }
                    alt="logo"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      border: "1px solid #eee",
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
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

      {/* Modal xem chi tiết công ty */}
      {detailCompany && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button
              className="modal-close"
              onClick={() => setDetailCompany(null)}
            >
              ×
            </button>
            <h3>Chi tiết công ty</h3>
            <div style={{ marginBottom: 8 }}>
              <strong>Tên công ty:</strong> {detailCompany.name}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Điện thoại:</strong> {detailCompany.contact?.phone || ""}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Email:</strong> {detailCompany.contact?.email || ""}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Website:</strong> {detailCompany.contact?.website || ""}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Logo:</strong>
              {detailCompany.logo ? (
                <img
                  src={detailCompany.logo}
                  alt="logo"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    border: "1px solid #eee",
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                />
              ) : (
                <span>Chưa có</span>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Mô tả:</strong> {detailCompany.description}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Trạng thái:</strong> {detailCompany.status || "active"}
            </div>
          </div>
        </div>
      )}

      {/* Modal quản lý tuyến */}
      {routeCompany && (
        <BusRoute
          company={routeCompany}
          onClose={() => setRouteCompany(null)}
        />
      )}
    </div>
  );
};

export default BusCompany;
