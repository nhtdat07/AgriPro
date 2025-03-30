import React from "react";
import { useNavigate } from "react-router-dom";

import cards from "../../assets/images/cards.png";
import logo from "../../assets/images/trans_logo.png";
import banner from "../../assets/images/landing_banner.png";

function Landing() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-[#0c5c30] text-white flex justify-end items-center">
        <div className="flex justify-center">
            <button onClick={() => navigate("/login")} className="bg-[#0c5c30] hover:bg-[#2c9e4b] text-white px-4 py-4 inline-flex items-center">Đăng nhập</button>
            <button onClick={() => navigate("/register")} className="bg-[#0c5c30] hover:bg-[#2c9e4b] text-white px-4 py-4 inline-flex items-center">Đăng ký</button>
        </div>
      </header>

      <main className="bg-[#efffef] text-center px-4 md:px-16 py-12">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div>
              <img src={logo} alt="AgriPro logo" className="mr-4" />
              <h1 className="text-4xl font-bold text-black mb-4">Hãy đến với AgriPro!</h1>
              <p className="text-gray-600 text-lg mb-4">
                Chúng tôi cung cấp cho bạn một giải pháp quản lý đại lý vật tư nông nghiệp hiệu quả.
              </p>
            </div>
            <img src={cards} alt="Cards" className="w-full max-w-2xl" />
          </div>
        </div>
      </main>

      <footer>
        <div className="w-full mt-auto relative">
          <img src={banner} alt="Banner" className="w-full opacity-80" />
            <div className="absolute bottom-0 left-0 w-full text-center text-white text-sm p-2">
              © Bản quyền thuộc về AgriPro, {currentYear}.
            </div>
          </div>
      </footer>
    </div>
  );
}

export default Landing;