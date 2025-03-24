import React, { useState } from "react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ViewOrder(props) {
  const [showModal, setShowModal] = useState(false);
  const orderData = {
    code: props.code,
    supplier: props.supplier,
    products: [
      { id: 1, name: "Thuốc trừ bệnh cây trồng COC85 - Gói 20 gram", exp_date: "30/04/2025", quantity: 50, price: 13000 },
      { id: 2, name: "Thuốc trừ rệp sáp CONFIDOR 200SL", exp_date: "15/06/2025", quantity: 40, price: 185000 },
    ],
  };

  const totalAmount = orderData.products.reduce((sum, product) => sum + product.quantity * product.price, 0);

  return (
    <>
      <FontAwesomeIcon
        icon={faEllipsisVertical}
        className="text-gray-500 inline-flex px-2 rounded text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md w-[1200px] max-h-[650px] overflow-y-auto p-6">
            <h3 className="text-2xl font-semibold text-center">Thông tin đơn nhập hàng</h3>
            <div className="flex gap-4">
              <div className="w-1/4">
                <label className="p-2 block text-sm font-medium text-gray-700">Mã số</label>
                <input type="text" value={orderData.code} disabled className="w-full p-2 border rounded-lg" />
              </div>
              <div className="w-3/4">
                <label className="p-2 block text-sm font-medium text-gray-700">Nhà cung cấp</label>
                <input type="text" value={orderData.supplier} disabled className="w-full p-2 border rounded-lg" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-center p-2 mt-5">Danh sách sản phẩm</h4>
            <div className="p-2 block text-sm font-medium text-gray-700">
              <div className="w-full overflow-auto max-h-[200px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-center border-b">
                      <th className="p-2">STT</th>
                      <th className="p-2">Tên sản phẩm</th>
                      <th className="p-2">Hạn dùng</th>
                      <th className="p-2">Số lượng</th>
                      <th className="p-2">Giá nhập</th>
                      <th className="p-2">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.products.map((product, index) => (
                      <tr key={product.id} className="text-center">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.exp_date}</td>
                        <td className="p-2">{product.quantity}</td>
                        <td className="p-2">{product.price.toLocaleString()}</td>
                        <td className="p-2">{(product.quantity * product.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>  
            <div className="text-lg font-semibold text-right p-2 mt-5">TỔNG CỘNG: {totalAmount.toLocaleString()}</div>
            <div className="flex justify-center gap-4 p-4">
              <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowModal(false)}>THOÁT</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
