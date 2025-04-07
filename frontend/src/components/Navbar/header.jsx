import { useState } from "react";
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotiTable from "../Modal/tableModel/notiTable";

import ava from "../../assets/images/avatar_white.svg";

function Header({ toggle }) {
  const [showNoti, setShowNoti] = useState(false);

  const handleToggleNoti = () => {
    setShowNoti(!showNoti);
  };

  return (
    <>
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
                    className="h-9 w-9 cursor-pointer text-white"
                    onClick={handleToggleNoti}
                  >
                    <FontAwesomeIcon icon={faBell} />
                  </span>
                  {showNoti && (
                    <div className="absolute top-10 right-0 z-50">
                      <NotiTable />
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
    </>
  );
}

export default Header;
