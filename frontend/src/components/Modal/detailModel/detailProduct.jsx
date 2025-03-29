import React, { useState } from "react";

export default function DetailProduct({ product, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editableProduct, setEditableProduct] = useState({ ...product }); 
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleInputChange = (field, value) => {
        setEditableProduct({ ...editableProduct, [field]: value });
    };

    const handleSave = () => { setIsEditing(false) };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditableProduct({ ...editableProduct, photo: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageDelete = () => {
        setEditableProduct({ ...editableProduct, photo: "" });
    };

    const handleDeleteConfirm = () => {
        setShowDeleteModal(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-[1000px] max-h-[650px] overflow-y-auto p-6">
                <h3 className="text-2xl font-semibold text-center">
                    {isEditing ? "Chỉnh sửa thông tin" : "Chi tiết sản phẩm"}
                </h3>
                <div className="flex gap-4 mt-4">
                    <div className="w-1/4 flex flex-col items-center">
                        <label className="p-2 block text-sm font-medium text-gray-700">Ảnh sản phẩm</label>
                        <div className="border p-2 flex items-center justify-center rounded-lg">
                            {editableProduct.photo ? (
                                <img
                                    src={editableProduct.photo}
                                    className="object-cover w-40 h-48"
                                    alt={editableProduct.name}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-40 h-48 bg-gray-200">
                                    <span className="text-gray-500">Không có ảnh</span>
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <div className="flex gap-2 mt-2">
                                <label htmlFor="image-upload" className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg cursor-pointer">THAY ĐỔI</label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg" onClick={handleImageDelete}>XÓA ẢNH</button>
                            </div>
                        )}
                    </div>
                    <div className="w-3/4">
                        <div>
                            <label className="p-2 block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editableProduct.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            ) : (
                                <p className="w-full p-2 border rounded-lg">{editableProduct.name}</p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="p-2 block text-sm font-medium text-gray-700">Nhãn hiệu</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableProduct.brand}
                                        onChange={(e) => handleInputChange("brand", e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="w-full p-2 border rounded-lg">{editableProduct.brand}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label className="p-2 block text-sm font-medium text-gray-700">Phân loại</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableProduct.category}
                                        onChange={(e) => handleInputChange("category", e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="w-full p-2 border rounded-lg">{editableProduct.category}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="p-2 block text-sm font-medium text-gray-700">Nơi sản xuất</label>
                                {isEditing ? (
                                        <input
                                        type="text"
                                        value={editableProduct.origin}
                                        onChange={(e) => handleInputChange("origin", e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="w-full p-2 border rounded-lg">{product.origin}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label className="p-2 block text-sm font-medium text-gray-700">Giá bán</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableProduct.price}
                                        onChange={(e) => handleInputChange("price", e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="w-full p-2 border rounded-lg">{`${product.price} VNĐ`}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="p-2 block text-sm font-medium text-gray-700">Công dụng</label>
                            {isEditing ? (
                                <textarea
                                    value={editableProduct.usage}
                                    onChange={(e) => handleInputChange("usage", e.target.value)}
                                    className="w-full p-2 border rounded-lg h-20"
                                />
                            ) : (
                                <p className="w-full p-2 border rounded-lg h-20 overflow-auto">
                                    {editableProduct.usage}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="p-2 block text-sm font-medium text-gray-700">Hướng dẫn sử dụng</label>
                            {isEditing ? (
                                <textarea
                                    value={editableProduct.instructions}
                                    onChange={(e) => handleInputChange("instructions", e.target.value)}
                                    className="w-full p-2 border rounded-lg h-20 overflow-auto"
                                />
                            ) : (
                                <p className="w-full p-2 border rounded-lg h-20 overflow-auto">{product.instructions}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-4 p-4">
                    {isEditing ? (
                        <>
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={handleSave}>LƯU</button>
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setIsEditing(false)}>HỦY</button>
                        </>
                    ) : (
                        <>
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowDeleteModal(true)}>XÓA</button>
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setIsEditing(true)}>CHỈNH SỬA</button>
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={onClose}>THOÁT</button>
                        </>
                    )}
                </div>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-md w-[500px] p-6">
                            <h3 className="text-2xl font-semibold text-center">Lưu ý</h3>
                            <p className="my-4 text-gray-700 text-lg leading-relaxed text-center">
                                Bạn có muốn xóa sản phẩm này?
                            </p>
                            <div className="flex justify-center gap-4 p-4">
                                <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={handleDeleteConfirm}>XÁC NHẬN</button>
                                <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowDeleteModal(false)}>TRỞ LẠI</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
