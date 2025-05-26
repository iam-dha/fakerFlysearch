import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "../styles/TransactionHistory.css";
import { getBookingHistory, payAllBooking } from "../services/api";
import Cookies from "js-cookie";
const transactions = [
  {
    id: 1,
    date: "20 Thg 5, 2025 - 14:00",
    amount: 500000,
    type: "Thanh toán khách sạn",
    status: "Thành công",
    code: "HDX123456",
    location: "Khách sạn Da Nang Central",
    method: "Thẻ VISA",
    icon: "🏨",
  },
  {
    id: 2,
    date: "18 Thg 5, 2025 - 09:35",
    amount: -200000,
    type: "Hoàn tiền vé máy bay",
    status: "Đã hoàn tiền",
    code: "HDX654321",
    location: "Chuyến bay Hà Nội - HCM",
    method: "Ví MoMo",
    icon: "✈️",
  },
  {
    id: 3,
    date: "15 Thg 5, 2025 - 17:45",
    amount: 1000000,
    type: "Thanh toán tour",
    status: "Thành công",
    code: "HDX789123",
    location: "Tour du lịch Phú Quốc",
    method: "Thẻ MasterCard",
    icon: "🗺️",
  },
];

export default function TransactionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); // Hiển thị loading nếu cần
  const [error, setError] = useState(null);
  const accessToken = Cookies.get("accessToken");
  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await getBookingHistory(accessToken); // Gọi API
        setHistory(response.data); // Lưu dữ liệu vào state
      } catch (err) {
        setError("Không thể tải lịch sử đặt chỗ");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [history]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (txn) => {
    const doc = new jsPDF();
    doc.text("HÓA ĐƠN GIAO DỊCH", 10, 10);
    doc.text(`Mã giao dịch: ${txn.code}`, 10, 20);
    doc.text(`Loại: ${txn.type}`, 10, 30);
    doc.text(`Ngày: ${txn.date}`, 10, 40);
    doc.text(`Số tiền: ${txn.amount.toLocaleString()} đ`, 10, 50);
    doc.text(`Địa điểm: ${txn.location}`, 10, 60);
    doc.text(`Phương thức: ${txn.method}`, 10, 70);
    doc.save(`HoaDon_${txn.code}.pdf`);
  };
  // console.log(history);
  const [showPopup, setShowPopup] = useState(false);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert("Thanh toán thành công!");
    setShowPopup(false);
  };
  const handlePayAll = async () => {
    const result = await payAllBooking(accessToken);
  };
  return (
    <div className="transaction-history-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate("/home")}>
          ⬅ Quay lại
        </button>
        <button className="back-button" onClick={() => setShowPopup(true)}>
          Thanh toán tất cả
        </button>

        {showPopup && (
          <div className="payment-overlay" onClick={() => setShowPopup(false)}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Thanh toán</h2>
              <form onSubmit={handlePaymentSubmit}>
                <label>
                  Tên chủ thẻ
                  <input type="text" placeholder="Nguyễn Văn A" required />
                </label>
                <label>
                  Số thẻ
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </label>
                <div className="row">
                  <label>
                    Ngày hết hạn
                    <input type="text" placeholder="MM/YY" required />
                  </label>
                  <label>
                    CVV
                    <input type="text" placeholder="123" required />
                  </label>
                </div>
                <div className="payment-buttons">
                  <button
                    type="submit"
                    className="btn-pay"
                    onClick={handlePayAll}
                  >
                    Thanh toán
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowPopup(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CSS */}
        <style jsx>{`
          .back-button {
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .back-button:hover {
            background-color: #0056b3;
          }

          .payment-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(6px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }

          .payment-modal {
            background: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            width: 420px;
            max-width: 90vw;
            animation: fadeInUp 0.4s ease forwards;
          }

          .payment-modal h2 {
            margin-bottom: 24px;
            font-size: 24px;
            text-align: center;
            color: #333;
          }

          form label {
            display: block;
            margin-bottom: 16px;
            font-weight: 600;
            color: #444;
          }

          form input {
            width: calc(100% - 20px);
            padding: 10px;
            margin-top: 6px;
            border: 1.5px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
          }

          form input:focus {
            border-color: #007bff;
            outline: none;
          }

          .row {
            display: flex;
            gap: 12px;
          }

          .row label {
            flex: 1;
          }

          .payment-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }

          .btn-pay {
            flex: 1;
            margin-right: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          }

          .btn-pay:hover {
            background-color: #218838;
          }

          .btn-cancel {
            flex: 1;
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          }

          .btn-cancel:hover {
            background-color: #c82333;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <h2>Lịch sử giao dịch</h2>
      </div>
      {history?.bookings?.map((txn) => (
        <div
          key={txn._id}
          className="transaction-card"
          onClick={() => setSelectedTransaction(txn)}
        >
          <div className="transaction-top">
            <div className="icon">✈️</div>
            <div className="info">
              <div className="type">Đặt hàng vé máy bay</div>
              <div className="location">
                ({txn.flight.iata_from}){"->"}({txn.flight.iata_to})
              </div>
              <div className="date">{txn.date}</div>
            </div>
            <div
              className={`amount ${
                txn.flight.price < 0 ? "negative" : "positive"
              }`}
            >
              {txn?.flight?.price?.toLocaleString("vi-VN")} đ
            </div>
          </div>

          <div className="transaction-bottom">
            <div className="code">Mã: {txn.flight.flight_number}</div>
            <div className="method">Phương thức: bên thứ ba</div>
            <div
              className={`status ${
                txn.payment_status == "paid"
                  ? "success"
                  : txn.payment_status == "cancelled"
                  ? "refund"
                  : "pending"
              }`}
            >
              {txn.payment_status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
