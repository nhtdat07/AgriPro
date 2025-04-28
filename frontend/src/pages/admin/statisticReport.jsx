import React, { useState } from "react";
import Header from "../../components/Navbar/header";
import Footer from "../../components/Navbar/footer";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import BestSellTable from "../../components/Modal/tableModel/bestSellTable";
import TopCustomerTable from "../../components/Modal/tableModel/topCustomerTable";
import AddReport from "../../components/Modal/addModel/addReport";

import moneyIcon from "../../assets/images/money.svg";
import purchaseIcon from "../../assets/images/purchase_order.svg";
import salesIcon from "../../assets/images/sales_invoice.svg";
import searchIcon from "../../assets/images/search.svg";

function StatisticReport() {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const today = new Date().toISOString().split("T")[0];
  const [headerToggle] = useOutletContext();
  const [footerToggle] = useOutletContext();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [applieRange, setApplieRange] = useState(`${formatDate(today)} - ${formatDate(today)}`);
  const [loading, setLoading] = useState(false);

  const [summaryData, setSummaryData] = useState([]);
  const [dataBestSell, setDataBestSell] = useState([]);
  const [dataTopCustomer, setDataTopCustomer] = useState([]);

  const dataHeaderBestSell = [
    { key: "id", label: "STT" },
    { key: "name", label: "Tên sản phẩm" },
    { key: "quantity", label: <span>Số lượng<br />bán ra</span> }
  ];

  const dataHeaderTopCustomer = [
    { key: "id", label: "STT" },
    { key: "name", label: "Tên khách hàng" },
    { key: "value", label: <span>Tổng tiền<br />Mua hàng</span> }
  ];

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      const params = {
        startDate,
        endDate,
      };

      const [loadScreenRes, bestSellersRes, activeCustomersRes] = await Promise.all([
        axiosInstance.get("/statistics/load-screen", { params }),
        axiosInstance.get("/statistics/best-sellers", { params }),
        axiosInstance.get("/statistics/active-customers", { params }),
      ]);

      const loadScreenData = loadScreenRes.data.data;
      const bestSellersData = bestSellersRes.data.data.products;
      const activeCustomersData = activeCustomersRes.data.data.customers;

      setSummaryData([
        {
          title: "Lợi nhuận",
          value: formatCurrency(loadScreenData.totalBenefit),
          icon: moneyIcon,
        },
        {
          title: "Nhập hàng",
          numPurchase: loadScreenData.purchaseOrdersAmount,
          value: formatCurrency(loadScreenData.totalPurchase),
          icon: purchaseIcon,
        },
        {
          title: "Bán hàng",
          numSale: loadScreenData.salesInvoicesAmount,
          value: formatCurrency(loadScreenData.totalSale),
          icon: salesIcon,
        },
      ]);

      setDataBestSell(
        bestSellersData.map((item, index) => ({
          id: index + 1,
          name: item.productName,
          quantity: item.soldQuantity,
        }))
      );

      setDataTopCustomer(
        activeCustomersData.map((item, index) => ({
          id: index + 1,
          name: item.customerName,
          value: formatCurrency(item.buyingAmount),
        }))
      );

    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    const formattedStart = formatDate(startDate ? startDate : today);
    const formattedEnd = formatDate(endDate ? endDate : today);
    setApplieRange(`${formattedStart} - ${formattedEnd}`);
    fetchStatistics();
  };

  const handleDelete = () => { };

  const formatCurrency = (number) => {
    if (!number && number !== 0) return "0";
    return number.toLocaleString("vi-VN");
  };

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Header toggle={headerToggle} />
        <div className="flex-grow">
          <h2 className="pt-4 pl-4 text-2xl font-bold mb-4">Quản lý bán hàng</h2>

          <div className="px-4">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="date"
                className="border px-2 py-1 rounded-lg min-w-[50px]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="border px-2 py-1 rounded-lg min-w-[50px]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button
                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg min-w-[50px]"
                onClick={handleApply}
              >
                ÁP DỤNG
              </button>
              <AddReport
                dateRange={applieRange}
                bestSellData={dataBestSell}
                topCustomerData={dataTopCustomer}
                summaryData={summaryData}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {summaryData.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md relative">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 pt-2">
                        {item.title === "Nhập hàng" ? "Số đơn nhập hàng" : item.title === "Bán hàng" ? "Số hóa đơn bán hàng" : applieRange}
                      </p>
                      <p className="text-xl font-bold text-right">
                        {item.numPurchase || item.numSale || ""}
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
                    <input type="text" placeholder="Tên sản phẩm" className="w-full p-2 outline-none" />
                  </div>
                  <button className="ml-2 p-2">
                    <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[250px]">
                  <BestSellTable
                    loading={loading}
                    dataHeader={dataHeaderBestSell}
                    data={dataBestSell}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>

              <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Khách hàng mua nhiều</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center border rounded-lg px-2 w-full">
                    <input type="text" placeholder="Tên khách hàng" className="w-full p-2 outline-none" />
                  </div>
                  <button className="ml-2 p-2">
                    <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[250px]">
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
        </div>
        <Footer toggle={footerToggle} />
      </main>
    </>
  );
}

export default StatisticReport;
