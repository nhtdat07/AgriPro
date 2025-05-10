import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";

export default function DetailProduct({ code, onClose, refreshProducts }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editableProduct, setEditableProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [image, setImage] = useState(null);

    const fetchProductDetails = async () => {
        try {
            const productRes = await axiosInstance.get(`/products/${code}`);
            const data = productRes.data.data;

            const mappedData = {
                name: data.productName,
                brand: data.brand,
                category: data.category,
                origin: data.productionPlace,
                price: data.outPrice,
                usage: data.usage,
                guideline: data.guideline,
                photo: data.imagePath,
                quantity: data.availableQuantity,
            };

            setEditableProduct(mappedData);
            setImage(data.imagePath);
        } catch (error) {
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    alert("Tải thông tin thất bại!");
                } else if (status === 401) {
                    alert("Bạn không có quyền truy cập vào trang này!");
                } else if (status === 404) {
                    alert("Sản phẩm này hiện không tồn tại!");
                } else if (status === 500) {
                    alert("Vui lòng tải lại trang!");
                }
            }
        }
    };

    useEffect(() => {
        if (code) {
            fetchProductDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    const handleInputChange = (field, value) => {
        setEditableProduct({ ...editableProduct, [field]: value });
    };

    const handleSave = async () => {
        const price = Number(editableProduct.price);
        const maxSafe = Number.MAX_SAFE_INTEGER;

        if (
            isNaN(price) ||
            !Number.isInteger(price) ||
            price < 0 ||
            price > maxSafe
        ) {
            alert("Giá bán không hợp lệ!");
            return;
        }

        try {
            await axiosInstance.patch(`/products/${code}`, {
                productName: editableProduct.name,
                brand: editableProduct.brand,
                category: editableProduct.category,
                productionPlace: editableProduct.origin,
                outPrice: editableProduct.price,
                usage: editableProduct.usage,
                guideline: editableProduct.guideline,
                imagePath: editableProduct.photo,
                availableQuantity: editableProduct.quantity
            });
            setIsEditing(false);
            refreshProducts();
        } catch (error) {
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    alert("Cập nhật thông tin thất bại!");
                } else if (status === 401) {
                    alert("Bạn không có quyền truy cập vào trang này!");
                } else if (status === 404) {
                    alert("Sản phẩm này hiện không tồn tại!");
                } else if (status === 500) {
                    alert("Vui lòng tải lại trang!");
                }
            }
        }
    };    

    const handleImageChange = (input) => {
        if (input?.target?.files) {
          const file = input.target.files[0];
          if (file) {
            setEditableProduct({ ...editableProduct, photo: URL.createObjectURL(file) });
          }
        } else if (typeof input === 'string') {
          const url = input.trim();
          if (url !== "") {
            const img = new Image();
            img.onload = () => {
                setEditableProduct({ ...editableProduct, photo: URL.createObjectURL(url) });
            };
            img.onerror = () => {
              alert("URL không hợp lệ hoặc không phải ảnh!");
            };
            img.src = url;
          }
        }
    };

    const handleDeleteImage = () => {
        setEditableProduct({ ...editableProduct, photo: image });
    };

    const handleDeleteConfirm = async () => {
        try {
            await axiosInstance.delete(`/products/${code}`);
            setShowDeleteModal(false);
            refreshProducts();
            onClose();
        } catch (error) {
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    alert("Xóa thông tin thất bại!");
                } else if (status === 401) {
                    alert("Bạn không có quyền truy cập vào trang này!");
                } else if (status === 404) {
                    alert("Sản phẩm này hiện không tồn tại!");
                } else if (status === 500) {
                    alert("Vui lòng tải lại trang!");
                }
            }
        }
    };    

    if (!editableProduct) return null;

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
                          <div className="flex flex-col items-center gap-2 mt-2">
                            <label className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-3 py-1 rounded-lg text-sm cursor-pointer">
                              THÊM ẢNH
                              <input
                                type="file"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>

                            <input
                              type="text"
                              onChange={(e) => setEditableProduct({ ...editableProduct, photo: e.target.value })}
                              placeholder="Hoặc dán URL ảnh..."
                              className="p-1 border rounded text-sm w-40"
                            />
                            <button
                              className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-3 py-1 rounded-lg text-sm"
                              onClick={handleDeleteImage}
                            >
                              XÓA ẢNH
                            </button>
                          </div>
                        )}
                    </div>
                    <div className="w-3/4">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label className="p-2 block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableProduct.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="w-full p-2 border rounded-lg min-h-[40px]"
                                    />
                                ) : (
                                    <p className="w-full p-2 border rounded-lg min-h-[40px]">{editableProduct.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="p-2 block text-sm font-medium text-gray-700">Nhãn hiệu</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableProduct.brand}
                                        onChange={(e) => handleInputChange("brand", e.target.value)}
                                        className="w-full p-2 border rounded-lg min-h-[40px]"
                                    />
                                ) : (
                                    <p className="w-full p-2 border rounded-lg min-h-[40px]">{editableProduct.brand}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label className="p-2 block text-sm font-medium text-gray-700">Phân loại</label>
                                {isEditing ? (
                                    <select
                                        value={editableProduct.category}
                                        onChange={(e) => handleInputChange("category", e.target.value)}
                                        className="w-full p-2 border rounded-lg min-h-[40px] bg-white"
                                    >
                                        <option disabled selected>Phân loại</option>
                                        <option value="THUỐC BẢO VỆ THỰC VẬT">THUỐC BẢO VỆ THỰC VẬT</option>
                                        <option value="PHÂN BÓN - ĐẤT TRỒNG">PHÂN BÓN - ĐẤT TRỒNG</option>
                                        <option value="HẠT GIỐNG - CÂY TRỒNG">HẠT GIỐNG - CÂY TRỒNG</option>
                                        <option value="NÔNG CỤ">NÔNG CỤ</option>
                                        <option value="GIA SÚC - GIA CẦM">GIA SÚC - GIA CẦM</option>
                                    </select>
                                ) : (
                                    <p className="w-full p-2 border rounded-lg min-h-[40px]">{editableProduct.category}</p>
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
                                        className="w-full p-2 border rounded-lg min-h-[40px]"
                                    />
                                ) : (
                                    <p className="w-full p-2 border rounded-lg min-h-[40px]">{editableProduct.origin}</p>
                                )}
                            </div>
                            <div className="w-1/4">
                                <label className="p-2 block text-sm font-medium text-gray-700">Giá bán</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableProduct.price}
                                        onChange={(e) => handleInputChange("price", e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="w-full p-2 border rounded-lg">{`${editableProduct.price} `}</p>
                                )}
                            </div>
                            <div className="w-1/4">
                            <label className="p-2 block text-sm font-medium text-gray-700">Số lượng hiện có</label>
                                <p className="w-full p-2 border rounded-lg min-h-[40px]">{editableProduct.quantity}</p>
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
                                    value={editableProduct.guideline}
                                    onChange={(e) => handleInputChange("guideline", e.target.value)}
                                    className="w-full p-2 border rounded-lg h-20 overflow-auto"
                                />
                            ) : (
                                <p className="w-full p-2 border rounded-lg h-20 overflow-auto">{editableProduct.guideline}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-4 p-4">
                    {isEditing ? (
                        <>
                            <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={handleSave}>LƯU</button>
                            <button
                                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                                onClick={async () => {
                                    await fetchProductDetails();
                                    setIsEditing(false);
                                }}
                            >
                                HỦY
                            </button>
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
                            <h3 className="text-2xl font-semibold text-center">Xác nhận</h3>
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
