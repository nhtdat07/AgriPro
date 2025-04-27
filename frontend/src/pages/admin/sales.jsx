import React, { useState, useEffect } from "react";
import Header from "../../components/Navbar/header";
import Footer from "../../components/Navbar/footer";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";

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

  const [invoicesData, setInvoicesData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const dataHeaderInvoice = [
    { key: "id", label: "STT" },
    { key: "code", label: "Mã số" },
    { key: "timestamp", label: "Thời gian bán hàng" },
    { key: "customer", label: "Khách hàng" },
    { key: "action", label: "" },
  ];

  const dataHeaderCustomer = [
    { key: "id", label: "STT" },
    { key: "name", label: "Tên khách hàng" },
    { key: "address", label: "Địa chỉ" },
    { key: "phone", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    { key: "action", label: "" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoicesRes = await axiosInstance.get("/sales-invoices");
        const customersRes = await axiosInstance.get("/customers");

        const invoicesArray = invoicesRes.data.data.salesInvoices;
        const customersArray = customersRes.data.data.customers;

        setInvoicesData(invoicesArray);
        setCustomersData(customersArray);
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 400) {
            alert("Tải thông tin thất bại!");
          } else if (status === 401) {
            alert("Bạn không có quyền truy cập vào trang này!");
          } else if (status === 500) {
            alert("Vui lòng tải lại trang!");
          }
        }
      }
    };

    fetchData();
  }, []);

  const fetchInvoices = async () => {
    try {
      const invoicesRes = await axiosInstance.get("/sales-invoices");
      const invoicesArray = invoicesRes.data.data.salesInvoices;
      setInvoicesData(invoicesArray);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          alert("Tải thông tin thất bại!");
        } else if (status === 401) {
          alert("Bạn không có quyền truy cập vào trang này!");
        } else if (status === 500) {
          alert("Vui lòng tải lại trang!");
        }
      }
    }
  };

  const fetchCustomers = async () => {
    try {
      const customersRes = await axiosInstance.get("/customers");
      const customersArray = customersRes.data.data.customers;
      setCustomersData(customersArray);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          alert("Tải thông tin thất bại!");
        } else if (status === 401) {
          alert("Bạn không có quyền truy cập vào trang này!");
        } else if (status === 500) {
          alert("Vui lòng tải lại trang!");
        }
      }
    }
  };

  const handleDelete = () => { };

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Header toggle={headerToggle} refreshTrigger={refreshTrigger} />

        <div className="flex-grow">
          <h2 className="pt-4 pl-4 text-2xl font-bold mb-4">Quản lý bán hàng</h2>

          <div className="w-full bg-[#efffef] px-4 rounded-lg mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("sale")}
                className={`flex-1 py-2 text-white text-lg font-medium hover:bg-[#2c9e4b] ${
                  activeTab === "sale" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
                }`}
              >
                Bán hàng
              </button>
              <button
                onClick={() => setActiveTab("customer")}
                className={`flex-1 py-2 text-white text-lg font-medium hover:bg-[#2c9e4b] ${
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
                    <AddInvoice
                      refreshInvoices={fetchInvoices}
                    />
                  </div>
                  <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                    <InvoiceTable
                      loading={loading}
                      dataHeader={dataHeaderInvoice}
                      data={invoicesData}
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
                    <AddCustomer 
                      refreshCustomers={fetchCustomers}
                    />
                  </div>
                  <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                    <CustomerTable
                      loading={loading}
                      dataHeader={dataHeaderCustomer}
                      data={customersData}
                      handleDelete={handleDelete}
                      refreshCustomers={fetchCustomers}
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

