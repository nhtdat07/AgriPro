import { useState } from "react";
import DetailNoti from "../detailModel/detailNoti";
import axiosInstance from "../../../utils/axiosInstance.js";

function NotiTable({ notifications, setNotifications }) {
  const [activeId, setActiveId] = useState(null);

  const handleToggleDetail = async (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));

    if (id && !notifications.find((noti) => noti.id === id)?.isRead) {
      try {
        await axiosInstance.patch(`/notifications/${id}`, {
          isRead: true,
        });

        setNotifications((prevNotifications) =>
          prevNotifications.map((noti) =>
            noti.id === id ? { ...noti, isRead: true } : noti
          )
        );
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 401) {
            alert("Bạn không có quyền truy cập vào trang này!");
          } else if (status === 404) {
            alert("Thông báo này hiện không tồn tại!");
          } else if (status === 500) {
            alert("Vui lòng tải lại trang!");
          }
        }
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-96 max-h-96 overflow-y-auto border border-gray-200">
      <div className="p-4 font-semibold border-b">Các thông báo</div>
      <ul>
        {notifications.map((noti) => (
          <li
            key={noti.id}
            onClick={() => handleToggleDetail(noti.id)}
            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer border-b ${
              noti.isRead ? "" : "bg-[#efffef]"
            }`}
          >
            <div>
              <p className="font-medium text-sm">{noti.message}</p>
              <p className="text-xs text-right text-gray-500">{noti.time}</p>
              {activeId === noti.id && (
                <DetailNoti data={noti} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotiTable;
