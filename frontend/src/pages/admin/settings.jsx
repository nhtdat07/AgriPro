import React, { useState, useEffect } from "react";
import Header from "../../components/Navbar/header";
import Footer from "../../components/Navbar/footer";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js"

import ava from "../../assets/images/avatar_black.svg";

function Settings() {
  const [headerToggle] = useOutletContext();
  const [footerToggle] = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [avatar, setAvatar] = useState(ava);
  const [tempAvatar, setTempAvatar] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fields = [
    { key: "agencyName", label: "Tên đại lý" },
    { key: "ownerName", label: "Tên chủ đại lý" },
    { key: "address", label: "Địa chỉ" },
    { key: "taxCode", label: "Mã số thuế" },
    { key: "phone", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    { key: "warningDays", label: "Cảnh báo hết hạn sử dụng" },
    { key: "warningStock", label: "Cảnh báo hết hàng" },
    { key: "marginLeft", label: "Lề trái" },
    { key: "marginRight", label: "Lề phải" },
    { key: "marginTop", label: "Lề trên" },
    { key: "marginBottom", label: "Lề dưới" },
    { key: "fontSize", label: "Cỡ chữ" },
  ];
  
  const [data, setData] = useState({
    agencyName: "",
    ownerName: "",
    address: "",
    taxCode: "",
    phone: "",
    email: "",
    warningDays: 5,
    warningStock: 5,
    marginLeft: 3,
    marginRight: 2,
    marginTop: 2.5,
    marginBottom: 2.5,
    fontSize: 13,
  });

  const [editData, setEditData] = useState({ ...data });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get("/settings");
        const resData = res.data.data;
  
        const { userProfile, settings } = resData;
  
        const settingMap = {};
        settings.forEach((item) => {
          if (item.category === "INVENTORY_PARAMS") {
            if (item.key === "warning_expired") {
              settingMap.warningDays = parseInt(item.value, 10);
            } else if (item.key === "warning_out_of_stock") {
              settingMap.warningStock = parseInt(item.value, 10);
            }
          } else if (item.category === "PRINT_FORMAT") {
            if (item.key === "left_margin") {
              settingMap.marginLeft = parseFloat(item.value);
            } else if (item.key === "right_margin") {
              settingMap.marginRight = parseFloat(item.value);
            } else if (item.key === "top_margin") {
              settingMap.marginTop = parseFloat(item.value);
            } else if (item.key === "bottom_margin") {
              settingMap.marginBottom = parseFloat(item.value);
            } else if (item.key === "font_size") {
              settingMap.fontSize = parseInt(item.value, 10);
            }
          }
        });
  
        const newData = {
          agencyName: userProfile.agencyName || "",
          ownerName: userProfile.ownerName || "",
          address: userProfile.address || "",
          taxCode: userProfile.taxCode || "",
          phone: userProfile.phoneNumber || "",
          email: userProfile.email || "",
          ...settingMap,
        };
  
        setData(newData);
        setEditData(newData);
  
        if (userProfile.profilePicturePath) {
          setAvatar(userProfile.profilePicturePath);
        }
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 401) {
            alert("Bạn không có quyền truy cập vào trang này!");
          } else if (status === 500) {
            alert("Vui lòng tải lại trang!");
          }
        }  
      }
    };
  
    fetchSettings();
  }, []);  

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setData(editData);
    if (tempAvatar !== null) {
      setAvatar(tempAvatar);
    }
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditData({ ...data });
    setTempAvatar(null);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    alert("Mật khẩu đã được thay đổi thành công");
    setIsChangingPassword(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setTempAvatar(null);
  };

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Header toggle={headerToggle} />
        
        <div className="flex-grow">
          <h2 className="pt-4 pl-4 text-2xl font-bold mb-4">Cài đặt</h2>
      
          <div className="px-4">
            {isChangingPassword ? (
              <div className="bg-white rounded-lg shadow-md w-full p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Đổi mật khẩu</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="p-2 block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Mật khẩu hiện tại"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="p-2 block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Mật khẩu mới"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="p-2 block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleChangePassword}
                      className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg"
                    >
                      LƯU
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(false)}
                      className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg"
                    >
                      HỦY
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md relative mb-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Thông tin tài khoản & đại lý
                  </h3>
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold mb-2">Ảnh đại diện</p>
                      <div className="relative flex flex-col items-center">
                        <img
                          src={isEditing ? (tempAvatar || avatar) : avatar}
                          className="rounded-full w-28 h-28 object-cover border"
                          alt="profile"
                        />
                        {isEditing && (
                          <div className="flex flex-col items-center gap-2 mt-2">
                            <label className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-3 py-1 rounded-lg text-sm cursor-pointer">
                              THÊM ẢNH
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                            <button
                              className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-3 py-1 rounded-lg text-sm"
                              onClick={handleDeleteImage}
                            >
                              XÓA ẢNH
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1">
                      {fields.slice(0, 6).map(({ key, label }) => (
                        <div key={key}>
                          <p><strong>{label}</strong></p>
                          {isEditing ? (
                            <input
                              type="text"
                              name={key}
                              value={editData[key]}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg"
                            />
                          ) : (
                            <p>{data[key]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg"
                      >
                        ĐỔI MẬT KHẨU
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md relative mb-6">
                  <h3 className="text-xl font-semibold">Cài đặt thông báo</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {fields.slice(6, 8).map(({ key, label }, index) => (
                      <div key={key}>
                        <p><strong>{label}</strong></p>
                        {isEditing ? (
                          <div className="flex items-center">
                            <span className="mr-1">
                              {index === 0 ? "Cảnh báo trước" : "Cảnh báo sau"}
                            </span>
                            <input
                              type="number"
                              name={key}
                              value={editData[key]}
                              onChange={handleChange}
                              className="p-2 border rounded-lg"
                            />
                            <span className="ml-1">
                              {index === 0 ? "ngày" : "mặt hàng"}
                            </span>
                          </div>
                        ) : (
                          <p>
                            {index === 0
                              ? `Cảnh báo trước ${data[key]} ngày`
                              : `Cảnh báo khi còn ${data[key]} sản phẩm`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
      
                <div className="bg-white p-6 rounded-lg shadow-md relative mb-6">
                  <h3 className="text-xl font-semibold">Định dạng báo cáo & hóa đơn</h3>
                  <div className="grid grid-cols-5 gap-4 mt-4">
                    {fields.slice(8).map(({ key, label }, index) => (
                      <div key={key}>
                        <p><strong>{label}</strong></p>
                        {isEditing ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              name={key}
                              value={editData[key]}
                              onChange={handleChange}
                              className="p-2 border rounded-lg"
                            />
                            {index < 4 && <span className="ml-1">cm</span>}
                          </div>
                        ) : (
                          <p>
                            {data[key]} {index < 4 ? "cm" : ""}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex gap-4 mt-4 justify-center">
                    <button
                      onClick={handleSave}
                      className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg mb-6"
                    >
                      LƯU
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg mb-6"
                    >
                      HỦY
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleEdit}
                      className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 rounded-lg mb-6"
                    >
                      CHỈNH SỬA
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Footer toggle={footerToggle} />
      </main>
    </>
  );
}

export default Settings;
