import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import Header from "../../components/Navbar/header";
import Footer from "../../components/Navbar/footer";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js"

import ava from "../../assets/images/avatar_white.svg";

function Settings() {
  const [headerToggle] = useOutletContext();
  const [footerToggle] = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [avatar, setAvatar] = useState(ava);
  const [avatarOrigin, setAvatarOrigin] = useState(ava);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  
  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };  

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
          setAvatarOrigin(userProfile.profilePicturePath);
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
  
  const handleSave = async () => {
    try {
      const userProfile = {
        agencyName: editData.agencyName,
        ownerName: editData.ownerName,
        address: editData.address,
        taxCode: editData.taxCode,
        phoneNumber: editData.phone,
        email: editData.email,
        profilePicturePath: avatar, 
      };
  
      const settings = [
        { category: "INVENTORY_PARAMS", key: "warning_expired", value: editData.warningDays },
        { category: "INVENTORY_PARAMS", key: "warning_out_of_stock", value: editData.warningStock },
        { category: "PRINT_FORMAT", key: "left_margin", value: editData.marginLeft },
        { category: "PRINT_FORMAT", key: "right_margin", value: editData.marginRight },
        { category: "PRINT_FORMAT", key: "top_margin", value: editData.marginTop },
        { category: "PRINT_FORMAT", key: "bottom_margin", value: editData.marginBottom },
        { category: "PRINT_FORMAT", key: "font_size", value: editData.fontSize }
      ];      
  
      const requestBody = { userProfile, settings };
      
      if (!/^\d{8,12}$/.test(editData.phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
      }
      if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
          alert("Email không hợp lệ!");
          return;
      }
      
      await axiosInstance.patch("/settings", requestBody);
  
      setData(editData);
      setAvatar(avatar);
      setAvatarOrigin(avatar);
      setIsEditing(false);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          alert("Tải thông tin thất bại!");
        } else if (status === 401) {
          alert("Bạn không có quyền truy cập vào trang này!");
        } else if (status === 500) {
          alert("Vui lòng tải lại trang!");
        }
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(data);
    setAvatar(avatarOrigin);
  };  

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "warningDays",
      "warningStock",
      "marginLeft",
      "marginRight",
      "marginTop",
      "marginBottom",
      "fontSize"
    ];
  
    let newValue = value;
  
    if (numericFields.includes(name)) {
      newValue = parseFloat(value);
      if (isNaN(newValue) || newValue < 1) {
        return;
      }
    }
  
    setEditData((prev) => ({ ...prev, [name]: newValue }));
  };  

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
  
    try {
        await axiosInstance.patch("/settings/password", {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
  
      alert("Mật khẩu đã được thay đổi thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          alert("Mật khẩu ít nhất 8 ký tự, bao gồm cả chữ cái viết hoa, viết thường, chữ số và ký tự đặc biệt!"); 
        } else if (status === 401) {
          alert("Mật khẩu hiện tại không đúng!");
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
        setAvatar(URL.createObjectURL(file));
      }
    } else if (typeof input === 'string') {
      const url = input.trim();
      if (url !== "") {
        const img = new Image();
        img.onload = () => {
          setAvatar(url);
        };
        img.onerror = () => {
          alert("URL không hợp lệ hoặc không phải ảnh!");
        };
        img.src = url;
      }
    }
  };

  const handleDeleteImage = () => {
    setAvatar(null);
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
                  <div className="relative">
                    <label className="p-2 block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                    <input
                      type={showPassword.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      placeholder="Mật khẩu hiện tại"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("currentPassword")}
                      className="absolute top-11 right-3"
                    >
                      <FontAwesomeIcon icon={showPassword.currentPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <div className="relative">
                    <label className="p-2 block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Mật khẩu mới"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("newPassword")}
                      className="absolute top-11 right-3"
                    >
                      <FontAwesomeIcon icon={showPassword.newPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <div className="relative">
                    <label className="p-2 block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("confirmPassword")}
                      className="absolute top-11 right-3"
                    >
                      <FontAwesomeIcon icon={showPassword.confirmPassword ? faEyeSlash : faEye} />
                    </button>
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
                          src={avatar || ava}
                          className="rounded-full w-28 h-28 object-cover border"
                          alt="profile"
                        />
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
                              onChange={(e) => setAvatar(e.target.value)}
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
