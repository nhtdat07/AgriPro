import React, { useState } from "react";

import trashBin from "../../../assets/images/delete.png";
import plus from "../../../assets/images/plus.png";

export default function AddIvoice() {
    const [showModal, setShowModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [products, setProducts] = useState([{ id: 1, name: "", quantity:"", price:"", total:"" }]);

    const codeData = { code: "BH0000000346" };

    const addProduct = () => {
        setProducts([...products, { id: products.length + 1, name: "", quantity:"", price:"", total:"" }]);
    };

    const removeProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const resetForm = () => {
        setProducts([{ id: 1, name: "", quantity: "", price: "", total: "" }]);
    };

    const handleInputChange = (id, field, value) => {
        setProducts(products.map(product => 
            product.id === id 
                ? { ...product, [field]: value, total: field === "quantity" || field === "price" ? (field === "quantity" ? value * product.price : product.quantity * value) : product.total }
                : product
        ));
    };

    const totalAmount = products.reduce((sum, product) => sum + product.total, 0);

    return (
        <>
            <div className="rounded-lg py-2 outline-none w-3/5 flex justify-end">
                <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 inline-flex items-center rounded-lg" onClick={() => setShowModal(true)}>
                    <span>THÊM HÓA ĐƠN</span>
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-md w-[1200px] max-h-[650px] overflow-y-auto p-6">
                        <h3 className="text-2xl font-semibold text-center">Thêm hóa đơn mới</h3>
                        <div className="flex gap-4">
                            <div className="w-1/4">
                                <label className="p-2 block text-sm font-medium text-gray-700">Mã số</label>
                                <input type="text" className="w-full p-2 border rounded-lg" value={codeData.code} disabled />
                            </div>
                            <div className="w-3/4">
                                <label className="p-2 block text-sm font-medium text-gray-700">Khách hàng</label>
                                <select className="w-full p-2 border rounded-lg">
                                    <option disabled selected>Khách hàng</option>
                                    <option>Khách hàng</option>
                                </select>
                            </div>
                        </div>
                        <h4 className="text-lg font-semibold text-center p-2 mt-5">Danh sách sản phẩm</h4>
                        <div className="p-2 block text-sm font-medium text-gray-700">
                            <div className="w-full overflow-auto max-h-[200px]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-center border-b">
                                            <th className="p-2">STT</th>
                                            <th className="p-2 w-1/2">Tên sản phẩm</th>
                                            <th className="p-2 w-32">Số lượng</th>
                                            <th className="p-2 w-48">Giá bán</th>
                                            <th className="p-2 w-48">Thành tiền</th>
                                            <th className="p-2 w-24 text-white">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <tr key={product.id}>
                                                <td className="p-2 text-center">{index + 1}</td>
                                                <td className="p-2">
                                                    <select className="w-full p-2 border rounded-lg">
                                                        <option disabled selected>Tên sản phẩm</option>
                                                        <option>Tên sản phẩm</option>
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <input 
                                                        type="number" 
                                                        className="w-full p-2 border rounded-lg" 
                                                        value={product.quantity} 
                                                        onChange={(e) => handleInputChange(product.id, "quantity", Number(e.target.value))} 
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input 
                                                        type="number" 
                                                        className="w-full p-2 border rounded-lg" 
                                                        value={product.price} 
                                                        onChange={(e) => handleInputChange(product.id, "price", Number(e.target.value))} 
                                                    />
                                                </td>
                                                <td className="p-2 text-center">{(product.quantity * product.price).toLocaleString()}</td>
                                                <td className="p-2 text-center">
                                                    <button onClick={() => removeProduct(product.id)}>
                                                        <img src={trashBin} alt="Delete" className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <button className="flex items-center gap-2 px-4" onClick={addProduct}>
                                <img src={plus} alt="Add" className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-lg font-semibold text-right p-2 mt-5">TỔNG CỘNG: {totalAmount.toLocaleString()}</div>
                        <div className="flex justify-center gap-4 p-4">
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowSaveModal(true)}>LƯU</button>
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowModal(false)}>THOÁT</button>
                        </div>
                    </div>
                </div>
            )}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-md w-[500px] p-6">
                        <h3 className="text-2xl font-semibold text-center">Lưu ý</h3>
                        <p className="my-4 text-gray-700 text-lg leading-relaxed text-center">
                            Bạn có muốn lưu lại thông tin về hóa đơn này?
                        </p>
                        <div className="flex justify-center gap-4 p-4">
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => { setShowSaveModal(false); setShowModal(false); resetForm(); }}>XÁC NHẬN</button>
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowSaveModal(false)}>TRỞ LẠI</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
