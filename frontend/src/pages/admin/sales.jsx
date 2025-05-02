import React, { useState, useEffect, useRef } from "react";
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
  const dataHeaderInvoice = 
  [ {key: "id", label: "STT"},
    {key: "code", label: "Mã số"},
    {key: "date", label: "Thời gian bán hàng"},
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
  const [invoicesData, setInvoicesData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [invoiceSearch, setInvoiceSearch] = useState({
    code: "",
    date: "",
    customer: "",
  });
  const [customerSearch, setCustomerSearch] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [invoiceOffset, setInvoiceOffset] = useState(0);
  const [hasMoreInvoices, setHasMoreInvoices] = useState(true);
  const [customerOffset, setCustomerOffset] = useState(0);
  const [hasMoreCustomers, setHasMoreCustomers] = useState(true);
  const invoiceContainerRef = useRef(null);
  const customerContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoicesRes = await axiosInstance.get("/sales-invoices");
        const customersRes = await axiosInstance.get("/customers");

        const invoicesArray = invoicesRes.data.data.salesInvoices;
        const customersArray = customersRes.data.data.customers;

        setInvoicesData(invoicesArray);
        setFilteredInvoices(invoicesArray);
        setCustomersData(customersArray);
        setFilteredCustomers(customersArray);
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 400) alert("Tải thông tin thất bại!");
          else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
          else if (status === 500) alert("Vui lòng tải lại trang!");
        }
      }
    };

    fetchData();
  }, []);

  const fetchInvoices = async (offset = 0, append = false) => {
    try {
      const res = await axiosInstance.get("/sales-invoices", {
        params: { offset, limit: 20 }
      });
      const newData = res.data.data.salesInvoices;
      setInvoicesData(prev => append ? [...prev, ...newData] : newData);
      setFilteredInvoices(prev => append ? [...prev, ...newData] : newData);
      setRefreshTrigger(prev => prev + 1);
  
      if (newData.length < 20) {
        setHasMoreInvoices(false);
      } else {
        setHasMoreInvoices(true);
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }
    }
  };  

  useEffect(() => {
    const container = invoiceContainerRef.current;
    if (!container) return;
  
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
      if (isBottom && hasMoreInvoices) {
        const newOffset = invoiceOffset + 20;
        fetchInvoices(newOffset, true);
        setInvoiceOffset(newOffset);
      }
    };
  
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [invoiceOffset, hasMoreInvoices]);

  const fetchCustomers = async (offset = 0, append = false) => {
    try {
      const res = await axiosInstance.get("/customers", {
        params: { offset, limit: 20 }
      });
      const newData = res.data.data.customers;
      setCustomersData(prev => append ? [...prev, ...newData] : newData);
      setFilteredCustomers(prev => append ? [...prev, ...newData] : newData);
      setRefreshTrigger(prev => prev + 1);
      
      if (newData.length < 20) {
        setHasMoreCustomers(false);
      } else {
        setHasMoreCustomers(true);
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }
    }
  };

  useEffect(() => {
    if (activeTab !== 'customer') return;
    const container = customerContainerRef.current;
    if (!container) return;
  
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
      if (isBottom && hasMoreCustomers) {
        const newOffset = customerOffset + 20;
        fetchCustomers(newOffset, true);
        setCustomerOffset(newOffset);
      }
    };
  
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeTab, customerOffset, hasMoreCustomers]);

  const handleSearchInvoice = () => {
    const result = invoicesData.filter((item) => {
      const codeMatch = item.salesInvoiceId && item.salesInvoiceId.toLowerCase().includes(invoiceSearch.code ? invoiceSearch.code.toLowerCase() : "");
      const dateMatch = item.recordedTimestamp.slice(0, 10).includes(invoiceSearch.date ? invoiceSearch.date : "");
      const customerMatch = item.customerName && item.customerName.toLowerCase().includes(invoiceSearch.customer ? invoiceSearch.customer.toLowerCase() : "");
      return codeMatch && dateMatch && customerMatch;
    });
    setFilteredInvoices(result);
  };  

  const handleSearchCustomer = () => {
    const result = customersData.filter((item) => {
      const nameMatch = item.customerName && item.customerName.toLowerCase().includes(customerSearch.name ? customerSearch.name.toLowerCase() : "");
      const phoneMatch = item.phoneNumber && item.phoneNumber.includes(customerSearch.phone ? customerSearch.phone : "");
      const addressMatch = item.address && item.address.toLowerCase().includes(customerSearch.address ? customerSearch.address.toLowerCase() : "");
      return nameMatch && phoneMatch && addressMatch;
    });
    setFilteredCustomers(result);
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
                className={`flex-1 py-2 text-white text-lg font-medium hover:bg-[#2c9e4b] ${activeTab === "sale" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"}`}
              >
                Bán hàng
              </button>
              <button
                onClick={() => setActiveTab("customer")}
                className={`flex-1 py-2 text-white text-lg font-medium hover:bg-[#2c9e4b] ${activeTab === "customer" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"}`}
              >
                Khách hàng
              </button>
            </div>

            <div className="p-1 bg-white rounded-lg shadow-md">
              {activeTab === 'sale' && (
                <div>
                  <div className="mainCard">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        placeholder="Mã số"
                        className="border rounded-lg p-2 outline-none w-5/6"
                        value={invoiceSearch.code}
                        onChange={(e) => setInvoiceSearch({ ...invoiceSearch, code: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Ngày bán"
                        onFocus={(e) => (e.target.type = 'date')}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text';
                        }}
                        className="border rounded-lg p-2 outline-none w-3/5"
                        value={invoiceSearch.date}
                        onChange={(e) => setInvoiceSearch({ ...invoiceSearch, date: e.target.value })}
                      />
                      <input
                        placeholder="Khách hàng"
                        className="border rounded-lg p-2 outline-none w-full"
                        value={invoiceSearch.customer}
                        onChange={(e) => setInvoiceSearch({ ...invoiceSearch, customer: e.target.value })}
                      />
                      <button type="button" onClick={handleSearchInvoice} className="p-2 w-1/5">
                        <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                      </button>
                      <AddInvoice refreshInvoices={fetchInvoices} />
                    </div>
                    <div
                      ref={invoiceContainerRef}
                      className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg overflow-y-auto max-h-[500px]"
                    >
                      <InvoiceTable
                        loading={loading}
                        dataHeader={dataHeaderInvoice}
                        data={filteredInvoices}
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
                      <input
                        placeholder="Tên khách hàng"
                        className="border rounded-lg p-2 outline-none w-full"
                        value={customerSearch.name}
                        onChange={(e) => setCustomerSearch({ ...customerSearch, name: e.target.value })}
                      />
                      <input
                        placeholder="Số điện thoại"
                        className="border rounded-lg p-2 outline-none w-3/5"
                        value={customerSearch.phone}
                        onChange={(e) => setCustomerSearch({ ...customerSearch, phone: e.target.value })}
                      />
                      <input
                        placeholder="Địa chỉ"
                        className="border rounded-lg p-2 outline-none w-5/6"
                        value={customerSearch.address}
                        onChange={(e) => setCustomerSearch({ ...customerSearch, address: e.target.value })}
                      />
                      <button type="button" onClick={handleSearchCustomer} className="p-2 w-1/5">
                        <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                      </button>
                      <AddCustomer refreshCustomers={fetchCustomers} />
                    </div>
                    <div
                      ref={customerContainerRef}
                      className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg overflow-y-auto max-h-[500px]"
                    >
                      <CustomerTable
                        loading={loading}
                        dataHeader={dataHeaderCustomer}
                        data={filteredCustomers}
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

export default Sales;
