import React, { useState } from "react";
import "./sidebar.css";
import SidebarLogo from "./SidebarLogo.jsx";
import MenuList from "./MenuList.jsx";
import { useNavigate } from "react-router-dom";

function Sidebar({ ...props }) {
  const navigate = useNavigate();
  const [menus] = useState(props.menu);

  const logout = () => {
    navigate("/");
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`sidebarWrapper md:translate-x-0 -translate-x-full md:z-0 z-50 no-scrollbar ${props.className}`}
      >
        <div className="md:w-64 border-r-2 border-gray-100 h-full flex-col flex flex-shrink-0">
          <SidebarLogo toggle={props.toggle} />
          <MenuList menus={menus} toggle={props.toggle} user={props.user} />

          <div className="pt-2 border-t border-gray-300">
            <div className="py-2 px-2">
              <button className="py-2 px-2 w-full text-[#c91e1e] justify-end font-medium" onClick={() => logout()}>ĐĂNG XUẤT</button>
            </div>
          </div>
        </div>
      </aside>

      {props.className === "mobile" && (
        <div
          id="overlaySidebar"
          onClick={props.toggle}
          className="hidden absolute w-full h-screen bg-black z-10 inset-0 opacity-60"
        >
          <div></div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
