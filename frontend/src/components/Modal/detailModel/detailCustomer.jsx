import React, { useState, useEffect } from "react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../../../utils/axiosInstance";

export default function ViewCustomer(props) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const fetchCustomerDetails = async () => {
    try {
      const customerRes = await axiosInstance.get(`/customers/${props.code}`);
      const data = customerRes.data.data;
      setCustomerData({
        name: data.customerName,
        address: data.address,
        phone: data.phoneNumber.trim(),
        email: data.email,
      });
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          alert("Bad Request!");
        } else if (status === 401) {
          alert("Bạn không có quyền truy cập vào trang này!");
        } else if (status === 404) {
          alert("Khách hàng này hiện không tồn tại!");
        } else if (status === 500) {
          alert("Vui lòng tải lại trang!");
        }
      }  
    }
  };

  const handleSave = async () => {
    if (!customerData.name || !customerData.address || !customerData.phone) {
      alert("Tên khách hàng, địa chỉ và số điện thoại không được để trống!");
      return;
    }
  
    if (customerData.phone.length !== 10 || !/^\d{10}$/.test(customerData.phone)) {
      alert("Số điện thoại phải có 10 chữ số!");
      return;
    }
  
    try {
      await axiosInstance.patch(`/customers/${props.code}`, {
        customerName: customerData.name,
        address: customerData.address,
        phoneNumber: customerData.phone,
        email: customerData.email,
      });
  
      fetchCustomerDetails();
      setIsEditing(false);
  
      if (props.refreshCustomers) {
        props.refreshCustomers();
      }
    } catch (error) {
      console.error("Failed to update customer", error);
    }
  };  

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/customers/${props.code}`);
      setShowDeleteModal(false);
      setShowModal(false);
      if (props.refreshCustomers) {
        props.refreshCustomers();
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          alert("Bad Request!");
        } else if (status === 401) {
          alert("Bạn không có quyền truy cập vào trang này!");
        } else if (status === 404) {
          alert("Nhà cung cấp này hiện không tồn tại!");
        } else if (status === 500) {
          alert("Vui lòng tải lại trang!");
        }
      }  
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchCustomerDetails();
    }
  }, [showModal]);

  const handleChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <FontAwesomeIcon
        icon={faEllipsisVertical}
        className="text-gray-500 inline-flex px-2 rounded text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md w-[1000px] max-h-[650px] overflow-y-auto p-6">
            <h3 className="text-2xl font-semibold text-center">{isEditing ? "Chỉnh sửa thông tin" : "Chi tiết khách hàng"}</h3>
            <form>
              <div>
                <label className="p-2 block text-sm font-medium text-gray-700">Tên khách hàng</label>
                <input
                  type="text"
                  name="name"
                  value={customerData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="p-2 block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={customerData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
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
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="w-1/2">
                  <label className="p-2 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-center gap-4 p-4">
              {!isEditing ? (
                <>
                  <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowDeleteModal(true)}>XÓA</button>
                  <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setIsEditing(true)}>CHỈNH SỬA</button>
                  <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowModal(false)}>THOÁT</button>
                </>
              ) : (
                <>
                  <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={handleSave}>LƯU</button>
                  <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setIsEditing(false)}>THOÁT</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md w-[500px] p-6">
            <h3 className="text-2xl font-semibold text-center">Lưu ý</h3>
            <p className="my-4 text-gray-700 text-lg leading-relaxed text-center">
              Bạn có muốn xóa khách hàng này?
            </p>
            <div className="flex justify-center gap-4 p-4">
              <button
                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                onClick={handleDelete}
              >
                XÁC NHẬN
              </button>
              <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowDeleteModal(false)}>TRỞ LẠI</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
