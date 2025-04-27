import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance.js";

export default function AddCustomer(props) {
    const [showModal, setShowModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [customerData, setCustomerData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
    });

    const handleChange = (e) => {
        setCustomerData({ ...customerData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!customerData.name || !customerData.address || !customerData.phone) {
            alert("Tên khách hàng, địa chỉ và số điện thoại không được để trống!");
            return;
        }

        if (customerData.phone.length !== 10 || !/^0\d{9}$/.test(customerData.phone)) {
            alert("Số điện thoại không hợp lệ!");
            return;
        }

        if (customerData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
            alert("Email không hợp lệ!");
            return;
        }

        try {
            await axiosInstance.post("/customers", {
                customerName: customerData.name,
                address: customerData.address,
                phoneNumber: customerData.phone,
                email: customerData.email,
            });

            setShowSaveModal(false);
            setShowModal(false);

            setCustomerData({
                name: "",
                address: "",
                phone: "",
                email: "",
            });

            if (props.refreshCustomers) {
                props.refreshCustomers();
            }
        } catch (error) {
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    alert("Tạo khách hàng mới thất bại!");
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
                    <span>THÊM KHÁCH HÀNG</span>
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-md w-[1000px] max-h-[650px] overflow-y-auto p-6">
                        <h3 className="text-2xl font-semibold text-center">Thêm khách hàng mới</h3>
                        <form>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Tên khách hàng</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={customerData.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Tên khách hàng"
                                />
                            </div>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={customerData.address}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Địa chỉ"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={customerData.phone}
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
                                        value={customerData.email}
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
                        <h3 className="text-2xl font-semibold text-center">Lưu ý</h3>
                        <p className="my-4 text-gray-700 text-lg leading-relaxed text-center">
                            Bạn có muốn lưu lại thông tin về khách hàng này?
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
