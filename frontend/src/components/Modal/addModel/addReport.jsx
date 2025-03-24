import React, { useState } from "react";

import plus from "../../../assets/images/plus.png";
import minus from "../../../assets/images/minus.png";

const dataReport = {
    dateRange: "15/10/2024 - 15/11/2024",
    totalProfit: "12.368.000",
    numPurchase: "4",
    valuePurchase: "14.290.000",
    numSale: "52",
    valueSale: "19.625.000"
};

const day = new Date().getDate();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const currentDay = `${day}/${month}/${year}`;

export default function ExportReport() {
    const [showModal, setShowModal] = useState(false);
    const [iconStates, setIconStates] = useState([true, true, true, true, true, true, true]);

    const toggleIcon = (index) => {
        setIconStates(prevStates => 
            prevStates.map((state, i) => (i === index ? !state : state))
        );
    };
    
    return (
        <>
            <div className="rounded-lg py-2 outline-none w-3/5 flex justify-end ml-auto">
                <button 
                    className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white font-medium px-4 py-2 inline-flex items-center rounded-lg"
                    onClick={() => setShowModal(true)}
                >
                    <span>XUẤT BÁO CÁO</span>
                </button>
            </div>
            {showModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-md w-[1000px] max-h-[650px] overflow-y-auto p-6">
                        <h3 className="text-2xl font-semibold text-center">Xuất báo cáo mới</h3>
                        <h3 className="text-sm font-medium text-center">(Chọn + để thêm vào báo cáo)</h3>
                        
                        <form>
                            <div className="flex gap-4 justify-between">
                                <div className="w-1/4">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Ngày xuất</label>
                                    <input type="text" className="w-full p-2 border rounded-lg" value={currentDay} disabled />
                                </div>
                                <div className="w-auto">
                                    <label className="p-2 block text-sm font-medium text-gray-700 text-center">Thời gian</label>
                                    <input type="text" className="w-full p-2 border rounded-lg text-center" value={dataReport.dateRange} disabled/>
                                </div>
                                <div className="w-1/4">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Định dạng</label>
                                    <select className="w-full p-2 border rounded-lg">
                                        <option disabled selected>Định dạng</option>
                                        <option>PDF</option>
                                        <option>Word</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Tổng lợi nhuận</label>
                                <div className="flex gap-4">
                                    <input type="text" className="w-full p-2 border rounded-lg" value={dataReport.totalProfit} disabled />
                                    <img
                                        src={iconStates[0] ? plus : minus} 
                                        alt={iconStates[0] ? "Add" : "Remove"} 
                                        className="w-5 h-5 mt-2.5 cursor-pointer" 
                                        onClick={() => toggleIcon(0)} 
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Số đơn nhập hàng</label>
                                    <div className="flex gap-4">
                                        <input type="text" className="w-full p-2 border rounded-lg" value={dataReport.numPurchase} disabled />
                                        <img
                                            src={iconStates[1] ? plus : minus} 
                                            alt={iconStates[1] ? "Add" : "Remove"} 
                                            className="w-5 h-5 mt-2.5 cursor-pointer" 
                                            onClick={() => toggleIcon(1)} 
                                        />
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Tổng số tiền nhập hàng</label>
                                    <div className="flex gap-4">    
                                        <input type="text" className="w-full p-2 border rounded-lg" value={dataReport.valuePurchase} disabled />
                                        <img
                                            src={iconStates[2] ? plus : minus} 
                                            alt={iconStates[2] ? "Add" : "Remove"} 
                                            className="w-5 h-5 mt-2.5 cursor-pointer" 
                                            onClick={() => toggleIcon(2)} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Số hóa đơn</label>
                                    <div className="flex gap-4">
                                        <input type="text" className="w-full p-2 border rounded-lg" value={dataReport.numSale} disabled />
                                        <img
                                            src={iconStates[3] ? plus : minus} 
                                            alt={iconStates[3] ? "Add" : "Remove"} 
                                            className="w-5 h-5 mt-2.5 cursor-pointer" 
                                            onClick={() => toggleIcon(3)} 
                                        />
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Tổng số tiền bán hàng</label>
                                    <div className="flex gap-4">    
                                        <input type="text" className="w-full p-2 border rounded-lg" value={dataReport.valueSale} disabled />
                                        <img
                                            src={iconStates[4] ? plus : minus} 
                                            alt={iconStates[4] ? "Add" : "Remove"} 
                                            className="w-5 h-5 mt-2.5 cursor-pointer" 
                                            onClick={() => toggleIcon(4)} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Sản phẩm bán chạy</label>
                                <div className="flex items-center">
                                    <span className="pl-2 mr-1">
                                        Danh sách
                                    </span>
                                    <input type="number" className="p-2 border rounded-lg" />
                                    <span className="mx-1">
                                        sản phẩm bán chạy nhất
                                    </span>
                                    <select className="p-2 border rounded-lg">
                                        <option>có</option>
                                        <option>không</option>
                                    </select>
                                    <span className="ml-1">
                                        kèm số lượng bán ra
                                    </span>
                                    <img
                                        src={iconStates[5] ? plus : minus} 
                                        alt={iconStates[5] ? "Add" : "Remove"} 
                                        className="w-5 h-5 cursor-pointer ml-auto" 
                                        onClick={() => toggleIcon(5)} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Khách hàng mua nhiều</label>
                                <div className="flex items-center">
                                    <span className="pl-2 mr-1">
                                        Danh sách
                                    </span>
                                    <input type="number" className="p-2 border rounded-lg" />
                                    <span className="mx-1">
                                        khách hàng mua nhiều nhất
                                    </span>
                                    <select className="p-2 border rounded-lg">
                                        <option>có</option>
                                        <option>không</option>
                                    </select>
                                    <span className="ml-1">
                                        kèm tổng tiền mua hàng
                                    </span>
                                    <img
                                        src={iconStates[6] ? plus : minus} 
                                        alt={iconStates[6] ? "Add" : "Remove"} 
                                        className="w-5 h-5 cursor-pointer ml-auto" 
                                        onClick={() => toggleIcon(6)} 
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-center gap-4 p-4">
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700" onClick={() => setShowModal(false)}>LƯU</button>
                            <button className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500" onClick={() => setShowModal(false)}>THOÁT</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
