import React, { useRef, useState } from "react";
import "./sidebar.css";
import SidebarLogo from "./SidebarLogo.jsx";
import MenuList from "./MenuList.jsx";
import { useNavigate } from "react-router-dom";

function Sidebar({ ...props }) {
  const navigate = useNavigate();
  const [menus, setMenus] = useState(props.menu);
  const [scButton, setScButton] = useState(false);

  const handleChange = (e) => {
    if (e.target.value) {
      setScButton(true);
      setMenus(
        menus.filter((el) => {
          return el.label.toLowerCase().includes(e.target.value.toLowerCase());
        })
      );
    } else {
      setScButton(false);
      setMenus(props.menu);
    }
  };

  const logout = () => {
    navigate("/");
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`sidebarWrapper md:translate-x-0 -translate-x-full md:z-0 z-50 no-scrollbar ${props.className}`}
      >
        {/* Sidebar wrapper */}
        <div className="md:w-64 border-r-2 border-gray-100 h-full flex-col flex flex-shrink-0">
          {/* Logo */}
          <SidebarLogo toggle={props.toggle} />

          {/* Menu */}
          <MenuList menus={menus} toggle={props.toggle} user={props.user} />

          {/* Profile */}
          <div className="pt-2 border-t border-gray-300">
            <div className="py-2 px-2">
              {/* Logout Button */}
              <button
                className="py-2 px-2 w-full text-[#c91e1e] justify-end font-medium"
                onClick={() => logout()}
              >
                ĐĂNG XUẤT
              </button>
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
