import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";

import block1 from "../../assets/images/block1.png";
import block2 from "../../assets/images/block2.png";
import block3 from "../../assets/images/block3.png";
import banner from "../../assets/images/banner.png";

function Homepage() {
  const [sidebarToggle] = useOutletContext();
  const navigate = useNavigate();
  
  const data = {
    name: "Thạnh",
  };

  const blockContents = [
    {
      image: block1,
      title: "Quản lý kho và việc nhập hàng của bạn",
      link: "/inventoryPurchase",
    },
    {
      image: block2,
      title: "Quản lý việc bán hàng của bạn",
      link: "/sales",
    },
    {
      image: block3,
      title: "Thống kê kinh doanh và báo cáo doanh số",
      link: "/statisticReport",
    },
  ];

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Navbar toggle={sidebarToggle} />

        <h2 className="pt-4 pl-4 text-2xl font-bold">Chào {data.name}!</h2>
        <p className="pl-4 text-xl font-regular">Chúc bạn một ngày tốt lành!</p>

        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 flex-grow">
          {blockContents.map((block, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden relative h-64">
              <img src={block.image} alt={block.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute bottom-0 bg-black bg-opacity-50 w-full text-white text-center p-4">
                <p>{block.title}</p>
                <button 
                  onClick={() => navigate(block.link)}
                  className="mt-2 bg-[#2c9e4b] px-8 py-2 rounded text-white font-semibold"
                >
                  XEM NGAY
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full mt-auto">
          <img src={banner} alt="Banner" className="w-full" />
        </div>
      </main>
    </>
  );
}

export default Homepage;
