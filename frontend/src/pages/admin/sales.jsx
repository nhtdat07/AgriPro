import React, { useState } from "react";
import Header from "../../components/Navbar/header";
import Footer from "../../components/Navbar/footer";
import { useOutletContext } from "react-router-dom";

import InvoiceTable from "../../components/Modal/tableModel/invoiceTable";
import CustomerTable from "../../components/Modal/tableModel/customerTable";
import AddInvoice from "../../components/Modal/addModel/addInvoice";
import AddCustomer from "../../components/Modal/addModel/addCustomer";

import searchIcon from "../../assets/images/search.svg";

function Sales() {
  const [headerToggle] = useOutletContext();
  const [footerToggle] = useOutletContext();
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState('sale');

  const dataHeaderInvoice = 
  [ {key: "id", label: "STT"},
    {key: "code", label: "Mã số"},
    {key: "timestamp", label: "Thời gian bán hàng"},
    {key: "customer", label: "Khách hàng"},
    {key: "action", label: ""},
  ];

  const dataHeaderCustomer = 
  [ {key: "id", label: "STT"},
    {key: "name", label: "Tên khách hàng"},
    {key: "address", label: "Địa chỉ"},
    {key: "phone", label: "Số điện thoại"},
    {key: "email", label: "Email"},
    {key: "action", label: ""},
  ];

  const dataInvoice = [
    {
      id: 1,
      code: "BH0000000345",
      timestamp: "10:28 15/11/2024",
      customer: "Nguyễn Văn A"
    },
    {
      id: 2,
      code: "BH0000000344",
      timestamp: "08:08 15/11/2024",
      customer: "Trần Văn B"
    }
  ];

  const dataCustomer = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      address: "879, Mỹ Phong, TP. Mỹ Tho, T. Tiền Giang",
      phone: "0977868686",
      email: "nguyenvana@gmail.com"
    },
    {
      id: 2,
      name: "Trần Văn B",
      address: "289, Thanh Bình, H. Chợ Gạo, T. Tiền Giang",
      phone: "0355123456",
      email: ""
    }
  ];

  const handleDelete = () => { };

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Header toggle={headerToggle} />

        <div className="flex-grow">
          <h2 className="pt-4 pl-4 text-2xl font-bold mb-4">Quản lý bán hàng</h2>

          <div className="w-full bg-[#efffef] px-4 rounded-lg mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("sale")}
                className={`flex-1 py-2 text-white text-lg font-medium ${
                  activeTab === "sale" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
                }`}
              >
                Bán hàng
              </button>
              <button
                onClick={() => setActiveTab("customer")}
                className={`flex-1 py-2 text-white text-lg font-medium ${
                  activeTab === "customer" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
                }`}
              >
                Khách hàng
              </button>
            </div>

            <div className="p-1 bg-white rounded-lg shadow-md">
            {activeTab === 'sale' && (
              <div>
                <div className="mainCard">
                  <div className="flex items-center gap-2 mb-2">
                    <select className="border rounded-lg p-2 outline-none w-5/6">
                      <option disabled selected>Mã số</option>
                      <option>Mã số</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-3/5">
                      <option disabled selected>Ngày bán</option>
                      <option>Ngày bán</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-full">
                      <option disabled selected>Khách hàng</option>
                      <option>Khách hàng</option>
                    </select>
                    <button className="p-2 w-1/5">
                      <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                    </button>
                    <AddInvoice/>
                  </div>
                  <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                    <InvoiceTable
                      loading={loading}
                      dataHeader={dataHeaderInvoice}
                      data={dataInvoice}
                      handleDelete={handleDelete}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'customer' && (
              <div>
                <div className="mainCard">
                  <div className="flex items-center gap-2 mb-2">
                    <select className="border rounded-lg p-2 outline-none w-full">
                      <option disabled selected>Tên khách hàng</option>
                      <option>Tên khách hàng</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-3/5">
                      <option disabled selected>Điện thoại</option>
                      <option>Điện thoại</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-5/6">
                      <option disabled selected>Địa chỉ</option>
                      <option>Địa chỉ</option>
                    </select>
                    <button className="p-2 w-1/5">
                      <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                    </button>
                    <AddCustomer/>
                  </div>
                  <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                    <CustomerTable
                      loading={loading}
                      dataHeader={dataHeaderCustomer}
                      data={dataCustomer}
                      handleDelete={handleDelete}
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        <Footer toggle={footerToggle} />
      </main>
    </>
  );
}

export default Sales

