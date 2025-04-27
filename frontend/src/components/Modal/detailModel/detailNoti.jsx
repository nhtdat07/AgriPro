import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance.js";

function DetailNoti({ data }) {
  const [notificationDetails, setNotificationDetails] = useState({
    category: "",
    timestamp: "",
    content: "",
  });

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        const response = await axiosInstance.patch(`/notifications/${data.id}`);
        const notification = response.data.data;

        setNotificationDetails({
          category: notification.category,
          timestamp: notification.timestamp,
          content: notification.content,
        });
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 400) {
            alert("Cập nhật thông tin thất bại!");
          } else if (status === 401) {
            alert("Bạn không có quyền truy cập vào trang này!");
          } else if (status === 500) {
            alert("Vui lòng tải lại trang!");
          }
        }
      }
    };

    fetchNotificationDetails();
  }, [data.id]);

  const contentLines = notificationDetails.content.split("\n");

  return (
    <div className="mt-2 p-2 bg-[#efffef] rounded border text-sm">
      {contentLines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

export default DetailNoti;
