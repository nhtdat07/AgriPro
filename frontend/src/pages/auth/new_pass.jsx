import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";

import background from "../../assets/images/background.png";
import exitIcon from "../../assets/images/exit.svg";

const NewPass = () => {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const email = sessionStorage.getItem("email");
  const resetToken = sessionStorage.getItem("resetToken");

  useEffect(() => {
    if (!email || !resetToken) {
      alert("Thiếu thông tin xác thực. Vui lòng nhập lại email!");
      navigate("/forgot-password");
    }
  }, [email, resetToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.patch("/auth/reset-password", {
        email,
        resetToken,
        newPassword: data.password,
      });
      if (response.status === 200) {
        alert("Cập nhật mật khẩu thành công!");

        sessionStorage.removeItem("email");
        sessionStorage.removeItem("resetToken");

        navigate("/login");
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error;

      if (status === 400 && message?.startsWith("Weak password:")) {
        alert("Mật khẩu ít nhất 8 ký tự, bao gồm cả chữ hoa, chữ thường, số và ký tự đặc biệt!");
      } else {
        alert("Đã xảy ra lỗi. Bạn vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
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
        <h3 className="text-sm font-medium text-center">
          Vui lòng đặt lại mật khẩu của bạn!
        </h3>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Mật khẩu"
                required
                className="w-full px-10 py-3 border rounded-lg bg-white bg-opacity-75 text-black"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={(e) =>
                  setData({ ...data, confirmPassword: e.target.value })
                }
                placeholder="Nhập lại mật khẩu"
                required
                className="w-full px-10 py-3 border rounded-lg bg-white bg-opacity-75 text-black"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-black"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-2 text-white rounded-lg focus:outline-none ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2c9e4b] hover:bg-[#0c5c30]"
            }`}
          >
            {loading ? "Đang cập nhật..." : "XÁC NHẬN"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          © Bản quyền thuộc về AgriPro, {currentYear}.
        </p>
      </div>
    </div>
  );
};

export default NewPass;
