import React, { useState } from "react";
import Navbar from "../../components/Navbar/Index";
import { useOutletContext } from "react-router-dom";

import InventoryTable from "../../components/Modal/tableModel/inventoryTable";
import PurchaseTable from "../../components/Modal/tableModel/purchaseTable";
import ProductTable from "../../components/Modal/tableModel/productTable";
import SupplierTable from "../../components/Modal/tableModel/supplierTable";
import AddOrder from "../../components/Modal/addModel/addOrder";
import AddProduct from "../../components/Modal/addModel/addProduct";
import AddSupplier from "../../components/Modal/addModel/addSupplier";

import searchIcon from "../../assets/images/search.svg";

function InventoryPurchase() {
  const [sidebarToggle] = useOutletContext();
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  const dataHeaderInventory = 
  [ {key: "id", label: "STT"},
    {key: "name", label: "Tên sản phẩm"},
    {key: "quantity", label: "Số lượng"},
    {key: "import_date", label: "Ngày nhập kho"},
    {key: "exp", label: "Hạn dùng"},
    {key: "import_price", label: "Giá nhập"}
  ];

  const dataHeaderPurchase = 
  [ {key: "id", label: "STT"},
    {key: "code", label: "Mã số"},
    {key: "timestamp", label: "Thời gian nhập kho"},
    {key: "supplier", label: "Nhà cung cấp"},
    {key: "action", label: ""},
  ];

  const dataHeaderProduct = 
  [ {key: "photo", label: "Link ảnh"},
    {key: "name", label: "Tên sản phẩm"},
    {key: "category", label: "Phân loại"},
    {key: "price", label: "Giá bán"}
  ];

  const dataHeaderSupplier = 
  [ {key: "id", label: "STT"},
    {key: "name", label: "Tên nhà cung cấp"},
    {key: "address", label: "Địa chỉ"},
    {key: "phone", label: "Số điện thoại"},
    {key: "email", label: "Email"},
    {key: "action", label: ""},
  ];

  const dataInventory = [
    {
      id: 1,
      name: "Thuốc trừ bệnh cây trồng COC85 - Gói 20 gram",
      quantity: "39",
      import_date: "11/11/2024",
      exp: "30/06/2025",
      import_price: "13.000"
    },
    {
      id: 2,
      name: "Thuốc trừ rệp sáp CONFIDOR 200SL",
      quantity: "38",
      import_date: "11/11/2024",
      exp: "20/07/2025",
      import_price: "185.000"
    }
  ];

  const dataPurchase = [
    {
      id: 1,
      code: "NH0000000039",
      timestamp: "07:35 15/11/2024",
      supplier: "Công ty TNHH TM Tân Thành"
    },
    {
      id: 2,
      code: "NH0000000038",
      timestamp: "09:18 11/11/2024",
      supplier: "Công ty CP Bảo vệ thực vật 1 Trung ương"
    }
  ];

  const dataProduct = [
    {
      photo: "https://product.hstatic.net/1000269461/product/132_3835456dcd1140ea8a5582edc2fd3c35_medium.png",
      name: "Thuốc trừ bệnh cây trồng COC85 - Gói 20 gram",
      category: "Thuốc bảo vệ thực vật",
      price: "17.000"
    },
    {
      photo: "https://product.hstatic.net/1000269461/product/nnp_-_sp_ko_logo_-_502x502-thuoc_tru_rep_sap_confidor_200sl-_20ml_c2794056cada4801a73f3a6e82cdb9ca_medium.jpg",
      name: "Thuốc trừ rệp sáp CONFIDOR 200SL",
      category: "Thuốc bảo vệ thực vật",
      price: "199.000"
    },
    {
      photo: "https://product.hstatic.net/1000269461/product/73_994e52afa4194cef8139d6a250571bdc_medium.png",
      name: "Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC",
      category: "Thuốc bảo vệ thực vật",
      price: "16.000"
    },
    {
      photo: "https://product.hstatic.net/1000269461/product/movento-moi-2_a8895a601e2b4fa4840b0860300d3aa0_medium.jpg",
      name: "Thuốc đặc trị rệp sáp, trừ sâu, trị bọ trĩ MOVENTO 150OD - 100ml",
      category: "Thuốc bảo vệ thực vật",
      price: "155.000"
    },
    {
      photo: "https://product.hstatic.net/1000269461/product/tui_dao_don_-_tui_guc_nga__10__7a555e24a5e34a27a52dc364d850e705_medium.png",
      name: "Thuốc diệt rầy DANTOTSU 50WG - Gói 5 gram",
      category: "Thuốc bảo vệ thực vật",
      price: "40.000"
    },
    {
      photo: "https://product.hstatic.net/1000269461/product/yamida-2_2b9c8ff014e44977a7152ad02a346ec1_medium.jpg",
      name: "Thuốc trừ bọ trĩ - rầy trên cây trồng và hoa kiểng YAMIDA 100EC",
      category: "Thuốc bảo vệ thực vật",
      price: "24.000"
    }
  ];

  const dataSupplier = [
    {
      id: 1,
      name: "Công ty TNHH TM Tân Thành",
      address: "3165, TT.Thạnh An, H.Vĩnh Thạnh, TP.Cần Thơ",
      phone: "02923651688",
      email: "tanthanhco@tanthanhco.vn"
    },
    {
      id: 2,
      name: "Công ty CP Bảo vệ thực vật 1 Trung ương",
      address: "145, Hồ Đắc Di, P.Quang Trung, Q.Đống Đa, TP.Hà Nội",
      phone: "02438572764",
      email: "psc1@psc1.com"
    }
  ];

  const handleDelete = () => { };

  return (
    <>
      <main className="">
        <Navbar toggle={sidebarToggle} />
        <h2 className="pt-4 pl-4 text-2xl font-bold mb-4">Quản lý kho & nhập hàng</h2>

        <div className="w-full bg-[#efffef] px-4 rounded-lg">
          <div className="flex">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex-1 py-2 text-white text-lg font-medium ${
                activeTab === "inventory" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
              }`}
            >
              Kho
            </button>
            <button
              onClick={() => setActiveTab("purchase")}
              className={`flex-1 py-2 text-white text-lg font-medium ${
                activeTab === "purchase" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
              }`}
            >
              Nhập hàng
            </button>
            <button
              onClick={() => setActiveTab("product")}
              className={`flex-1 py-2 text-white text-lg font-medium ${
                activeTab === "product" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
              }`}
            >
              Sản phẩm hiện có
            </button>
            <button
              onClick={() => setActiveTab("supplier")}
              className={`flex-1 py-2 text-white text-lg font-medium ${
                activeTab === "supplier" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
              }`}
            >
              Nhà cung cấp
            </button>
          </div>

          <div className="p-1 bg-white rounded-b-lg shadow-md">
          {activeTab === 'inventory' && (
            <div>
              <div className="mainCard">
                <div className="flex items-center gap-2 mb-2">
                  <select className="border rounded-md p-2 outline-none w-3/5">
                    <option disabled selected>Tên sản phẩm</option>
                    <option>Tên sản phẩm</option>
                  </select>
                  <select className="border rounded-md p-2 outline-none w-1/4">
                    <option disabled selected>Ngày nhập</option>
                    <option>Ngày nhập</option>
                  </select>
                  <select className="border rounded-md p-2 outline-none w-1/4">
                    <option disabled selected>Hạn dùng</option>
                    <option>Hạn dùng</option>
                  </select>
                  <label className="items-center p-2 w-1/5">
                    <input type="checkbox" className="mr-1" />
                    Sắp hết hạn
                  </label>
                  <label className="items-center p-2 w-1/5">
                    <input type="checkbox" className="mr-1" />
                    Sắp hết hàng
                  </label>
                  <button className="p-2 w-1/5 flex justify-end">
                    <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                  </button>
                </div>
                <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-md">
                  <InventoryTable
                    loading={loading}
                    dataHeader={dataHeaderInventory}
                    data={dataInventory}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'purchase' && (
            <div>
              <div className="mainCard">
                <div className="flex items-center gap-2 mb-2">
                  <select className="border rounded-md p-2 outline-none w-5/6">
                    <option disabled selected>Mã số</option>
                    <option>Mã số</option>
                  </select>
                  <select className="border rounded-md p-2 outline-none w-3/5">
                    <option disabled selected>Ngày nhập</option>
                    <option>Ngày nhập</option>
                  </select>
                  <select className="border rounded-md p-2 outline-none w-full">
                    <option disabled selected>Nhà cung cấp</option>
                    <option>Nhà cung cấp</option>
                  </select>
                  <button className="p-2 w-1/5">
                    <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                  </button>
                  <AddOrder/>
                </div>
                <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-md">
                  <PurchaseTable
                    loading={loading}
                    dataHeader={dataHeaderPurchase}
                    data={dataPurchase}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'product' && (
            <div>
              <div className="mainCard">
                <div className="flex items-center gap-2 mb-2">
                  <select className="border rounded-md p-2 outline-none w-full">
                    <option disabled selected>Tên sản phẩm</option>
                    <option>Tên sản phẩm</option>
                  </select>
                  <select className="border rounded-md p-2 outline-none w-3/5">
                    <option disabled selected>Loại</option>
                    <option>Loại</option>
                  </select>
                  <select className="border rounded-md p-2 outline-none w-5/6">
                    <option disabled selected>Công dụng</option>
                    <option>Công dụng</option>
                  </select>
                  <button className="p-2 w-1/5">
                    <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                  </button>
                  <AddProduct/>
                </div>
                <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-md">
                  <ProductTable
                    loading={loading}
                    dataHeader={dataHeaderProduct}
                    data={dataProduct}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'supplier' && (
            <div>
              <div className="mainCard">
                <div className="flex items-center gap-2 mb-2">
                  <select className="border rounded-md p-2 outline-none w-full">
                    <option disabled selected>Tên nhà cung cấp</option>
                    <option>Tên nhà cung cấp</option>
                  </select>
                  <select className="border rounded-md p-2 outline-none w-3/5">
                    <option disabled selected>Điện thoại</option>
                    <option>Điện thoại</option>
                  </select>
                  <select className="border rounded-md p-2 outline-none w-5/6">
                    <option disabled selected>Địa chỉ</option>
                    <option>Địa chỉ</option>
                  </select>
                  <button className="p-2 w-1/5">
                    <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                  </button>
                  <AddSupplier/>
                </div>
                <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-md">
                  <SupplierTable
                    loading={loading}
                    dataHeader={dataHeaderSupplier}
                    data={dataSupplier}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

      </main>
    </>
  );
}

export default InventoryPurchase

