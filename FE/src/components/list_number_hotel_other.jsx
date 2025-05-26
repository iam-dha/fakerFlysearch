import styles from "../styles/list_number_hotel_other.module.css";
import { useState } from "react";
import {
  data_RoomView,
  data_amenities_room,
  data_RoomCategory,
} from "../utils/data";
import { useNavigate } from "react-router-dom";
export default function ListNumberHotelOther({ sortedRooms, hotel }) {
  const [expandedRooms, setExpandedRooms] = useState({});
  const totalAvailableRooms = hotel?.rooms?.reduce(
    (sum, room) => sum + (room.available_rooms || 0),
    0
  );
  const navigate = useNavigate();
  const handleBooking = (roomId) => {
    navigate(`/hotel/payment`, {
      state: {
        hotelId: hotel._id,
        roomId: roomId, // hoặc item._id nếu đang map list
        // thêm thông tin khác nếu cần
      },
    });
  };
  // Hàm toggle để thay đổi trạng thái hiển thị
  const toggleExpanded = (roomId) => {
    setExpandedRooms((prevState) => ({
      ...prevState,
      [roomId]: !prevState[roomId],
    }));
  };
  console.log(hotel);
  return (
    <>
      <div className={styles.container}>
        {/* Số phòng và số kiểu phòng */}
        <div className={styles.container_Number_room}>
          <p className={styles.textRoom}>Phòng</p>
          <p className={styles.textTotalTypRoom}>
            Có tổng cộng {totalAvailableRooms || 0} loại phòng và có{" "}
            {hotel?.rooms?.length || 0} lựa chọn
          </p>
        </div>
        {/* list phòng */}
        <div className={styles.container_list_room_hotel}>
          {Array.isArray(hotel?.rooms) ? (
            hotel?.rooms?.map((item, index) => {
              // Kết hợp tất cả các tiện nghi trong một mảng
              const allAmenities = [
                ...(item?.room?.bathroomAmenities || []),
                ...(item?.room?.bedroomAmenities || []),
                ...(item?.room?.diningAmenities || []),
                ...(item?.room?.minibarAmenities || []),
                ...(item?.room?.otherAmenities || []),
              ];

              // Giới hạn chỉ hiển thị 7 tiện nghi
              const limitedAmenities = allAmenities.slice(0, 7);
              const remainingAmenities = allAmenities.length - 7;
              const isExpanded = expandedRooms[item?.room?.id] || false;
              const roomCategory = data_RoomCategory.find(
                (category) => category.id == Number(item?.room?.roomType)
              );
              return (
                <div
                  key={index}
                  className={`${styles.container_room_hotel} ${
                    index % 2 !== 0
                      ? styles.container_room_hotel_marginLeft50
                      : ""
                  }`}
                >
                  <div
                    className={`${styles.container_img_typehotel} ${
                      index % 2 !== 0
                        ? styles.container_img_typehotel_reverse
                        : ""
                    }`}
                  >
                    <div className={styles.container_img_number_room}>
                      <img
                        src={item?.thumbnail}
                        alt="img"
                        className={styles.imgItemHotel}
                      />
                      <div className={styles.container_number_room}>
                        <p className={styles.text_number_room_available}>
                          Còn {item?.available_rooms || 0} phòng trống
                        </p>
                      </div>
                    </div>
                    {/* Kiểu phòng và chi tiết */}
                    <div className={styles.container_detail_Hotel}>
                      <div className={styles.container_detail_item}>
                        <p className={styles.text_typeroom}>
                          {item?.type || "Chưa có tên"}
                        </p>
                        {/* Giá */}
                        <div className={styles.container_price_hotel}>
                          <p className={styles.textFrom}>Từ</p>
                          <p className={styles.textPrice}>
                            {item?.price?.toLocaleString("vi-VN")} đ / đêm
                          </p>
                        </div>
                        {/* Sức chứa tối đa */}
                        <div className={styles.container_contain_max_person}>
                          <p className={styles.textNormal}>Sức chứa tối đa:</p>
                          <p className={styles.textMaxPerson}>
                            {item?.max_guests || 0} người
                          </p>
                          <img
                            src="/images/hotel/info-circle.svg"
                            alt="info icon"
                            className={styles.img_icon}
                          />
                        </div>
                        {/* Diện tích */}
                        <div className={styles.container_contain_max_person}>
                          <p className={styles.textNormal}>Diện tích:</p>
                          <p className={styles.textMaxPerson}>
                            {item?.room?.area || 30} m2
                          </p>
                        </div>
                        {/* Hướng */}
                        <div className={styles.container_contain_max_person}>
                          <p className={styles.textNormal}>Hướng:</p>
                          <p className={styles.textMaxPerson}>Hướng Nam</p>
                        </div>
                        {/* Tiện ích phòng */}
                        <div className={styles.container_utility_hotel}>
                          {(isExpanded ? allAmenities : limitedAmenities).map(
                            (amenityId, idx) => {
                              const amenityName =
                                data_amenities_room.find(
                                  (item) => item.id === 1
                                )?.data[amenityId] || "Không xác định";
                              return (
                                <div
                                  key={idx}
                                  className={styles.item_utility_hotel}
                                >
                                  <p className={styles.textItemUtility}>
                                    {amenityName}
                                  </p>
                                </div>
                              );
                            }
                          )}
                          {remainingAmenities > 0 && !isExpanded && (
                            <div className={styles.item_utility_hotel}>
                              <p className={styles.textItemUtility}>
                                + {remainingAmenities} tiện nghi
                              </p>
                            </div>
                          )}
                        </div>
                        <div
                          className={styles.showDetailHotel}
                          onClick={() => toggleExpanded(item?.room?.id)}
                        >
                          <p className={styles.textshowDetailHotel}>
                            {isExpanded ? "Ẩn bớt" : "Hiển thị thêm"}
                          </p>
                        </div>
                        <div className={styles.btnDatNgayWrapper}>
                          <button
                            className={styles.btnDatNgay}
                            onClick={() => handleBooking(item?._id)}
                          >
                            Đặt ngay
                          </button>
                        </div>
                      </div>
                      <div className={styles.container_type_hotel_768}>
                        <div className={styles.container_text_type_hotel}>
                          <p className={styles.verticalText}>Lexure</p>
                          <p className={styles.textNumbercount}>01</p>
                        </div>
                      </div>
                    </div>
                    {/* Kiểu phòng */}
                    <div className={styles.container_type_hotel}>
                      <div className={styles.container_text_type_hotel}>
                        <p className={styles.verticalText}>Hibonha</p>
                        <p className={styles.textNumbercount}>02</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
