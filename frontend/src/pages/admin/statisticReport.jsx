import React, { useState } from "react";
import Header from "../../components/Navbar/header";
import Footer from "../../components/Navbar/footer";
import { useOutletContext } from "react-router-dom";

import BestSellTable from "../../components/Modal/tableModel/bestSellTable";
import TopCustomerTable from "../../components/Modal/tableModel/topCustomerTable";

import moneyIcon from "../../assets/images/money.svg";
import purchaseIcon from "../../assets/images/purchase_order.svg";
import salesIcon from "../../assets/images/sales_invoice.svg";
import searchIcon from "../../assets/images/search.svg";

function StatisticReport() {
  const [headerToggle] = useOutletContext();
  const [footerToggle] = useOutletContext();
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState('sale');

  const summaryData = [
    {
      title: "Lợi nhuận",
      dateRange: "15/10/2024 - 15/11/2024",
      value: "12.368.000",
      icon: moneyIcon
    },
    {
      title: "Nhập hàng",
      numPurchase: "4",
      value: "14.249.000",
      icon: purchaseIcon
    },
    {
      title: "Bán hàng",
      numSale: "52",
      value: "19.625.000",
      icon: salesIcon
    },
  ]; 

  const dataHeaderBestSell = 
  [ {key: "id", label: "STT"},
    {key: "name", label: "Tên sản phẩm"},
    {key: "quantity", label: <span>Số lượng<br />bán ra</span>}
  ];

  const dataHeaderTopCustomer = 
  [ {key: "id", label: "STT"},
    {key: "name", label: "Tên khách hàng"},
    {key: "value", label: <span>Tổng tiền<br />Mua hàng</span>}
  ];

  const dataBestSell = [
    {
      id: 1,
      name: "DELFIN 32WG - thuốc trừ sâu sinh học Mỹ - Gói 10gr",
      quantity: "22"
    },
    {
      id: 2,
      name: "Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC",
      quantity: "18"
    },
    {
      id: 3,
      name: "Thuốc trừ bệnh cây trồng COC85 - Gói 20 gram",
      quantity: "16"
    },
    {
      id: 4,
      name: "Thuốc trừ bọ trĩ - rầy trên cây trồng và hoa kiểng YAMIDA 100EC",
      quantity: "10"
    },
    {
      id: 5,
      name: "Thuốc trừ sâu sinh học Tasieu 1.9EC - Chai 100ml",
      quantity: "10"
    }
  ];

  const dataTopCustomer = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      value: "1.680.000"
    },
    {
      id: 2,
      name: "Hoàng Văn K",
      value: "1.400.000"
    },
    {
      id: 3,
      name: "Phạm Văn E",
      value: "1.360.000"
    },
    {
      id: 4,
      name: "Lê Thị C",
      value: "1.120.000"
    },
    {
      id: 5,
      name: "Trần Thị G",
      value: "950.000"
    }
  ];

  const handleDelete = () => { };

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Header toggle={headerToggle} />
    
        <div className="flex-grow">
          <h2 className="pt-4 pl-4 text-2xl font-bold mb-4">Quản lý bán hàng</h2>
    
          <div className="px-4">        
            <div className="flex items-center gap-4 mb-4">
              <input type="date" className="border px-2 py-1 rounded-lg min-w-[50px]" />
              <input type="date" className="border px-2 py-1 rounded-lg min-w-[50px]" />
              <button className="bg-[#2c9e4b] text-white px-4 py-2 rounded-lg min-w-[50px]">ÁP DỤNG</button>
              <button className="bg-[#2c9e4b] text-white px-4 py-2 rounded-lg ml-auto min-w-[50px]">XUẤT BÁO CÁO</button>
            </div>
    
            <div className="grid grid-cols-3 gap-4 mb-6">
              {summaryData.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md relative">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                    <>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 pt-2">
                          {item.title === "Nhập hàng" ? "Số đơn nhập hàng" : item.title === "Bán hàng" ? "Số hóa đơn bán hàng" : item.dateRange}
                        </p>
                        <p className="text-xl font-bold text-right">
                          {item.numPurchase || item.numSale}
                        </p>
                      </div>
    
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {item.title === "Lợi nhuận" ? "" : "Tổng số tiền"} 
                        </p>
                        <p className="text-2xl font-bold text-right break-all">{item.value}₫</p>
                      </div>
                    </>
                  <img src={item.icon} alt={item.title} className="w-10 ml-auto block" />
                </div>
              ))}
            </div>
    
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Sản phẩm bán chạy</h3>
              <div className="flex items-center mb-2">
                <div className="flex items-center border rounded-lg px-2 w-full">
                  <input type="text" placeholder="Tên sản phẩm" className="w-full p-2 outline-none"/>
                </div>
                <button className="ml-2 p-2">
                  <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                </button>
              </div>
              <BestSellTable
                loading={loading}
                dataHeader={dataHeaderBestSell}
                data={dataBestSell}
                handleDelete={handleDelete}
              />
              </div>
              
              <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Khách hàng mua nhiều</h3>
              <div className="flex items-center mb-2">
                <div className="flex items-center border rounded-lg px-2 w-full">
                  <input type="text" placeholder="Tên khách hàng" className="w-full p-2 outline-none"/>
                </div>
                <button className="ml-2 p-2">
                  <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                </button>
              </div>
              <TopCustomerTable
                loading={loading}
                dataHeader={dataHeaderTopCustomer}
                data={dataTopCustomer}
                handleDelete={handleDelete}
              />
              </div>
            </div>
          </div>
        </div>
    
        <Footer toggle={footerToggle} />
      </main>
    </>
  );
}  

export default StatisticReport;
