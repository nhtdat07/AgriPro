import React, { useState, useEffect, useRef } from "react";
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [inventorySearch, setInventorySearch] = useState({
    name: "",
    importDate: "",
    expiredDate: "",
    warningExpired: false,
    warningStock: false,
  });
  const [purchaseSearch, setPurchaseSearch] = useState({
    code: "",
    date: "",
    supplier: "",
  });
  const [productSearch, setProductSearch] = useState({
    name: "",
    category: "",
    usage: "",
  });
  const [supplierSearch, setSupplierSearch] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [inventoryOffset, setInventoryOffset] = useState(0);
  const [hasMoreInventory, setHasMoreInventory] = useState(true);
  const [purchaseOffset, setPurchaseOffset] = useState(0);
  const [hasMorePurchases, setHasMorePurchases] = useState(true);
  const [productOffset, setProductOffset] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [supplierOffset, setSupplierOffset] = useState(0);
  const [hasMoreSuppliers, setHasMoreSuppliers] = useState(true); 
  const [isSearchingPurchase, setIsSearchingPurchase] = useState(false);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);   
  const [isSearchingSupplier, setIsSearchingSupplier] = useState(false);
  const inventoryContainerRef = useRef(null);
  const purchaseContainerRef = useRef(null);
  const productContainerRef = useRef(null);
  const supplierContainerRef = useRef(null);

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
        setFilteredInventory(inventoryArray);
        setFilteredPurchases(purchasesArray);
        setFilteredProducts(productsArray);
        setFilteredSuppliers(suppliersArray);
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 400) alert("Tải thông tin thất bại!");
          else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
          else if (status === 500) alert("Vui lòng tải lại trang!");
        }  
      }
    };
  
    fetchData();
  }, []);

  const fetchInventory = async (offset = 0, append = false) => {
    try {
      const res = await axiosInstance.get("/inventory", {
        params: { offset, limit: 20 }
      });
      const newData = res.data.data.inventory;
      setInventoryData(prev => append ? [...prev, ...newData] : newData);
      setFilteredInventory(prev => append ? [...prev, ...newData] : newData);
      setRefreshTrigger(prev => prev + 1);
  
      if (newData.length < 20) {
        setHasMoreInventory(false);
      } else {
        setHasMoreInventory(true);
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const container = inventoryContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
        if (isBottom && hasMoreInventory) {
          const newOffset = inventoryOffset + 20;
          fetchInventory(newOffset, true);
          setInventoryOffset(newOffset);
        }
      };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [inventoryOffset, hasMoreInventory]);

  const fetchOrders = async (offset = 0, append = false) => {
    try {
      const res = await axiosInstance.get("/purchase-orders", {
        params: { offset, limit: 20 }
      });
      const newData = res.data.data.purchaseOrders;
      setFilteredPurchases(prev => append ? [...prev, ...newData] : newData);
      setRefreshTrigger(prev => prev + 1);
      
      if (newData.length < 20) {
        setHasMorePurchases(false);
      } else {
        setHasMorePurchases(true);
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }  
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (activeTab !== 'purchase') return;
    const container = purchaseContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
        if (isBottom && hasMorePurchases && !isSearchingPurchase) {
          const newOffset = purchaseOffset + 20;
          fetchOrders(newOffset, true);
          setPurchaseOffset(newOffset);
        }
      };
    
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, [activeTab, purchaseOffset, hasMorePurchases, isSearchingPurchase]);

  const fetchProducts = async (offset = 0, append = false) => {
    try {
      const res = await axiosInstance.get("/products", {
        params: { offset, limit: 20 }
      });
      const newData = res.data.data.products;
      setFilteredProducts(prev => append ? [...prev, ...newData] : newData);
      setRefreshTrigger(prev => prev + 1);
        
      if (newData.length < 20) {
        setHasMoreProducts(false);
      } else {
        setHasMoreProducts(true);
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }  
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab !== 'product') return;
    const container = productContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
        if (isBottom && hasMoreProducts && !isSearchingProduct) {
          const newOffset = productOffset + 20;
          fetchProducts(newOffset, true);
          setProductOffset(newOffset);
        }
      };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeTab, productOffset, hasMoreProducts, isSearchingProduct]);

  const fetchSuppliers = async (offset = 0, append = false) => {
    try {
      const res = await axiosInstance.get("/suppliers", {
        params: { offset, limit: 20 }
      });
      const newData = res.data.data.suppliers;
      setFilteredSuppliers(prev => append ? [...prev, ...newData] : newData);
      setRefreshTrigger(prev => prev + 1);
          
      if (newData.length < 20) {
        setHasMoreSuppliers(false);
      } else {
        setHasMoreSuppliers(true);
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }  
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (activeTab !== 'supplier') return;
    const container = supplierContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
        if (isBottom && hasMoreSuppliers && !isSearchingSupplier) {
          const newOffset = supplierOffset + 20;
          fetchSuppliers(newOffset, true);
          setSupplierOffset(newOffset);
        }
      };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeTab, supplierOffset, hasMoreSuppliers, isSearchingSupplier]);

  const [dayExpired, setDayExpired] = useState(null);
  const [dayOutOfStock, setDayOutOfStock] = useState(null);

  const fetchInventoryWarnings = async () => {
    try {
      const res = await axiosInstance.get("/settings");
      const settings = res.data.data.settings;

      settings.forEach((item) => {
        if (item.category === "INVENTORY_PARAMS") {
          if (item.key === "warning_expired") {
            setDayExpired(parseInt(item.value, 10));
          } else if (item.key === "warning_out_of_stock") {
            setDayOutOfStock(parseInt(item.value, 10));
          }
        }
      });
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

  useEffect(() => {
    fetchInventoryWarnings();
  }, []);

  const handleSearchInventory = () => {
    const result = inventoryData.filter((item) => {
      const nameMatch = item.productName && item.productName.toLowerCase().includes(inventorySearch.name ? inventorySearch.name.toLowerCase() : "");
      const importDateMatch = item.importDate.slice(0, 10).includes(inventorySearch.importDate ? inventorySearch.importDate : "");
      const expiredDateMatch = item.expiredDate.slice(0, 10).includes(inventorySearch.expiredDate ? inventorySearch.expiredDate : "");
      const now = new Date();
      const warningExpiredMatch = !inventorySearch.warningExpired || (() => {
        const expDate = new Date(item.expiredDate);
        const daysToExpire = (expDate - now) / (1000 * 60 * 60 * 24);
        return daysToExpire >= 0 && daysToExpire <= dayExpired;
      })();
      const warningStockMatch = !inventorySearch.warningStock || item.quantity <= dayOutOfStock;
      return nameMatch && importDateMatch && expiredDateMatch && warningExpiredMatch && warningStockMatch;
    });
    setFilteredInventory(result);
  };  
  
  const handleSearchPurchase = async () => {
    try {
      setIsSearchingPurchase(true);
      setPurchaseOffset(0);
      const res = await axiosInstance.get("/purchase-orders", {
        params: {
          purchaseOrderId: purchaseSearch.code || undefined,
          recordedDate: purchaseSearch.date || undefined,
          supplierName: purchaseSearch.supplier || undefined,
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0
        },
      });
      setFilteredPurchases(res.data.data.purchaseOrders);
      setHasMorePurchases(false);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }
    }
  };
  
  const handleSearchProduct = async () => {
    try {
      setIsSearchingProduct(true);
      setProductOffset(0);
      const res = await axiosInstance.get("/products", {
        params: {
          productName: productSearch.name || undefined,
          category: productSearch.category || undefined,
          usage: productSearch.usage || undefined,
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0
        },
      });
      setFilteredProducts(res.data.data.products);
      setHasMoreProducts(false);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }
    }
  };
  
  const handleSearchSupplier = async () => {
    try {
      setIsSearchingSupplier(true);
      setSupplierOffset(0);
      const res = await axiosInstance.get("/suppliers", {
        params: {
          supplierName: supplierSearch.name || undefined,
          phoneNumber: supplierSearch.phone || undefined,
          address: supplierSearch.address || undefined,
          limit: Number.MAX_SAFE_INTEGER,
          offset: 0,
        },
      });
      setFilteredSuppliers(res.data.data.suppliers);
      setHasMoreSuppliers(false);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) alert("Tải thông tin thất bại!");
        else if (status === 401) alert("Bạn không có quyền truy cập vào trang này!");
        else if (status === 500) alert("Vui lòng tải lại trang!");
      }
    }
  };  

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
                    <input
                      placeholder="Tên sản phẩm"
                      className="border rounded-lg p-2 outline-none w-3/5"
                      value={inventorySearch.name}
                      onChange={(e) => setInventorySearch({ ...inventorySearch, name: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Ngày nhập"
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = 'text';
                      }}
                      className="border rounded-lg p-2 outline-none w-1/4"
                      value={inventorySearch.importDate}
                      onChange={(e) => setInventorySearch({ ...inventorySearch, importDate: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Hạn dùng"
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = 'text';
                      }}
                      className="border rounded-lg p-2 outline-none w-1/4"
                      value={inventorySearch.expiredDate}
                      onChange={(e) => setInventorySearch({ ...inventorySearch, expiredDate: e.target.value })}
                    />
                    <label className="items-center p-2 w-1/5">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={inventorySearch.warningExpired}
                        onChange={(e) =>
                          setInventorySearch({ ...inventorySearch, warningExpired: e.target.checked })
                        }
                      />
                      Sắp hết hạn
                    </label>
                    <label className="items-center p-2 w-1/5">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={inventorySearch.warningStock}
                        onChange={(e) =>
                          setInventorySearch({ ...inventorySearch, warningStock: e.target.checked })
                        }
                      />
                      Sắp hết hàng
                    </label>
                    <button type="button" onClick={handleSearchInventory} className="p-2 w-1/5">
                      <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                    </button>
                  </div>
                  <div
                    ref={inventoryContainerRef}
                    className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg overflow-y-auto max-h-[500px]"
                  >
                    <InventoryTable
                      loading={loading}
                      dataHeader={dataHeaderInventory}
                      data={filteredInventory}
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
                    <input
                      placeholder="Mã số"
                      className="border rounded-lg p-2 outline-none w-5/6"
                      value={purchaseSearch.code}
                      onChange={(e) => setPurchaseSearch({ ...purchaseSearch, code: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Ngày nhập"
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = 'text';
                      }}
                      className="border rounded-lg p-2 outline-none w-3/5"
                      value={purchaseSearch.date}
                      onChange={(e) => setPurchaseSearch({ ...purchaseSearch, date: e.target.value })}
                    />
                    <input
                      placeholder="Nhà cung cấp"
                      className="border rounded-lg p-2 outline-none w-full"
                      value={purchaseSearch.customer}
                      onChange={(e) => setPurchaseSearch({ ...purchaseSearch, supplier: e.target.value })}
                    />
                    <button type="button" onClick={handleSearchPurchase} className="p-2 w-1/5">
                      <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                    </button>
                    <AddOrder
                      refreshOrders={fetchOrders}
                      refreshInventory={fetchInventory}
                    />
                  </div>
                  <div
                    ref={purchaseContainerRef}
                    className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg overflow-y-auto max-h-[500px]"
                  >
                    <PurchaseTable
                      loading={loading}
                      dataHeader={dataHeaderPurchase}
                      data={filteredPurchases}
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
                    <input
                      placeholder="Tên sản phẩm"
                      className="border rounded-lg p-2 outline-none w-full"
                      value={productSearch.name}
                      onChange={(e) => setProductSearch({ ...productSearch, name: e.target.value })}
                    />
                    <select
                      className="border rounded-lg p-2 outline-none w-5/6"
                      value={productSearch.category}
                      onChange={(e) => setProductSearch({ ...productSearch, category: e.target.value })}
                    >
                      <option value="">Phân loại</option>
                      <option value="THUỐC BẢO VỆ THỰC VẬT">THUỐC BẢO VỆ THỰC VẬT</option>
                      <option value="PHÂN BÓN - ĐẤT TRỒNG">PHÂN BÓN - ĐẤT TRỒNG</option>
                      <option value="HẠT GIỐNG - CÂY TRỒNG">HẠT GIỐNG - CÂY TRỒNG</option>
                      <option value="NÔNG CỤ">NÔNG CỤ</option>
                      <option value="GIA SÚC - GIA CẦM">GIA SÚC - GIA CẦM</option>                      
                    </select>
                    <input
                      placeholder="Công dụng"
                      className="border rounded-lg p-2 outline-none w-3/5"
                      value={productSearch.usage}
                      onChange={(e) => setProductSearch({ ...productSearch, usage: e.target.value })}
                    />
                    <button type="button" onClick={handleSearchProduct} className="p-2 w-1/5">
                      <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                    </button>
                    <AddProduct refreshProducts={fetchProducts} />
                  </div>
                  <div
                    ref={productContainerRef}
                    className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg overflow-y-auto max-h-[500px]"
                  >
                    <ProductTable
                      loading={loading}
                      dataHeader={dataHeaderProduct}
                      data={filteredProducts}
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
                      <input
                        placeholder="Tên nhà cung cấp"
                        className="border rounded-lg p-2 outline-none w-full"
                        value={supplierSearch.name}
                        onChange={(e) => setSupplierSearch({ ...supplierSearch, name: e.target.value })}
                      />
                      <input
                        placeholder="Số điện thoại"
                        className="border rounded-lg p-2 outline-none w-3/5"
                        value={supplierSearch.phone}
                        onChange={(e) => setSupplierSearch({ ...supplierSearch, phone: e.target.value })}
                      />
                      <input
                        placeholder="Địa chỉ"
                        className="border rounded-lg p-2 outline-none w-5/6"
                        value={supplierSearch.address}
                        onChange={(e) => setSupplierSearch({ ...supplierSearch, address: e.target.value })}
                      />
                      <button type="button" onClick={handleSearchSupplier} className="p-2 w-1/5">
                        <img src={searchIcon} alt="Search" className="w-5 h-5 cursor-pointer" />
                      </button>
                      <AddSupplier refreshSuppliers={fetchSuppliers} />
                    </div>
                    <div
                      ref={supplierContainerRef}
                      className="border w-full border-gray-200 bg-white py-4 px-4 rounded-lg overflow-y-auto max-h-[500px]"
                    >
                      <SupplierTable
                        loading={loading}
                        dataHeader={dataHeaderSupplier}
                        data={filteredSuppliers}
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

