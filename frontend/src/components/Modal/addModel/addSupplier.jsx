import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance.js";

export default function AddSupplier(props) {
    const [showModal, setShowModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [supplierData, setSupplierData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
    });

    const handleChange = (e) => {
        setSupplierData({ ...supplierData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!supplierData.name || !supplierData.address || !supplierData.phone) {
            alert("Tên nhà cung cấp, địa chỉ và số điện thoại không được để trống!");
            return;
        }

        if (!/^\d{8,12}$/.test(supplierData.phone)) {
            alert("Số điện thoại không hợp lệ!");
            return;
        }

        if (supplierData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.email)) {
            alert("Email không hợp lệ!");
            return;
        }

        try {
            await axiosInstance.post("/suppliers", {
                supplierName: supplierData.name,
                address: supplierData.address,
                phoneNumber: supplierData.phone,
                email: supplierData.email,
            });

            setShowSaveModal(false);
            setShowModal(false);

            setSupplierData({
                name: "",
                address: "",
                phone: "",
                email: "",
            });

            if (props.refreshSuppliers) {
                props.refreshSuppliers();
            }
        } catch (error) {
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    alert("Tạo nhà cung cấp mới thất bại!");
                } else if (status === 401) {
                    alert("Bạn không có quyền truy cập vào trang này!");
                } else if (status === 500) {
                    alert("Vui lòng thử lại sau!");
                }
            }
        }
    };

    return (
        <>
            <div className="rounded-lg py-2 outline-none w-3/5 flex justify-end">
                <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 inline-flex items-center rounded-lg" onClick={() => setShowModal(true)}>
                    <span>THÊM NHÀ CUNG CẤP</span>
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-md w-[1000px] max-h-[650px] overflow-y-auto p-6">
                        <h3 className="text-2xl font-semibold text-center">Thêm nhà cung cấp mới</h3>
                        <form>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Tên nhà cung cấp <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={supplierData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Tên nhà cung cấp"
                                />
                            </div>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Địa chỉ <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="address"
                                    value={supplierData.address}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Địa chỉ"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={supplierData.phone}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="Số điện thoại"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={supplierData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="Email"
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-center gap-4 p-4">
                            <button
                                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                                onClick={() => setShowSaveModal(true)}
                            >
                                LƯU
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

            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-md w-[500px] p-6">
                        <h3 className="text-2xl font-semibold text-center">Xác nhận</h3>
                        <p className="my-4 text-gray-700 text-lg leading-relaxed text-center">
                            Bạn có muốn lưu lại thông tin về nhà cung cấp này?
                        </p>
                        <div className="flex justify-center gap-4 p-4">
                            <button
                                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                                onClick={handleSave}
                            >
                                XÁC NHẬN
                            </button>
                            <button
                                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                                onClick={() => setShowSaveModal(false)}
                            >
                                TRỞ LẠI
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
