import React, { useEffect, useState } from "react";
import api from "../../services/api.admin.js";
import "../../styles/TicketManagement.css";

const DEFAULT_SEAT = { economy: "", premium: "" };

const TicketManagement = () => {
  const [flights, setFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    flight_number: "",
    title: "",
    iata_from: "",
    iata_to: "",
    departure_time: "",
    departure_date: "",
    price: "",
    seat: { ...DEFAULT_SEAT },
    thumbnail: "",
    imageFile: null,
  });
  const [notification, setNotification] = useState("");
  const [detailFlight, setDetailFlight] = useState(null);

  useEffect(() => {
    fetchFlights(currentPage, searchTerm);
    // eslint-disable-next-line
  }, [currentPage, searchTerm]);

  /*const fetchFlights = async (page = 1, search = "") => {
    let url = `/admin/flights?page=${page}&limit=${itemsPerPage}&filter=createdAt&order=desc`;
    const res = await api.get(url);
    let flightsData = res.data.data.flights;
    if (search) {
      flightsData = flightsData.filter(
        (flight) =>
          (flight.flight_number || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (flight.title || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    setFlights(flightsData);
    setTotalPages(res.data.data.totalPages);
  };
*/
  const fetchFlights = async (page = 1, search = "") => {
    try {
      const res = await api.get(
        `/admin/flights?page=${page}&limit=${itemsPerPage}&filter=createdAt&order=desc`
      );
      let fetchedFlights = res.data.data.flights;
      if (search) {
        fetchedFlights = fetchedFlights.filter(
          (flight) =>
            flight.flight_number.toLowerCase().includes(search.toLowerCase()) ||
            flight.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      setFlights(fetchedFlights);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      showNotification("Không thể tải danh sách chuyến bay!");
    }
  };
  const handleDelete = async (flight_number) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá chuyến bay này?")) {
      await api.delete(`/admin/flights/${flight_number}`);
      setFlights(flights.filter((f) => f.flight_number !== flight_number));
      showNotification("Xoá chuyến bay thành công!");
    }
  };

  const handleEdit = (flight) => {
    setFormData({
      flight_number: flight.flight_number || "",
      title: flight.title || "",
      iata_from: flight.iata_from || "",
      iata_to: flight.iata_to || "",
      departure_time: flight.departure_time || "",
      departure_date: flight.departure_date
        ? flight.departure_date.slice(0, 10)
        : "",
      price: flight.price || "",
      seat: {
        economy: flight.seat?.economy || "",
        premium: flight.seat?.premium || "",
      },
      thumbnail: typeof flight.thumbnail === "string" ? flight.thumbnail : "",
      imageFile: null,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleViewDetail = (flight) => {
    setDetailFlight(flight);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "economy" || name === "premium") {
      setFormData((prev) => ({
        ...prev,
        seat: {
          ...prev.seat,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Xử lý chọn ảnh
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file),
        imageFile: file,
      }));
    }
  };

  // Xử lý submit thêm/sửa chuyến bay
  const handleAddOrEditFlight = async (e) => {
    e.preventDefault();
    try {
      let thumbnailUrl = formData.thumbnail;
      if (formData.imageFile) {
        const imgForm = new FormData();
        imgForm.append("thumbnail", formData.imageFile);
        const uploadRes = await api.post(
          "/admin/flights/upload-thumbnail",
          imgForm,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        thumbnailUrl = uploadRes.data.url;
      }
      const payload = {
        ...formData,
        thumbnail: thumbnailUrl,
        price: Number(formData.price) || 0,
        seat: {
          economy: Number(formData.seat.economy) || 0,
          premium: Number(formData.seat.premium) || 0,
        },
      };
      delete payload.imageFile;

      if (isEditMode) {
        await api.patch(`/admin/flights/${formData.flight_number}`, payload);
        showNotification("Cập nhật chuyến bay thành công!");
      } else {
        await api.post("/admin/flights", payload);
        showNotification("Thêm chuyến bay thành công!");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setFormData({
        flight_number: "",
        title: "",
        iata_from: "",
        iata_to: "",
        departure_time: "",
        departure_date: "",
        price: "",
        seat: { ...DEFAULT_SEAT },
        thumbnail: "",
        imageFile: null,
      });
      fetchFlights();
    } catch (err) {
      showNotification("Có lỗi khi lưu chuyến bay!");
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm render số ghế (object hoặc số)
  const renderSeat = (seat) => {
    if (seat && typeof seat === "object") {
      return (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {Object.entries(seat)
            .filter(([type]) => type !== "_id")
            .map(([type, value]) => (
              <li key={type}>
                {type}: {value}
              </li>
            ))}
        </ul>
      );
    }
    return seat || "";
  };

  return (
    <div className="container">
      <h2>Quản lý Chuyến bay</h2>
      {notification && <div className="notification">{notification}</div>}
      <button
        className="add-btn"
        onClick={() => {
          setIsModalOpen(true);
          setIsEditMode(false);
          setFormData({
            flight_number: "",
            title: "",
            iata_from: "",
            iata_to: "",
            departure_time: "",
            departure_date: "",
            price: "",
            seat: { ...DEFAULT_SEAT },
            thumbnail: "",
            imageFile: null,
          });
        }}
      >
        Thêm chuyến bay
      </button>
      <table>
        <thead>
          <tr>
            <th>Mã chuyến bay</th>
            <th>Tên chuyến bay</th>
            <th>Sân bay đi</th>
            <th>Sân bay đến</th>
            <th>Giá vé</th>

            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.flight_number}>
              <td>{flight.flight_number}</td>
              <td>{flight.title}</td>
              <td>{flight.iata_from}</td>
              <td>{flight.iata_to}</td>
              <td>{flight.price} VND</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(flight.flight_number)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(flight)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(flight)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
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
            <h3>{isEditMode ? "Sửa chuyến bay" : "Thêm chuyến bay"}</h3>
            <form onSubmit={handleAddOrEditFlight}>
              <label>Mã chuyến bay:</label>
              <input
                type="text"
                name="flight_number"
                value={formData.flight_number}
                onChange={handleInputChange}
                required
                disabled={isEditMode}
              />

              <label>Tên chuyến bay:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              <label>Sân bay đi (IATA):</label>
              <input
                type="text"
                name="iata_from"
                value={formData.iata_from}
                onChange={handleInputChange}
                required
              />

              <label>Sân bay đến (IATA):</label>
              <input
                type="text"
                name="iata_to"
                value={formData.iata_to}
                onChange={handleInputChange}
                required
              />

              <label>Ngày đi:</label>
              <input
                type="date"
                name="departure_date"
                value={formData.departure_date}
                onChange={handleInputChange}
                required
              />

              <label>Giờ đi:</label>
              <input
                type="time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleInputChange}
                required
              />

              <label>Giá vé Economy:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />

              <label>Số ghế Economy:</label>
              <input
                type="number"
                name="economy"
                value={formData.seat.economy}
                onChange={handleInputChange}
                required
              />

              <label>Số ghế Premium:</label>
              <input
                type="number"
                name="premium"
                value={formData.seat.premium}
                onChange={handleInputChange}
              />

              <label>Ảnh (chọn từ thiết bị):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {formData.thumbnail && (
                <img
                  src={formData.thumbnail}
                  alt="preview"
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    border: "1px solid #eee",
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                />
              )}

              <button type="submit" className="submit-btn">
                {isEditMode ? "Cập nhật" : "Thêm"}
              </button>
            </form>
          </div>
        </div>
      )}

      {detailFlight && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setDetailFlight(null)}
            >
              ×
            </button>
            <h3>Chi tiết chuyến bay</h3>
            <div>
              <strong>Mã chuyến bay:</strong> {detailFlight.flight_number}
            </div>
            <div>
              <strong>Tên chuyến bay:</strong> {detailFlight.title}
            </div>
            <div>
              <strong>Sân bay đi:</strong> {detailFlight.iata_from}
            </div>
            <div>
              <strong>Sân bay đến:</strong> {detailFlight.iata_to}
            </div>
            <div>
              <strong>Ngày đi:</strong> {detailFlight.departure_date}
            </div>
            <div>
              <strong>Giờ đi:</strong> {detailFlight.departure_time}
            </div>
            <div>
              <strong>Giá vé:</strong> {detailFlight.price} VND
            </div>
            <div>
              <strong>Số ghế còn trống:</strong> {renderSeat(detailFlight.seat)}
            </div>
            <div>
              <strong>Ảnh:</strong>
              {detailFlight.thumbnail && (
                <img
                  src={detailFlight.thumbnail}
                  alt="flight"
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    border: "1px solid #eee",
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;
