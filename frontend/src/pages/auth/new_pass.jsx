import { faEnvelope, faLock, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import background from "../../assets/images/background.png";
import exitIcon from "../../assets/images/exit.svg";

const NewPass = () => {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.password === data.confirmPassword) {
      alert("Cập nhật thành công!");
      navigate("/login");
    } else {
      alert("Mật khẩu không khớp!");
    }
  };  

  const handleExit = () => {
    navigate("/");
  };

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      <img
        src={exitIcon}
        alt="Exit"
        className="absolute top-4 right-4 w-8 h-8 cursor-pointer"
        onClick={handleExit}
      />

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-semibold text-center">Đặt lại mật khẩu</h3>
        <h3 className="text-sm font-medium text-center">Vui lòng nhập đặt lại mật khẩu của bạn!</h3>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Mật khẩu"
                required
                className="w-full px-10 py-3 border rounded-lg bg-white bg-opacity-75 text-black"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu"
                required
                className="w-full px-10 py-3 border rounded-lg bg-white bg-opacity-75 text-black"
              />
            </div>
          </div>

          <button type="submit" className="w-full px-6 py-2 text-white bg-[#2c9e4b] hover:bg-[#0c5c30] rounded-lg focus:outline-none">XÁC NHẬN</button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          © Bản quyền thuộc về AgriPro, {currentYear}.
        </p>
      </div>
    </div>
  );
};

export default NewPass;
