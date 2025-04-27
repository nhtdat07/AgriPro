import React, { useState, useEffect } from "react";
import Header from "../../components/Navbar/header";
import Footer from "../../components/Navbar/footer";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js"

import InventoryTable from "../../components/Modal/tableModel/inventoryTable";
import PurchaseTable from "../../components/Modal/tableModel/orderTable";
import ProductTable from "../../components/Modal/tableModel/productTable";
import SupplierTable from "../../components/Modal/tableModel/supplierTable";
import AddOrder from "../../components/Modal/addModel/addOrder";
import AddProduct from "../../components/Modal/addModel/addProduct";
import AddSupplier from "../../components/Modal/addModel/addSupplier";

import searchIcon from "../../assets/images/search.svg";

function InventoryPurchase() {
  const [headerToggle] = useOutletContext();
  const [footerToggle] = useOutletContext();
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

  const [inventoryData, setInventoryData] = useState([]);
  const [purchasesData, setPurchasesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryRes = await axiosInstance.get("/inventory");
        const purchasesRes = await axiosInstance.get("/purchase-orders");
        const productsRes = await axiosInstance.get("/products");
        const suppliersRes = await axiosInstance.get("/suppliers");

        const inventoryArray = inventoryRes.data.data.inventory;
        const purchasesArray = purchasesRes.data.data.purchaseOrders;
        const productsArray = productsRes.data.data.products;
        const suppliersArray = suppliersRes.data.data.suppliers;
  
        setInventoryData(inventoryArray);
        setPurchasesData(purchasesArray);
        setProductsData(productsArray);
        setSuppliersData(suppliersArray);
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
  
    fetchData();
  }, []);

  const fetchOrders = async () => {
    try {
      const purchasesRes = await axiosInstance.get("/purchase-orders");
      const purchasesArray = purchasesRes.data.data.purchaseOrders;
      setPurchasesData(purchasesArray);
      setRefreshTrigger(prev => prev + 1)
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsRes = await axiosInstance.get("/products");
      const productsArray = productsRes.data.data.products;
      setProductsData(productsArray);
      setRefreshTrigger(prev => prev + 1)
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const suppliersRes = await axiosInstance.get("/suppliers");
      const suppliersArray = suppliersRes.data.data.suppliers;
      setSuppliersData(suppliersArray);
      setRefreshTrigger(prev => prev + 1)
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

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = () => { };

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Header toggle={headerToggle} refreshTrigger={refreshTrigger} />

        <div className="flex-grow">
          <h2 className="pt-4 pl-4 text-2xl font-bold mb-4">Quản lý kho & nhập hàng</h2>

          <div className="w-full bg-[#efffef] px-4 rounded-lg mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab("inventory")}
                className={`flex-1 py-2 text-white text-lg font-medium hover:bg-[#2c9e4b] ${
                  activeTab === "inventory" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
                }`}
              >
                Kho
              </button>
              <button
                onClick={() => setActiveTab("purchase")}
                className={`flex-1 py-2 text-white text-lg font-medium hover:bg-[#2c9e4b] ${
                  activeTab === "purchase" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
                }`}
              >
                Nhập hàng
              </button>
              <button
                onClick={() => setActiveTab("product")}
                className={`flex-1 py-2 text-white text-lg font-medium hover:bg-[#2c9e4b] ${
                  activeTab === "product" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
                }`}
              >
                Sản phẩm hiện có
              </button>
              <button
                onClick={() => setActiveTab("supplier")}
                className={`flex-1 py-2 text-white text-lg font-medium hover:bg-[#2c9e4b] ${
                  activeTab === "supplier" ? "bg-[#2c9e4b]" : "bg-[#0c5c30]"
                }`}
              >
                Nhà cung cấp
              </button>
            </div>

            <div className="p-1 bg-white rounded-lg shadow-md">
            {activeTab === 'inventory' && (
              <div>
                <div className="mainCard">
                  <div className="flex items-center gap-2 mb-2">
                    <select className="border rounded-lg p-2 outline-none w-3/5">
                      <option disabled selected>Tên sản phẩm</option>
                      <option>Tên sản phẩm</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-1/4">
                      <option disabled selected>Ngày nhập</option>
                      <option>Ngày nhập</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-1/4">
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
                  <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                    <InventoryTable
                      loading={loading}
                      dataHeader={dataHeaderInventory}
                      data={inventoryData}
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
                    <select className="border rounded-lg p-2 outline-none w-5/6">
                      <option disabled selected>Mã số</option>
                      <option>Mã số</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-3/5">
                      <option disabled selected>Ngày nhập</option>
                      <option>Ngày nhập</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-full">
                      <option disabled selected>Nhà cung cấp</option>
                      <option>Nhà cung cấp</option>
                    </select>
                    <button className="p-2 w-1/5">
                      <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                    </button>
                    <AddOrder
                      refreshOrders={fetchOrders}
                    />
                  </div>
                  <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                    <PurchaseTable
                      loading={loading}
                      dataHeader={dataHeaderPurchase}
                      data={purchasesData}
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
                    <select className="border rounded-lg p-2 outline-none w-full">
                      <option disabled selected>Tên sản phẩm</option>
                      <option>Tên sản phẩm</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-3/5">
                      <option disabled selected>Loại</option>
                      <option>Loại</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-5/6">
                      <option disabled selected>Công dụng</option>
                      <option>Công dụng</option>
                    </select>
                    <button className="p-2 w-1/5">
                      <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                    </button>
                    <AddProduct/>
                  </div>
                  <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                    <ProductTable
                      loading={loading}
                      dataHeader={dataHeaderProduct}
                      data={productsData}
                      handleDelete={handleDelete}
                      refreshProducts={fetchProducts}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'supplier' && (
              <div>
                <div className="mainCard">
                  <div className="flex items-center gap-2 mb-2">
                    <select className="border rounded-lg p-2 outline-none w-full">
                      <option disabled selected>Tên nhà cung cấp</option>
                      <option>Tên nhà cung cấp</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-3/5">
                      <option disabled selected>Điện thoại</option>
                      <option>Điện thoại</option>
                    </select>
                    <select className="border rounded-lg p-2 outline-none w-5/6">
                      <option disabled selected>Địa chỉ</option>
                      <option>Địa chỉ</option>
                    </select>
                    <button className="p-2 w-1/5">
                      <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                    </button>
                    <AddSupplier
                      refreshSuppliers={fetchSuppliers}
                    />
                  </div>
                  <div className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg">
                    <SupplierTable
                      loading={loading}
                      dataHeader={dataHeaderSupplier}
                      data={suppliersData}
                      handleDelete={handleDelete} 
                      refreshSuppliers={fetchSuppliers}
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        <Footer toggle={footerToggle} />
      </main>
    </>
  );
}

export default InventoryPurchase

