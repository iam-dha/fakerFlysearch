import React, { useState } from "react";
import api from "../../services/api.admin";

const RoomManagement = ({ hotel, onClose }) => {
  const [rooms, setRooms] = useState(hotel.rooms || []);
  const [notification, setNotification] = useState("");
  const [isAddRoom, setIsAddRoom] = useState(false);
  const [isEditRoom, setIsEditRoom] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    type: "",
    price: "",
    available_rooms: "",
    max_guests: "",
    description: "",
    thumbnail: null,
    images: [],
    previewThumbnail: "",
    previewImages: [],
  });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2000);
  };

  const resetRoomForm = () => {
    setRoomForm({
      type: "",
      price: "",
      available_rooms: "",
      max_guests: "",
      description: "",
      thumbnail: null,
      images: [],
      previewThumbnail: "",
      previewImages: [],
    });
  };

  const handleRoomInput = (e) => {
    const { name, value } = e.target;
    setRoomForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomForm((prev) => ({
        ...prev,
        thumbnail: file,
        previewThumbnail: URL.createObjectURL(file),
      }));
    }
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomForm((prev) => ({
      ...prev,
      images: files,
      previewImages:
        files.length > 0
          ? files.map((file) => URL.createObjectURL(file))
          : prev.previewImages,
    }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("type", roomForm.type);
      formData.append("price", roomForm.price);
      formData.append("available_rooms", roomForm.available_rooms);
      formData.append("max_guests", roomForm.max_guests);
      formData.append("description", roomForm.description);
      if (roomForm.thumbnail) {
        formData.append("thumbnail", roomForm.thumbnail);
      }
      roomForm.images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await api.post(`/admin/hotels/${hotel._id}/rooms`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRooms((prev) => [...prev, res.data.data]);
      setIsAddRoom(false);
      resetRoomForm();
      showNotification("Thêm phòng thành công!");
    } catch (err) {
      showNotification("Lỗi khi thêm phòng!");
    }
  };

  const handleDeleteRoom = async (Id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá phòng này?")) return;
    try {
      await api.delete(`/admin/hotels/rooms/${Id}`);
      setRooms((prev) => prev.filter((room) => room._id !== Id));
      showNotification("Xoá phòng thành công!");
    } catch {
      showNotification("Lỗi khi xoá phòng!");
    }
  };

  const handleEditRoom = (room) => {
    setIsEditRoom(true);
    setEditRoomId(room._id);
    setRoomForm({
      type: room.type || "",
      price: room.price || "",
      available_rooms: room.available_rooms || "",
      max_guests: room.max_guests || "",
      description: room.description || "",
      thumbnail: null,
      images: [],
      previewThumbnail: room.thumbnail || "",
      previewImages: room.images || [],
    });
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("type", roomForm.type);
      formData.append("price", roomForm.price);
      formData.append("available_rooms", roomForm.available_rooms);
      formData.append("max_guests", roomForm.max_guests);
      formData.append("description", roomForm.description);
      if (roomForm.thumbnail) {
        formData.append("thumbnail", roomForm.thumbnail);
      }
      roomForm.images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await api.patch(
        `/admin/hotels/rooms/${editRoomId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setRooms((prev) =>
        prev.map((room) => (room._id === editRoomId ? res.data.data : room))
      );
      setIsEditRoom(false);
      setEditRoomId(null);
      resetRoomForm();
      showNotification("Cập nhật phòng thành công!");
    } catch (err) {
      showNotification("Lỗi khi cập nhật phòng!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 800 }}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3>Quản lý phòng - {hotel?.name}</h3>
        {notification && <div className="notification">{notification}</div>}
        <button
          className="add-btn"
          onClick={() => {
            setIsAddRoom(true);
            setIsEditRoom(false);
            resetRoomForm();
          }}
        >
          Thêm phòng mới
        </button>
        {(isAddRoom || isEditRoom) && (
          <form
            onSubmit={isEditRoom ? handleUpdateRoom : handleAddRoom}
            style={{ margin: "16px 0" }}
          >
            <label>Loại phòng:</label>
            <select
              name="type"
              value={roomForm.type}
              onChange={handleRoomInput}
              required
            >
              <option value="">--Chọn loại phòng--</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
            </select>
            <label>Giá:</label>
            <input
              type="number"
              name="price"
              value={roomForm.price}
              onChange={handleRoomInput}
              required
            />
            <label>Số phòng còn:</label>
            <input
              type="number"
              name="available_rooms"
              value={roomForm.available_rooms}
              onChange={handleRoomInput}
              required
            />
            <label>Số khách tối đa:</label>
            <input
              type="number"
              name="max_guests"
              value={roomForm.max_guests}
              onChange={handleRoomInput}
              required
            />
            <label>Mô tả:</label>
            <textarea
              name="description"
              value={roomForm.description}
              onChange={handleRoomInput}
            />
            <label>Ảnh đại diện:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            {roomForm.previewThumbnail && (
              <img
                src={roomForm.previewThumbnail}
                alt="thumb"
                style={{ width: 80, height: 60, objectFit: "cover", margin: 8 }}
              />
            )}
            <label>Ảnh khác:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
            />
            <div style={{ margin: "8px 0", display: "flex", flexWrap: "wrap" }}>
              {roomForm.previewImages &&
                roomForm.previewImages.length > 0 &&
                roomForm.previewImages.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="photo"
                    style={{
                      width: 40,
                      height: 30,
                      objectFit: "cover",
                      marginRight: 4,
                      marginBottom: 4,
                    }}
                  />
                ))}
            </div>
            <button type="submit" className="submit-btn">
              {isEditRoom ? "Cập nhật phòng" : "Thêm phòng"}
            </button>
          </form>
        )}
        <table>
          <thead>
            <tr>
              <th>Loại phòng</th>
              <th>Giá</th>
              <th>Ảnh đại diện</th>
              <th>Số phòng còn</th>
              <th>Số khách tối đa</th>
              <th>Mô tả</th>
              <th>Ảnh khác</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  Khách sạn chưa có phòng nào.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.type}</td>
                  <td>{room.price}</td>
                  <td>
                    {room.thumbnail ? (
                      <img
                        src={room.thumbnail}
                        alt="room"
                        style={{ width: 80, height: 60, objectFit: "cover" }}
                      />
                    ) : (
                      <span>Chưa có</span>
                    )}
                  </td>
                  <td>{room.available_rooms}</td>
                  <td>{room.max_guests}</td>
                  <td>{room.description}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {room.images && room.images.length > 0
                        ? room.images.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt="photo"
                              style={{
                                width: 40,
                                height: 30,
                                objectFit: "cover",
                                marginRight: 4,
                                marginBottom: 4,
                              }}
                            />
                          ))
                        : "Không có"}
                    </div>
                  </td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditRoom(room)}
                    >
                      Sửa
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleDeleteRoom(room._id)}
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

export default RoomManagement;
