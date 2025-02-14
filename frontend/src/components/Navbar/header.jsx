import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";

import ava from "../../assets/images/avatar_white.svg";

function Header({ toggle }) {
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
            <div>
              <ul className="flex flex-row gap-4 items-center">
                <li>
                  <span className="h-9 w-9 cursor-pointer text-white">
                    <FontAwesomeIcon icon={faBell} />
                  </span>
                </li>
                <li>
                  <span>
                    <img
                      className="rounded-full h-9 w-9 border cursor-pointer"
                      src={ava}
                      alt="Avatar"
                    />
                  </span>
                </li>
                <li>
                  <span className="text-white font-light">
                    Tài khoản
                  </span>
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
