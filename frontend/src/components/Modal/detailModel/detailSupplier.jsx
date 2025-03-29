import React, { useState } from "react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ViewSupplier(props) {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierData, setSupplierData] = useState({
    name: props.name,
    address: props.address,
    phone: props.phone,
    email: props.email,
  });

  const handleChange = (e) => {
    setSupplierData({ ...supplierData, [e.target.name]: e.target.value });
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
            <h3 className="text-2xl font-semibold text-center">{isEditing ? "Chỉnh sửa thông tin" : "Chi tiết nhà cung cấp"}</h3>
            <form>
              <div>
                <label className="p-2 block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
                <input
                  type="text"
                  name="name"
                  value={supplierData.name}
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
                  value={supplierData.address}
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
                    value={supplierData.phone}
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
                    value={supplierData.email}
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
                  <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setIsEditing(false)}>LƯU</button>
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
              Bạn có muốn xóa nhà cung cấp này?
            </p>
            <div className="flex justify-center gap-4 p-4">
              <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => { setShowDeleteModal(false); setShowModal(false); }}>XÁC NHẬN</button>
              <button className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg" onClick={() => setShowDeleteModal(false)}>TRỞ LẠI</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}