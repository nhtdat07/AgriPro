import React, { useState } from "react";

export default function AddSupplier() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="rounded-md py-2 outline-none w-3/5 flex justify-end">
                <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white font-medium px-4 py-2 inline-flex items-center rounded-md" onClick={() => setShowModal(true)}>
                    <span>THÊM NHÀ CUNG CẤP</span>
                </button>
            </div>
            {showModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-[700px] p-6">
                        <h3 className="text-2xl font-semibold text-center">Thêm nhà cung cấp mới</h3>
                        <form>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
                                <input type="text" className="w-full p-2 border rounded-md" placeholder="Tên nhà cung cấp" />
                            </div>
                            <div>
                                <label className="p-2 block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input type="text" className="w-full p-2 border rounded-md" placeholder="Địa chỉ" />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input type="text" className="w-full p-2 border rounded-md" placeholder="Số điện thoại" />
                                </div>
                                <div className="w-1/2">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" className="w-full p-2 border rounded-md" placeholder="Email" />
                                </div>
                            </div>
                        </form>
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
