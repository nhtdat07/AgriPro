import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";

import background from "../../assets/images/background.png";
import exitIcon from "../../assets/images/exit.svg";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      if (response.status === 200) {
        navigate(`/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        alert("Vui lòng nhập đầy đủ thông tin!");
      } else if (status === 404) {
        alert("Email này chưa đăng ký tài khoản!");
      } else {
        alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      <img
        src={exitIcon}
        alt="Exit"
        className="absolute top-4 right-4 w-8 h-8 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-semibold text-center">Quên mật khẩu</h3>
        <h3 className="text-sm font-medium text-center">Vui lòng nhập email của bạn!</h3>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-10 py-3 border rounded-lg bg-white bg-opacity-75 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-2 text-white rounded-lg focus:outline-none ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2c9e4b] hover:bg-[#0c5c30]"
            }`}
          >
            {loading ? "Đang gửi..." : "XÁC NHẬN"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          <Link to="/login" className="hover:underline">Bạn muốn đăng nhập lại? Đăng nhập</Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © Bản quyền thuộc về AgriPro, {currentYear}.
        </p>
      </div>
    </div>
  );
};

export default ForgotPass;
