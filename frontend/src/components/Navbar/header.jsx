import { useState, useEffect } from "react";
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotiTable from "../Modal/tableModel/notiTable";
import ava from "../../assets/images/avatar_white.svg";
import axiosInstance from "../../utils/axiosInstance";

function Header({ toggle, refreshTrigger }) {
  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/notifications");
        const fetchedNotifications = response.data.data.notifications.map((noti) => ({
          id: noti.notificationId,
          message: noti.category,
          time: noti.timestamp,
          isRead: noti.isRead,
        }));
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (refreshTrigger !== null) {
      fetchNotifications();
    }
  }, [refreshTrigger]);

  const unreadCount = notifications.filter((noti) => !noti.isRead).length;

  const handleToggleNoti = () => {
    setShowNoti(!showNoti);
  };

  return (
    <header>
      <div className="shadow-sm">
        <div className="relative bg-[#1f472a] flex w-full items-center px-5 py-2.5">
          <div className="flex-1">
            <p className="block md:hidden cursor-pointer text-white">
              <FontAwesomeIcon icon={faBars} onClick={toggle} />
            </p>
          </div>
          <div className="relative">
            <ul className="flex flex-row gap-4 items-center">
              <li className="relative">
                <span
                  className="h-9 w-9 cursor-pointer text-white relative"
                  onClick={handleToggleNoti}
                >
                  <FontAwesomeIcon icon={faBell} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                      {unreadCount}
                    </span>
                  )}
                </span>
                {showNoti && (
                  <div className="absolute top-10 right-0 z-50">
                    <NotiTable
                      notifications={notifications}
                      setNotifications={setNotifications}
                    />
                  </div>
                )}
              </li>
              <li>
                <img
                  className="rounded-full h-9 w-9 border cursor-pointer"
                  src={ava}
                  alt="Avatar"
                />
              </li>
              <li>
                <span className="text-white font-light">Tài khoản</span>
                <br />
                <span className="text-white font-medium">
                  Phạm Huỳnh Quốc Thạnh
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
