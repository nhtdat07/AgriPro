import React, { useState } from "react";

import addLine from "../../../assets/images/plus.png";
import deleteLine from "../../../assets/images/plus.png";

export default function AddOrder() {
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([{ id: 1, name: "", expiry: "", quantity: "", price: "" }]);

    const addProduct = () => {
        setProducts([...products, { id: products.length + 1, name: "", expiry: "", quantity: "", price: "" }]);
    };

    const removeProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    return (
        <>
            <div className="rounded-md py-2 outline-none w-3/5 flex justify-end">
                <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white font-medium px-4 py-2 inline-flex items-center rounded-md" onClick={() => setShowModal(true)}>
                    <span>THÊM ĐƠN NHẬP</span>
                </button>
            </div>
            {showModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-[800px] p-6">
                        <h3 className="text-2xl font-semibold text-center">Thêm đơn nhập hàng mới</h3>
                        <div className="mb-4">
                            <div className="flex justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mã số</label>
                                    <input type="text" className="p-2 border rounded-md w-40" value="NH0000000040" disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nhà cung cấp</label>
                                    <select className="p-2 border rounded-md w-64">
                                        <option>Nhà cung cấp</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <h4 className="text-lg font-semibold mt-4">Danh sách sản phẩm</h4>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">STT</th>
                                    <th className="border p-2">Tên sản phẩm</th>
                                    <th className="border p-2">Hạn dùng</th>
                                    <th className="border p-2">Số lượng</th>
                                    <th className="border p-2">Giá nhập</th>
                                    <th className="border p-2">Thành tiền</th>
                                    <th className="border p-2">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id}>
                                        <td className="border p-2 text-center">{index + 1}</td>
                                        <td className="border p-2">
                                            <select className="w-full p-2 border rounded-md">
                                                <option>Tên sản phẩm</option>
                                            </select>
                                        </td>
                                        <td className="border p-2"><input type="date" className="w-full p-2 border rounded-md" /></td>
                                        <td className="border p-2"><input type="number" className="w-full p-2 border rounded-md" /></td>
                                        <td className="border p-2"><input type="text" className="w-full p-2 border rounded-md" /></td>
                                        <td className="border p-2 text-center">0</td>
                                        <td className="border p-2 text-center">
                                            <button onClick={() => removeProduct(product.id)}>
                                                <img src={deleteLine} alt="Delete" className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-start mt-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={addProduct}>
                                <img src={addLine} alt="Add" className="w-5 h-5" /> Thêm sản phẩm
                            </button>
                        </div>
                        <div className="text-right mt-4 font-semibold text-lg">TỔNG CỘNG: 0</div>
                        <div className="flex justify-center gap-4 p-4">
                            <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700" onClick={() => setShowModal(false)}>LƯU</button>
                            <button className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500" onClick={() => setShowModal(false)}>THOÁT</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
