import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";

import ava from "../../assets/images/avatar_white.svg";

function Index({ toggle }) {
  const avatar =
    "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  return (
    <>
      <header className="">
        <div className="shadow-sm">
          <div className="relative bg-[#1f472a] flex w-full items-center px-5 py-2.5">
            <div className="flex-1">
              <p className="block md:hidden cursor-pointer text-white">
                <FontAwesomeIcon icon={faBars} onClick={toggle} />
              </p>
            </div>
            <div className="">
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

export default Index;
