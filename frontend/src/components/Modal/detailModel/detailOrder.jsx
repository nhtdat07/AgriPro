import React, { useState, useEffect } from "react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../../utils/axiosInstance";

export default function ViewOrder(props) {
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const orderRes = await axiosInstance.get(`/purchase-orders/${props.code}`);
      const order = orderRes.data.data;

      const products = order.products.map((product, index) => ({
        id: index + 1,
        name: product.productName,
        exp_date: new Date(product.expiredDate).toLocaleDateString("vi-VN"),
        quantity: product.quantity,
        price: product.inPrice,
        total: product.totalPrice,
      }));

      setOrderData({
        code: order.purchaseOrderId,
        supplier: order.supplierName,
        products,
      });
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          alert("Tải thông tin thất bại!");
        } else if (status === 401) {
          alert("Bạn không có quyền truy cập vào trang này!");
        } else if (status === 404) {
          alert("Đơn nhập hàng này hiện không tồn tại!");
        } else if (status === 500) {
          alert("Vui lòng tải lại trang!");
        }
      }  
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const totalAmount = orderData
    ? orderData.products.reduce((sum, product) => sum + product.total, 0)
    : 0;

  return (
    <>
      <FontAwesomeIcon
        icon={faEllipsisVertical}
        className="text-gray-500 inline-flex px-2 rounded text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer"
        onClick={() => setShowModal(true)}
      />
      {showModal && orderData && (
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
                        <td className="p-2">{product.total.toLocaleString()}</td>
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
