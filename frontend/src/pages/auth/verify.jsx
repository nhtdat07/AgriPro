import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import background from "../../assets/images/background.png";
import exitIcon from "../../assets/images/exit.svg";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.join("").length === 6) {
      navigate("/new-password");
    } else {
      alert("Vui lòng nhập đủ 6 số OTP");
    }
  };

  const handleExit = () => {
    navigate("/");
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
        <h3 className="text-2xl font-semibold text-center">Nhập mã OTP</h3>
        <h3 className="text-sm font-medium text-center">Mã OTP đã được gửi đến email của bạn!</h3>
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

          <button type="submit" className="w-full px-6 py-2 text-white bg-[#2c9e4b] hover:bg-[#0c5c30] rounded-lg focus:outline-none">XÁC NHẬN</button>
        </form>

        <div className="flex justify-center mt-4 text-sm text-gray-600">
          <button onClick={() => alert("Mã OTP đã được gửi lại!")} className="hover:underline">
            Bạn chưa nhận được mã? Gửi lại
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
