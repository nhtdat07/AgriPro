import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";

import background from "../../assets/images/background.png";
import exitIcon from "../../assets/images/exit.svg";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      alert("Vui lòng nhập đủ 6 số OTP!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        email,
        inputOtp: otpCode,
      });

      if (response.status === 200) {
        const { resetToken } = response.data.data;

        sessionStorage.setItem("resetToken", resetToken);
        sessionStorage.setItem("email", email);

        navigate("/new-password");
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error;

      if (status === 400 && message === "Incorrect OTP") {
        alert("Mã OTP không đúng. Vui lòng thử lại!");
      } else {
        alert("Đã xảy ra lỗi. Bạn vui lòng nhập lại email!");
        navigate("/forgot-password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      alert("Không tìm thấy email. Vui lòng quay lại nhập email!");
      navigate("/forgot-password");
      return;
    }

    setResending(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      if (response.status === 200) {
        alert("Mã OTP đã được gửi lại!");
      }
    } catch (error) {
      alert("Gửi lại OTP thất bại. Vui lòng thử lại sau!");
    } finally {
      setResending(false);
    }
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
        onClick={() => navigate("/")}
      />

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-semibold text-center">Nhập mã OTP</h3>
        <h3 className="text-sm font-medium text-center">
          Mã OTP đã được gửi đến email của bạn!
        </h3>
        <form onSubmit={handleSubmit} className="p-4 text-center">
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                maxLength="1"
                className="w-12 h-12 text-center text-xl border rounded-lg bg-white bg-opacity-75 text-black"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-2 text-white rounded-lg focus:outline-none ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2c9e4b] hover:bg-[#0c5c30]"
            }`}
          >
            {loading ? "Đang xác nhận..." : "XÁC NHẬN"}
          </button>
        </form>

        <div className="flex justify-center mt-4 text-sm text-gray-600">
          <button
            onClick={handleResendOTP}
            disabled={resending}
            className="hover:underline"
          >
            {resending ? "Đang gửi lại..." : "Bạn chưa nhận được mã? Gửi lại"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © Bản quyền thuộc về AgriPro, {currentYear}.
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
