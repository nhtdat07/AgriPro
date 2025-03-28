import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import background from '../../../assets/images/background.png';

const LoginIndex = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = data;
    if (email === "admin@gmail.com" && password === "123") {
      navigate("/homepage");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <h3 className="text-2xl font-semibold text-center">Đăng nhập</h3>
        <h3 className="text-sm font-medium text-center">Chào mừng bạn đã quay trở lại!</h3>
        <form onSubmit={handleSubmit} className="p-2">
          <div className="mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="Email"
                required
                className="w-full px-10 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Mật khẩu"
                required
                className="w-full px-10 py-2 border rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 text-white bg-[#2c9e4b] hover:bg-[#0c5c30] rounded-lg focus:outline-none"
          >
            XÁC NHẬN
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <Link to="/register" className="hover:underline">Bạn chưa có tài khoản? Đăng ký</Link>
          <Link to="/forgot-password" className="hover:underline">Quên mật khẩu</Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © Bản quyền thuộc về AgriPro, {currentYear}.
        </p>
      </div>
    </div>
  );
};

export default LoginIndex;
