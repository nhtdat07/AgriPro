import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";

import addPhoto from "../../../assets/images/addPhoto.png";

export default function AddProduct(props) {
    const [showModal, setShowModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [image, setImage] = useState(null);

    const [productData, setProductData] = useState({
        productName: "",
        brand: "",
        category: "",
        productionPlace: "",
        outPrice: "",
        usage: "",
        guideline: "",
        imagePath: ""
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setProductData({ ...productData, imagePath: "" });
        }
    };

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!productData.productName || !productData.brand || !productData.category || !productData.productionPlace || !productData.outPrice || !productData.usage || !productData.guideline) {
            alert("Vui lòng điền đầy đủ các trường thông tin!");
            return;
        }

        try {
            await axiosInstance.post("/products", {
                productName: productData.productName,
                brand: productData.brand,
                category: productData.category,
                productionPlace: productData.productionPlace,
                outPrice: parseFloat(productData.outPrice),
                usage: productData.usage,
                guideline: productData.guideline,
                imagePath: productData.imagePath || "",
            });

            setShowSaveModal(false);
            setShowModal(false);
            setProductData({
                productName: "",
                brand: "",
                category: "",
                productionPlace: "",
                outPrice: "",
                usage: "",
                guideline: "",
                imagePath: ""
            });
            setImage(null);
            if (props.refreshProducts) {
                props.refreshProducts();
            }
        } catch (error) {
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    alert("Tạo sản phẩm mới thất bại!");
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
                <button 
                    className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 inline-flex items-center rounded-lg"
                    onClick={() => setShowModal(true)}
                >
                    <span>THÊM SẢN PHẨM</span>
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-md w-[1000px] max-h-[650px] overflow-y-auto p-6">
                        <h3 className="text-2xl font-semibold text-center">Thêm sản phẩm mới</h3>
                        <form>
                            <div className="flex gap-4">
                                <div className="w-1/4 flex flex-col items-center">
                                    <label className="p-2 block text-sm font-medium text-gray-700">Ảnh sản phẩm</label>
                                    <div className="border p-2 flex items-center justify-center rounded-lg">
                                        <img src={image || addPhoto} className="object-cover w-40 h-48" alt="upload" />
                                    </div>
                                    <input type="file" className="hidden" id="imageUpload" onChange={handleImageUpload} />
                                    <div className="flex justify-center gap-4 p-4">
                                        <button 
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                document.getElementById('imageUpload').click(); 
                                            }}
                                        >
                                            THÊM ẢNH
                                        </button>
                                    </div>
                                </div>

                                <div className="w-3/4">
                                    <div>
                                        <label className="p-2 block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                                        <input 
                                            type="text" 
                                            name="productName"
                                            value={productData.productName}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg" 
                                            placeholder="Tên sản phẩm" 
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="p-2 block text-sm font-medium text-gray-700">Nhãn hiệu</label>
                                            <input 
                                                type="text" 
                                                name="brand"
                                                value={productData.brand}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Nhãn hiệu" 
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label className="p-2 block text-sm font-medium text-gray-700">Phân loại</label>
                                            <select 
                                                name="category"
                                                value={productData.category}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg min-h-[40px] bg-white"
                                            >
                                                <option disabled value="">Phân loại</option>
                                                <option value="THUỐC BẢO VỆ THỰC VẬT">THUỐC BẢO VỆ THỰC VẬT</option>
                                                <option value="PHÂN BÓN - ĐẤT TRỒNG">PHÂN BÓN - ĐẤT TRỒNG</option>
                                                <option value="HẠT GIỐNG - CÂY TRỒNG">HẠT GIỐNG - CÂY TRỒNG</option>
                                                <option value="NÔNG CỤ">NÔNG CỤ</option>
                                                <option value="GIA SÚC - GIA CẦM">GIA SÚC - GIA CẦM</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <label className="p-2 block text-sm font-medium text-gray-700">Nơi sản xuất</label>
                                            <input 
                                                type="text" 
                                                name="productionPlace"
                                                value={productData.productionPlace}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Nơi sản xuất" 
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label className="p-2 block text-sm font-medium text-gray-700">Giá bán</label>
                                            <input 
                                                type="text" 
                                                name="outPrice"
                                                value={productData.outPrice}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg" 
                                                placeholder="Giá bán" 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="p-2 block text-sm font-medium text-gray-700">Công dụng</label>
                                        <textarea 
                                            name="usage"
                                            value={productData.usage}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg h-20" 
                                            placeholder="Công dụng" 
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="p-2 block text-sm font-medium text-gray-700">Hướng dẫn sử dụng</label>
                                        <textarea 
                                            name="guideline"
                                            value={productData.guideline}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg h-20" 
                                            placeholder="Hướng dẫn sử dụng" 
                                        ></textarea>
                                    </div>
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
                            Bạn có muốn lưu lại thông tin về sản phẩm này?
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
