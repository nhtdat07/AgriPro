import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import HTMLtoDOCX from 'html-docx-js/dist/html-docx';

import plus from "../../../assets/images/plus.png";
import minus from "../../../assets/images/minus.png";

const agencyInfo = {
    agencyName: "Đại lý vật tư nông nghiệp Quốc Thạnh",
    ownerName: "Phạm Huỳnh Quốc Thạnh",
    address: "193, Tân Bình Thạnh, H. Chợ Gạo, T. Tiền Giang",
    taxCode: "1234567890",
    phone: "0397151736",
};

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

    const toggleIcon = (index) => {
      setIconStates(prev => prev.map((state, i) => (i === index ? !state : state)));
    };

    const handleDownload = () => {
        const element = document.getElementById("report-preview");

        if (format === "PDF") {
            const originalElement = document.getElementById("report-preview");
            const cloned = originalElement.cloneNode(true);
            cloned.style.position = "absolute";
            cloned.style.top = "-9999px";
            cloned.style.width = `${originalElement.offsetWidth}px`;
            cloned.style.height = `${originalElement.scrollHeight}px`;
            cloned.style.overflow = "visible";

            cloned.querySelectorAll("*").forEach(el => {
                el.style.fontSize = "10px";
            });

            document.body.appendChild(cloned);
            html2canvas(cloned, { scale: 2, useCORS: true }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

                let heightLeft = imgHeight;
                let position = 0;

                while (heightLeft > 0) {
                    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                    heightLeft -= pageHeight;
                    if (heightLeft > 0) {
                        pdf.addPage();
                        position = -imgHeight + heightLeft;
                    }
                }

                pdf.save("bao-cao.pdf");
                document.body.removeChild(cloned);
            });
        } else if (format === "Word") {
            const html = `
                <html>
                <head>
                    <meta charset='utf-8'>
                    <style> body { font-family: Arial, sans-serif; } </style>
                </head>
                <body>${element.innerHTML}</body>
                </html>
            `;
            const blob = HTMLtoDOCX.asBlob(html);
            saveAs(blob, "bao-cao.docx");
        }
    };

    const totalProfit = summaryData.find(item => item.title === "Lợi nhuận")?.value || "0";
    const numPurchase = summaryData.find(item => item.title === "Nhập hàng")?.numPurchase || "0";
    const valuePurchase = summaryData.find(item => item.title === "Nhập hàng")?.value || "0";
    const numSale = summaryData.find(item => item.title === "Bán hàng")?.numSale || "0";
    const valueSale = summaryData.find(item => item.title === "Bán hàng")?.value || "0";

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
                                <h3 className="font-bold text-center uppercase">{agencyInfo.agencyName}</h3>
                                <p className="text-center">Địa chỉ: {agencyInfo.address}</p>
                                <p className="text-center">Số điện thoại: {agencyInfo.phone}</p>
                                <p className="text-center mb-6">Mã số thuế: {agencyInfo.taxCode}</p>
                                <h2 className="text-xxl font-bold text-center">BÁO CÁO KẾT QUẢ HOẠT ĐỘNG KINH DOANH</h2>
                                <p className="text-center">(Thời gian: {dateRange})</p>
                                <p className="text-center"><strong>Ngày xuất báo cáo:</strong> {formatDate(today)}</p>
                                <hr className="my-2" />

                                {iconStates[0] && (<p><strong>Tổng lợi nhuận:</strong> {totalProfit}</p>)}
                                {iconStates[1] && (<p><strong>Số đơn nhập hàng:</strong> {numPurchase}</p>)}
                                {iconStates[3] && (<p><strong>Số hóa đơn:</strong> {numSale}</p>)}
                                {iconStates[2] && (<p><strong>Tổng số tiền nhập hàng:</strong> {valuePurchase}</p>)}
                                {iconStates[4] && (<p><strong>Tổng số tiền bán hàng:</strong> {valueSale}</p>)}

                                {iconStates[5] && (
                                    <div className="mt-4">
                                        <p><strong>Sản phẩm bán chạy:</strong></p>
                                        {bestSellData && bestSellData.length > 0 ? (
                                        <table className="min-w-full text-sm border border-gray-300">
                                            <thead className="bg-gray-200">
                                            <tr>
                                                <th className="px-2 py-1 border">STT</th>
                                                <th className="px-2 py-1 border">Tên sản phẩm</th>
                                                {includeTopProductsQty === "có" && (
                                                    <th className="px-2 py-1 border">Số lượng</th>
                                                )}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {bestSellData.slice(0, topProductsCount).map((item, idx) => (
                                                <tr key={idx}>
                                                <td className="px-2 py-1 border text-center">{idx + 1}</td>
                                                <td className="px-2 py-1 border">{item.name}</td>
                                                {includeTopProductsQty === "có" && (
                                                    <td className="px-2 py-1 border text-center">{item.quantity}</td>
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
                                        <p><strong>Khách hàng mua nhiều:</strong></p>
                                        {topCustomerData && topCustomerData.length > 0 ? (
                                        <table className="min-w-full text-sm border border-gray-300">
                                            <thead className="bg-gray-200">
                                            <tr>
                                                <th className="px-2 py-1 border">STT</th>
                                                <th className="px-2 py-1 border">Tên khách hàng</th>
                                                {includeTopCustomersValue === "có" && (
                                                    <th className="px-2 py-1 border">Tổng tiền mua hàng</th>
                                                )}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {topCustomerData.slice(0, topCustomersCount).map((item, idx) => (
                                                <tr key={idx}>
                                                <td className="px-2 py-1 border text-center">{idx + 1}</td>
                                                <td className="px-2 py-1 border">{item.name}</td>
                                                {includeTopCustomersValue === "có" && (
                                                    <td className="px-2 py-1 border text-center">{item.value}</td>
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
                                    <div className="inline-block text-center">
                                        <p><strong>Chủ đại lý</strong></p>
                                        <p>{agencyInfo.ownerName}</p>
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
