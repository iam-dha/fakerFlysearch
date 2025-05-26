import React, { useState } from "react";
import "../styles/ResultSearchVehicle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faMapMarkerAlt,
  faClock,
  faUserGroup,
  faSuitcaseRolling,
} from "@fortawesome/free-solid-svg-icons";

const dummyResults = [
  {
    id: 1,
    company: "Xe Limousine ABC",
    from: "Hà Nội",
    to: "Ninh Bình",
    time: "07:30",
    duration: "2h 30m",
    price: "200.000₫",
    passengers: 9,
    luggage: "20kg/người",
    image: "/images/airportTransfer/bus.jpg",
  },
  {
    id: 2,
    company: "Xe VIP 123",
    from: "Hà Nội",
    to: "Ninh Bình",
    time: "09:00",
    duration: "2h 15m",
    price: "220.000₫",
    passengers: 16,
    luggage: "15kg/người",
    image: "/images/airportTransfer/sedan.jpg",
  },
];

export default function ResultSearchVehicle({ formData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ username: "", phone: "", email: "" });
  const [message, setMessage] = useState("");

  const openModal = () => {
    setIsOpen(true);
    setMessage("");
  };

  const closeModal = () => {
    setIsOpen(false);
    setForm({ username: "", phone: "", email: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ở đây bạn có thể thêm validate nếu muốn
    setMessage("Đặt đơn thành công. Vui lòng đợi liên hệ!");
    setTimeout(() => {
      setIsOpen(false);
      setMessage("");
      setForm({
        username: "",
        phone: "",
        email: "",
      });
    }, 5000);
  };
  return (
    <div className="result-container">
      <h2 className="result-title">🚍 Kết quả tìm kiếm chuyến xe</h2>
      <div className="vehicle-list">
        {formData.map((item) => {
          const [date, timeWithZone] = item.createdAt.split("T");
          const time = timeWithZone.replace("Z", "").split(".")[0];
          return (
            <div className="vehicle-card" key={item._id}>
              <img src={item.logo} alt={item.company} className="vehicle-img" />
              <div className="vehicle-info">
                <h3 className="company">{item.car_type}</h3>
                <p className="route">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.from_iata}
                </p>
                <p className="time">
                  <FontAwesomeIcon icon={faClock} /> {time} ({date})
                </p>
                <p className="capacity">
                  <FontAwesomeIcon icon={faUserGroup} /> {item.max_passengers}{" "}
                  hành khách | <FontAwesomeIcon icon={faSuitcaseRolling} />{" "}
                  {item.max_baggage}
                </p>
                <p className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}
                  /km
                </p>
                <button className="book-btn" onClick={openModal}>
                  <FontAwesomeIcon icon={faBus} /> Đặt ngay
                </button>

                {isOpen && (
                  <div className="modal-overlay" onClick={closeModal}>
                    <div
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="modal-title">🚗 Xác nhận đặt xe</h2>
                      <form className="modal-form" onSubmit={handleSubmit}>
                        <label>
                          Họ và tên
                          <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên của bạn"
                          />
                        </label>
                        <label>
                          Số điện thoại
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            placeholder="Nhập số điện thoại"
                          />
                        </label>
                        <label>
                          Email
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="Nhập email của bạn"
                          />
                        </label>
                        <div className="modal-buttons">
                          <button type="submit" className="btn-confirm">
                            🚀 Đặt ngay
                          </button>
                          <button
                            type="button"
                            className="btn-cancel"
                            onClick={closeModal}
                          >
                            ❌ Hủy
                          </button>
                        </div>
                      </form>
                      {message && <p className="success-message">{message}</p>}
                    </div>
                  </div>
                )}

                <style jsx>{`
                  .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backdrop-filter: blur(6px); /* Mờ nền */
                    background-color: rgba(255, 255, 255, 0.15);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                  }

                  .modal-content {
                    background: white;
                    padding: 32px;
                    border-radius: 16px;
                    width: 400px;
                    max-width: 90%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    animation: slideIn 0.4s ease forwards;
                    position: relative;
                    transition: all 0.3s ease;
                  }

                  .modal-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 20px;
                    text-align: center;
                  }

                  .modal-form label {
                    display: flex;
                    flex-direction: column;
                    font-size: 14px;
                    color: #555;
                    margin-bottom: 18px;
                  }

                  .modal-form input {
                    padding: 12px;
                    border: 1.5px solid #ccc;
                    border-radius: 10px;
                    font-size: 16px;
                    margin-top: 6px;
                    transition: border-color 0.3s;
                  }

                  .modal-form input:focus {
                    border-color: #007bff;
                    outline: none;
                  }

                  .modal-buttons {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                    margin-top: 24px;
                  }

                  .btn-confirm {
                    flex: 1;
                    background: linear-gradient(to right, #28a745, #3ddc84);
                    color: white;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s ease;
                  }

                  .btn-confirm:hover {
                    background: linear-gradient(to right, #218838, #34c977);
                  }

                  .btn-cancel {
                    flex: 1;
                    background: linear-gradient(to right, #dc3545, #ff6b6b);
                    color: white;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s ease;
                  }

                  .btn-cancel:hover {
                    background: linear-gradient(to right, #c82333, #ff4d4d);
                  }

                  .success-message {
                    margin-top: 20px;
                    color: #28a745;
                    text-align: center;
                    font-weight: 600;
                  }

                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                    }
                    to {
                      opacity: 1;
                    }
                  }

                  @keyframes slideIn {
                    from {
                      opacity: 0;
                      transform: translateY(-30px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// Style đơn giản cho modal (bạn có thể thay bằng CSS riêng)
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 8,
  maxWidth: 400,
  width: "90%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
};
