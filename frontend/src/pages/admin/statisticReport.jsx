import React, { useState, useEffect, useRef } from "react";
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
    if (!dateStr) return '';
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
  const [appliedRange, setAppliedRange] = useState(`${formatDate(today)} - ${formatDate(today)}`);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingBestSell, setLoadingBestSell] = useState(false);
  const [loadingTopCustomer, setLoadingTopCustomer] = useState(false); 
  const [summaryData, setSummaryData] = useState([]);
  const [dataBestSell, setDataBestSell] = useState([]);
  const [dataTopCustomer, setDataTopCustomer] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [bestSellOffset, setBestSellOffset] = useState(0);
  const [hasMoreBestSell, setHasMoreBestSell] = useState(true);
  const [isSearchingBestSell, setIsSearchingBestSell] = useState(false); 
  const [topCustomerOffset, setTopCustomerOffset] = useState(0);
  const [hasMoreTopCustomer, setHasMoreTopCustomer] = useState(true);
  const [isSearchingTopCustomer, setIsSearchingTopCustomer] = useState(false);
  const bestSellContainerRef = useRef(null);
  const topCustomerContainerRef = useRef(null);

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

  const fetchSummary = async (currentStartDate, currentEndDate) => {
    setLoadingSummary(true);
    try {
      const params = { startDate: currentStartDate, endDate: currentEndDate };
      const res = await axiosInstance.get("/statistics/load-screen", { params });
      const loadScreenData = res.data.data;
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
    } catch (error) {
      console.error("Error fetching summary data:", error);
      alert("Lỗi khi tải dữ liệu!");
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchBestSellers = async (offset = 0, append = false, isSearch = false, searchTerm = "") => {
    setLoadingBestSell(true);
    setIsSearchingBestSell(isSearch);
    try {
      const params = {
        startDate: startDate || today,
        endDate: endDate || today,
        offset,
        limit: isSearch ? Number.MAX_SAFE_INTEGER : 20,
        ...(isSearch && searchTerm && { productName: searchTerm })
      };

      const res = await axiosInstance.get("/statistics/best-sellers", { params });
      const bestSellersData = res.data.data.products || []; 

      const bestSellMapped = bestSellersData.map((item, index) => ({
        id: append ? offset + index + 1 : index + 1,
        name: item.productName,
        quantity: item.soldQuantity,
      }));

      setDataBestSell(prev => append ? [...prev, ...bestSellMapped] : bestSellMapped);

      if (!isSearch) {
          if (bestSellersData.length < 20) {
            setHasMoreBestSell(false);
          } else {
            setHasMoreBestSell(true);
          }
      } else {
          setHasMoreBestSell(false);
      }

    } catch (error) {
      console.error("Error fetching best sellers:", error);
      alert("Lỗi khi tải danh sách sản phẩm bán chạy!");
      setHasMoreBestSell(false);
    } finally {
      setLoadingBestSell(false);
    }
  };

  const fetchTopCustomers = async (offset = 0, append = false, isSearch = false, searchTerm = "") => {
    setLoadingTopCustomer(true);
    setIsSearchingTopCustomer(isSearch);
    try {
      const params = {
        startDate: startDate || today,
        endDate: endDate || today,
        offset,
        limit: isSearch ? Number.MAX_SAFE_INTEGER : 20,
        ...(isSearch && searchTerm && { customerName: searchTerm })
      };

      const res = await axiosInstance.get("/statistics/active-customers", { params });
      const activeCustomersData = res.data.data.customers || [];

      const topCustomerMapped = activeCustomersData.map((item, index) => ({
        id: append ? offset + index + 1 : index + 1,
        name: item.customerName,
        value: formatCurrency(item.buyingAmount),
      }));

      setDataTopCustomer(prev => append ? [...prev, ...topCustomerMapped] : topCustomerMapped);

      if (!isSearch) {
        if (activeCustomersData.length < 20) {
          setHasMoreTopCustomer(false);
        } else {
          setHasMoreTopCustomer(true);
        }
      } else {
        setHasMoreTopCustomer(false);
      }

    } catch (error) {
      console.error("Error fetching top customers:", error);
      alert("Lỗi khi tải danh sách khách hàng mua nhiều!");
      setHasMoreTopCustomer(false);
    } finally {
      setLoadingTopCustomer(false);
    }
  };

  useEffect(() => {
    fetchSummary(startDate, endDate);
    fetchBestSellers(0, false);
    fetchTopCustomers(0, false);
    setBestSellOffset(0);
    setTopCustomerOffset(0);
    setHasMoreBestSell(true);
    setHasMoreTopCustomer(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  
  useEffect(() => {
    const container = bestSellContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (isBottom && hasMoreBestSell && !isSearchingBestSell && !loadingBestSell) {
        console.log("Fetching more best sellers...");
        const newOffset = bestSellOffset + 20;
        fetchBestSellers(newOffset, true);
        setBestSellOffset(newOffset);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bestSellOffset, hasMoreBestSell, isSearchingBestSell, loadingBestSell]);

  useEffect(() => {
    const container = topCustomerContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (isBottom && hasMoreTopCustomer && !isSearchingTopCustomer && !loadingTopCustomer) {
        console.log("Fetching more top customers...");
        const newOffset = topCustomerOffset + 20;
        fetchTopCustomers(newOffset, true);
        setTopCustomerOffset(newOffset);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topCustomerOffset, hasMoreTopCustomer, isSearchingTopCustomer, loadingTopCustomer]);

  const handleApply = () => {
    const formattedStart = formatDate(startDate || today);
    const formattedEnd = formatDate(endDate || today);
    setAppliedRange(`${formattedStart} - ${formattedEnd}`);

    setBestSellOffset(0);
    setTopCustomerOffset(0);
    setHasMoreBestSell(true);
    setHasMoreTopCustomer(true);
    setDataBestSell([]);
    setDataTopCustomer([]);

    fetchSummary(startDate || today, endDate || today);
    fetchBestSellers(0, false);
    fetchTopCustomers(0, false);
  };

  const handleSearchProduct = () => {
    setBestSellOffset(0);
    setDataBestSell([]);
    setHasMoreBestSell(false);
    fetchBestSellers(0, false, true, searchProduct);
  };

  const handleSearchCustomer = () => {
    setTopCustomerOffset(0);
    setDataTopCustomer([]);
    setHasMoreTopCustomer(false);
    fetchTopCustomers(0, false, true, searchCustomer);
  };

  const handleDelete = () => {
    console.log("Delete action triggered");
   };

  const formatCurrency = (number) => {
    if (number === null || number === undefined) return "0";
    const num = Number(number);
    if (isNaN(num)) return "0";
    return num.toLocaleString("vi-VN");
  };

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Header toggle={headerToggle} />
        <div className="flex-grow">
          <h2 className="pt-4 pl-4 text-2xl font-bold mb-4">Báo cáo thống kê</h2>
          <div className="px-4">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="date"
                className="border px-2 py-1 rounded-lg min-w-[50px]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
              />
              <input
                type="date"
                className="border px-2 py-1 rounded-lg min-w-[50px]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={today}
              />
              <button
                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-1.5 rounded-lg"
                onClick={handleApply}
                disabled={loadingSummary || loadingBestSell || loadingTopCustomer}
              >
                { (loadingSummary || loadingBestSell || loadingTopCustomer) ? "Đang tải..." : "ÁP DỤNG" }
              </button>
              <AddReport
                dateRange={appliedRange}
                bestSellData={dataBestSell}
                topCustomerData={dataTopCustomer}
                summaryData={summaryData}
              />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               {summaryData.map((item, index) => (
                 <div key={index} className="bg-white p-4 rounded-lg shadow-md relative">
                   <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                     <div className="flex justify-between items-center mt-1">
                       <p className="text-sm text-gray-500">
                         {item.title === "Nhập hàng" ? "Số đơn nhập" : item.title === "Bán hàng" ? "Số hóa đơn bán" : appliedRange}
                       </p>
                       <p className="text-lg font-bold text-right">
                         {item.numPurchase || item.numSale || ""}
                       </p>
                     </div>
                     <div className="flex justify-between items-center mt-1">
                       <p className="text-sm text-gray-500">
                         {item.title === "Lợi nhuận" ? "" : "Tổng tiền"}
                       </p>
                       <p className="text-xl font-bold text-right break-words">
                           {item.value}₫
                       </p>
                     </div>
                   <img src={item.icon} alt={item.title} className="w-8 h-8 absolute top-3 right-3" />
                 </div>
               ))}
             </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 bg-white py-4 px-4 rounded-lg flex flex-col"> 
                <h3 className="text-xl font-bold mb-2">Sản phẩm bán chạy</h3>
                <div className="flex items-center mb-2 gap-2">
                  <div className="flex-grow flex items-center border rounded-lg px-2">
                    <input
                      type="text"
                      placeholder="Tìm theo tên sản phẩm..."
                      className="w-full p-2 outline-none"
                      value={searchProduct}
                      onChange={(e) => {
                           setSearchProduct(e.target.value);
                           if (!e.target.value && isSearchingBestSell) {
                               setIsSearchingBestSell(false);
                               handleApply();
                           }
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchProduct()} 
                    />
                  </div>
                  <button onClick={handleSearchProduct} className="p-2 hover:bg-gray-100 rounded" disabled={loadingBestSell}>
                    <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                  </button>
                </div>
                <div
                  ref={bestSellContainerRef}
                  className="overflow-y-auto max-h-[400px] flex-grow" 
                >
                  <BestSellTable
                    dataHeader={dataHeaderBestSell}
                    data={dataBestSell}
                    handleDelete={handleDelete} 
                  />
                </div>
              </div>

              <div className="border border-gray-200 bg-white py-4 px-4 rounded-lg flex flex-col">
                <h3 className="text-xl font-bold mb-2">Khách hàng mua nhiều</h3>
                <div className="flex items-center mb-2 gap-2">
                  <div className="flex-grow flex items-center border rounded-lg px-2">
                    <input
                      type="text"
                      placeholder="Tìm theo tên khách hàng..."
                      className="w-full p-2 outline-none"
                      value={searchCustomer}
                       onChange={(e) => {
                           setSearchCustomer(e.target.value);
                           if (!e.target.value && isSearchingTopCustomer) {
                               setIsSearchingTopCustomer(false);
                               handleApply();
                           }
                       }}
                       onKeyDown={(e) => e.key === 'Enter' && handleSearchCustomer()}
                    />
                  </div>
                  <button onClick={handleSearchCustomer} className="p-2 hover:bg-gray-100 rounded" disabled={loadingTopCustomer}>
                    <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                  </button>
                </div>
                <div
                  ref={topCustomerContainerRef}
                  className="overflow-y-auto max-h-[400px] flex-grow"
                >
                  <TopCustomerTable
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