import React, { useState, useEffect } from "react";
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import { saveAs } from "file-saver";
import html2docx from 'html-docx-js/dist/html-docx.js';
import axiosInstance from "../../../utils/axiosInstance.js"

import plus from "../../../assets/images/plus.png";
import minus from "../../../assets/images/minus.png";

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const today = new Date().toISOString().split("T")[0];

export default function ExportReport({ dateRange, bestSellData, topCustomerData, summaryData }) {
    const [showModal, setShowModal] = useState(false);
    const [iconStates, setIconStates] = useState([true, true, true, true, true, true, true]);
    const [topProductsCount, setTopProductsCount] = useState(5);
    const [topCustomersCount, setTopCustomersCount] = useState(5);
    const [includeTopProductsQty, setIncludeTopProductsQty] = useState("có");
    const [includeTopCustomersValue, setIncludeTopCustomersValue] = useState("có");
    const [format, setFormat] = useState("PDF");
    const [agencyInfo, setAgencyInfo] = useState({
        agencyName: "",
        ownerName: "",
        address: "",
        taxCode: "",
        phoneNumber: "",
    });

    const toggleIcon = (index) => {
      setIconStates(prev => prev.map((state, i) => (i === index ? !state : state)));
    }; 

    const handleDownload = async () => {
        const reportElement = document.getElementById("report-preview");
    
        let fontSize = 13;
        let marginTop = 2;
        let marginRight = 2.5;
        let marginBottom = 2;
        let marginLeft = 2.5;
    
        try {
            const res = await axiosInstance.get("/settings");
            const settings = res.data.data.settings;
    
            settings.forEach((item) => {
                if (item.category === "PRINT_FORMAT") {
                    if (item.key === "left_margin") {
                        marginLeft = parseFloat(item.value);
                    } else if (item.key === "right_margin") {
                        marginRight = parseFloat(item.value);
                    } else if (item.key === "top_margin") {
                        marginTop = parseFloat(item.value);
                    } else if (item.key === "bottom_margin") {
                        marginBottom = parseFloat(item.value);
                    } else if (item.key === "font_size") {
                        fontSize = parseInt(item.value, 10);
                    }
                }
            });
        } catch (error) {
            if (error.response) {
              const { status } = error.response;
              if (status === 401) {
                alert("Bạn không có quyền truy cập vào trang này!");
              } else if (status === 500) {
                alert("Vui lòng tải lại trang!");
              }
            }  
        }
    
        const FONT_SIZE_PT = fontSize;
        const MARGIN_TOP_CM = marginTop;
        const MARGIN_RIGHT_CM = marginRight;
        const MARGIN_BOTTOM_CM = marginBottom;
        const MARGIN_LEFT_CM = marginLeft;
    
        const reportPdfHtml = `
            <html>
                <head>
                    <meta charset='utf-8'>
                    <style>
                        body {
                            font-family: Times New Roman, serif;
                            font-size: ${FONT_SIZE_PT}pt;
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        p.heading {
                            text-align: center;
                        }
                        th {
                            text-align: center;
                        }
                        td {
                            text-align: left;
                        }
                        th, td {
                            border: 1px solid black;
                            font-size: ${FONT_SIZE_PT}pt;
                            line-height: 1.75;
                        }
                    </style>
                </head>
                <body>${reportElement.innerHTML}</body>
            </html>
        `;
    
        const reportDocHtml = `
            <html>
                <head>
                    <meta charset='utf-8'>
                    <style>
                        body {
                            font-family: Times New Roman, serif;
                            font-size: ${FONT_SIZE_PT}pt;
                        }
                        h2 {
                            margin: 15px 0px 0px;
                        }
                        h2, h3 {
                            text-align: center;
                            text-transform: uppercase;
                            margin: 0px;
                        }
                        p {
                            text-align: left;
                            margin: 5px 0px;
                        }
                        #heading {
                            text-align: center;
                        }
                        #section {
                            margin: 20px 0px 5px;
                        }
                        #signature-title {
                            text-align: right;
                            margin: 10px 75px 0px;
                        }
                        #signature-name {
                            text-align: right;
                            margin: 0px 75px;
                        }
                        hr {
                            width: 50%
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid black;
                            font-size: ${FONT_SIZE_PT}pt;
                            line-height: 1.25;
                        }
                        #row {
                            font-family: Times New Roman, serif;
                            font-size: ${FONT_SIZE_PT}pt;
                            text-align: center;
                        }
                        #rowName {
                            font-family: Times New Roman, serif;
                            font-size: ${FONT_SIZE_PT}pt;
                            text-align: left;
                            margin: 0px 10px;
                        }
                    </style>
                </head>
                <body>${reportElement.innerHTML}</body>
            </html>
        `;
    
        if (format === "PDF") {
            const opt = {
                margin: [
                    MARGIN_TOP_CM,
                    MARGIN_LEFT_CM,
                    MARGIN_BOTTOM_CM,
                    MARGIN_RIGHT_CM
                ],
                filename: 'bao-cao.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };
    
            html2pdf().set(opt).from(reportPdfHtml).save();
        } else if (format === "Word") {
            const blob = html2docx.asBlob(reportDocHtml, {
                orientation: 'portrait',
                margins: {
                    top: MARGIN_TOP_CM * 566.93,
                    bottom: MARGIN_BOTTOM_CM * 566.93,
                    left: MARGIN_LEFT_CM * 566.93,
                    right: MARGIN_RIGHT_CM * 566.93,
                }
            });
            saveAs(blob, "bao-cao.docx");
        }
    };           

    const totalProfit = summaryData.find(item => item.title === "Lợi nhuận")?.value || "0";
    const numPurchase = summaryData.find(item => item.title === "Nhập hàng")?.numPurchase || "0";
    const valuePurchase = summaryData.find(item => item.title === "Nhập hàng")?.value || "0";
    const numSale = summaryData.find(item => item.title === "Bán hàng")?.numSale || "0";
    const valueSale = summaryData.find(item => item.title === "Bán hàng")?.value || "0";
    
    const fetchSettings = async () => {
        try {
          const response = await axiosInstance.get("/settings");
          const data = response.data.data.userProfile;
      
          setAgencyInfo({
            agencyName: data.agencyName,
            ownerName: data.ownerName,
            address: data.address,
            taxCode: data.taxCode,
            phoneNumber: data.phoneNumber,
          });
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
    
    useEffect(() => {
        fetchSettings();
    }, []); 

    return (
        <>
            <div className="rounded-lg py-2 outline-none w-3/5 flex justify-end ml-auto">
                <button 
                    className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 inline-flex items-center rounded-lg"
                    onClick={() => setShowModal(true)}
                >
                    <span>XUẤT BÁO CÁO</span>
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-md w-[1200px] h-[650px] flex flex-col relative p-6">
                        
                        <h3 className="text-2xl font-semibold text-center">Xuất báo cáo mới</h3>
                        <h3 className="text-sm font-medium text-center mb-2">(Chọn + để thêm vào báo cáo)</h3>

                        <div className="flex flex-1 overflow-hidden px-6 pb-4 gap-4">
                            <div className="w-3/4 pr-2 border-r overflow-y-auto">
                                <form>
                                    <div className="flex gap-4 justify-between mb-4">
                                        <div className="w-1/3">
                                            <label className="text-sm font-medium">Ngày xuất</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" value={formatDate(today)} disabled />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="text-sm font-medium">Thời gian</label>
                                            <input type="text" className="w-full p-2 border rounded-lg text-center" value={dateRange} disabled />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="text-sm font-medium">Định dạng</label>
                                            <select
                                                className="w-full p-2 border rounded-lg"
                                                value={format}
                                                onChange={(e) => setFormat(e.target.value)}
                                            >
                                                <option value="PDF">PDF</option>
                                                <option value="Word">Word</option>
                                            </select>
                                        </div>
                                    </div>

                                    {[
                                        { label: "Tổng lợi nhuận", value: totalProfit, index: 0 },
                                        { label: "Số đơn nhập hàng", value: numPurchase, index: 1 },
                                        { label: "Tổng số tiền nhập hàng", value: valuePurchase, index: 2 },
                                        { label: "Số hóa đơn", value: numSale, index: 3 },
                                        { label: "Tổng số tiền bán hàng", value: valueSale, index: 4 },
                                        { label: "Sản phẩm bán chạy", index: 5 },
                                        { label: "Khách hàng mua nhiều", index: 6 },
                                    ].map(({ label, value, index }) => (
                                        <div key={index} className="mb-4">
                                            <label className="text-sm font-medium block mb-1">{label}</label>
                                            
                                            {index === 5 || index === 6 ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">Danh sách</span>
                                                    <input
                                                        type="number"
                                                        className="w-16 p-2 border rounded-lg text-center"
                                                        value={index === 5 ? topProductsCount : topCustomersCount}
                                                        onChange={(e) => {
                                                            const newValue = Math.max(1, Number(e.target.value));
                                                            index === 5
                                                                ? setTopProductsCount(newValue)
                                                                : setTopCustomersCount(newValue);
                                                        }}
                                                    />
                                                    <span className="text-sm">{index === 5 ? "sản phẩm bán chạy nhất" : "khách hàng mua nhiều nhất"}</span>
                                                    <select
                                                        className="p-2 border rounded-lg"
                                                        value={index === 5 ? includeTopProductsQty : includeTopCustomersValue}
                                                        onChange={(e) =>
                                                            index === 5
                                                            ? setIncludeTopProductsQty(e.target.value)
                                                            : setIncludeTopCustomersValue(e.target.value)
                                                        }
                                                    >
                                                        <option value="có">có</option>
                                                        <option value="không">không</option>
                                                    </select>
                                                    <span className="text-sm">{index === 5 ? "kèm số lượng bán ra" : "kèm tổng tiền mua hàng"}</span>
                                                    <img
                                                        src={iconStates[index] ? minus : plus}
                                                        alt="toggle"
                                                        className="w-5 h-5 cursor-pointer"
                                                        onClick={() => toggleIcon(index)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex gap-4">
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 border rounded-lg"
                                                        value={value}
                                                        disabled
                                                    />
                                                    <img
                                                        src={iconStates[index] ? minus : plus}
                                                        alt="toggle"
                                                        className="w-5 h-5 mt-2.5 cursor-pointer"
                                                        onClick={() => toggleIcon(index)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </form>
                            </div>

                            <div id="report-preview" className="w-1/2 overflow-y-auto p-4 text-[13px]">
                                <h3 className="font-bold text-center uppercase">Đại lý Vật tư nông nghiệp {agencyInfo.agencyName}</h3>
                                <p id="heading" className="text-center">Địa chỉ: {agencyInfo.address}</p>
                                <p id="heading" className="text-center">Số điện thoại: {agencyInfo.phoneNumber}</p>
                                <p id="heading" className="text-center">Mã số thuế: {agencyInfo.taxCode}</p>
                                <br/>
                                <h2 className="text-xxl font-bold text-center">BÁO CÁO KẾT QUẢ HOẠT ĐỘNG KINH DOANH</h2>
                                <p id="heading" className="text-center">(Thời gian: {dateRange})</p>
                                <p id="heading" className="text-center"><strong>Ngày xuất báo cáo:</strong> {formatDate(today)}</p>
                                <hr className="mx-auto mt-5 mb-2 w-1/2 border-t border-black" />
                                
                                {iconStates[0] && (<p><strong>Tổng lợi nhuận:</strong> {totalProfit}</p>)}
                                {iconStates[1] && (<p><strong>Số đơn nhập hàng:</strong> {numPurchase}</p>)}
                                {iconStates[3] && (<p><strong>Số hóa đơn:</strong> {numSale}</p>)}
                                {iconStates[2] && (<p><strong>Tổng số tiền nhập hàng:</strong> {valuePurchase}</p>)}
                                {iconStates[4] && (<p><strong>Tổng số tiền bán hàng:</strong> {valueSale}</p>)}

                                {iconStates[5] && (
                                    <div className="mt-4">
                                        <p id="section" className="mb-3"><strong>Sản phẩm bán chạy:</strong></p>
                                        {bestSellData && bestSellData.length > 0 ? (
                                        <table className="min-w-full text-sm border border-gray-300">
                                            <thead className="bg-gray-200">
                                            <tr>
                                                <th className="px-2 py-1 border"><p id="row">STT</p></th>
                                                <th className="px-2 py-1 border"><p id="row">Tên sản phẩm</p></th>
                                                {includeTopProductsQty === "có" && (
                                                    <th className="px-2 py-1 border"><p id="row">Số lượng</p></th>
                                                )}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {bestSellData.slice(0, topProductsCount).map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-2 py-1 border text-center"><p id="row">{idx + 1}</p></td>
                                                    <td className="px-2 py-1 border"><p id="rowName">{item.name}</p></td>
                                                    {includeTopProductsQty === "có" && (
                                                        <td className="px-2 py-1 border text-center"><p id="row">{item.quantity}</p></td>
                                                    )}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        ) : (
                                        <p>Không có dữ liệu sản phẩm bán chạy</p>
                                        )}
                                    </div>
                                )}

                                {iconStates[6] && (
                                    <div className="mt-4">
                                        <p id="section" className="mb-3"><strong>Khách hàng mua nhiều:</strong></p>
                                        {topCustomerData && topCustomerData.length > 0 ? (
                                        <table className="min-w-full text-sm border border-gray-300">
                                            <thead className="bg-gray-200">
                                            <tr>
                                                <th className="px-2 py-1 border"><p id="row">STT</p></th>
                                                <th className="px-2 py-1 border"><p id="row">Tên khách hàng</p></th>
                                                {includeTopCustomersValue === "có" && (
                                                    <th className="px-2 py-1 border"><p id="row">Tổng tiền mua hàng</p></th>
                                                )}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {topCustomerData.slice(0, topCustomersCount).map((item, idx) => (
                                                <tr key={idx}>
                                                <td className="px-2 py-1 border text-center"><p id="row">{idx + 1}</p></td>
                                                <td className="px-2 py-1 border"><p id="rowName">{item.name}</p></td>
                                                {includeTopCustomersValue === "có" && (
                                                    <td className="px-2 py-1 border text-center"><p id="row">{item.value}</p></td>
                                                )}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        ) : (
                                        <p>Không có dữ liệu khách hàng mua nhiều</p>
                                        )}
                                    </div>
                                )}

                                <div className="mt-6 text-right pr-20">
                                    <div className="mb-2 inline-block text-center">
                                        <div class="signature-block">
                                            <p id="signature-title"><strong>Chủ đại lý</strong></p>
                                            <p id="signature-name">{agencyInfo.ownerName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 pb-4">
                            <button
                                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                                onClick={handleDownload}
                            >
                                TẢI VỀ
                            </button>
                            <button
                                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                                onClick={() => setShowModal(false)}
                            >
                                THOÁT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
