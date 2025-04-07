import { useState } from "react";
import DetailNoti from "../detailModel/detailNoti";

const notifications = [
  {
    id: 1,
    message: "Bạn có một sản phẩm sắp hết hạn sử dụng!",
    time: "00:05 16/11/2024",
    detail: {
      info1: "Thuốc trừ sâu và đặc trị bọ trị RADIANT 60 SC - Gói 15 ml",
      info2: 10,
      info3: "23/11/2024",
    },
  },
  {
    id: 2,
    message: "Bạn đã tạo một hóa đơn thành công!",
    time: "10:28 15/11/2024",
    detail: {
      info1: "Thuốc trừ sâu và đặc trị bọ trị RADIANT 60 SC - Gói 15 ml",
      info2: 10,
    },
  },
  {
    id: 3,
    message: "Bạn đã tạo một hóa đơn nhập hàng thành công!",
    time: "07:35 15/11/2024",
    detail: {
      info1: "Thuốc trừ sâu và đặc trị bọ trị RADIANT 60 SC - Gói 15 ml",
      info2: 10,
    },
  },
];

function NotiTable() {
  const [activeId, setActiveId] = useState(null);

  const handleToggleDetail = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-96 max-h-96 overflow-y-auto border border-gray-200">
      <div className="p-4 font-semibold border-b">Các thông báo</div>
      <ul>
        {notifications.map((noti) => (
          <li
            key={noti.id}
            onClick={() => handleToggleDetail(noti.id)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
          >
            <div>
              <p className="font-medium text-sm">{noti.message}</p>
              <p className="text-xs text-gray-500">{noti.time}</p>
              {activeId === noti.id && noti.detail && (
                <DetailNoti data={noti.detail} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotiTable;
