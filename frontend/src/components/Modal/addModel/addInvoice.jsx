import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import HTMLtoDOCX from 'html-docx-js/dist/html-docx';
import axiosInstance from "../../../utils/axiosInstance";

import trashBin from "../../../assets/images/delete.png";
import plus from "../../../assets/images/plus.png";

export default function AddInvoice(props) {
  const [showModal, setShowModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [products, setProducts] = useState([
    { id: 1, productId: "", productName: "", quantity: 0, outPrice: 0 }
  ]);
  const [agencyInfo, setAgencyInfo] = useState({
    agencyName: "",
    ownerName: "",
    address: "",
    taxCode: "",
    phoneNumber: "",
  });

  const dataInvoice = {
    codeInvoice: "",
    customerName: "",
    addressCustomer: "",
    timestamp: "",
    phoneCustomer: "",
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/customers");
      setCustomersList(response.data.data.customers || []);
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

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setProductsList(response.data.data.products || []);
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

  const addProduct = () => {
    setProducts([
      ...products,
      { id: products.length + 1, productId: "", productName: "", quantity: 0, outPrice: 0 }
    ]);
  };

  const removeProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleProductChange = (id, field, value) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id
          ? {
              ...product,
              [field]: value,
              ...(field === "productId" && {
                productName: productsList.find(p => p.productId === value)?.productName || ""
              })
            }
          : product
      )
    );
  };  

  const resetForm = () => {
    setSelectedCustomerId("");
    setProducts([{ id: 1, productId: "", productName: "", quantity: 0, outPrice: 0 }]);
  };

  const totalAmount = products.reduce(
    (sum, product) => sum + (product.quantity * product.outPrice),
    0
  );

  const handleSubmit = async () => {
    const invoiceData = {
      customerId: selectedCustomerId,
      products: products.map((p) => ({
        productId: p.productId,
        quantity: Number(p.quantity),
        outPrice: Number(p.outPrice)
      }))
    };

    try {
      await axiosInstance.post("/sales-invoices", invoiceData);console.log("Submitting products:", invoiceData);
      setShowSaveModal(false);
      setShowModal(false);
      setSavedInvoice({ code: dataInvoice.codeInvoice, products });
      setShowInvoiceModal(true);
      resetForm();

      if (props.refreshInvoices) {
        props.refreshInvoices();
      }
    } catch (error) {
        if (error.response) {
            const { status } = error.response;
            if (status === 400) {
                alert("Tạo hóa đơn mới thất bại!");
            } else if (status === 401) {
                alert("Bạn không có quyền truy cập vào trang này!");
            } else if (status === 500) {
                alert("Vui lòng thử lại sau!");
            }
        }
    }
  };

  const handleDownload = (format) => {
    const element = document.getElementById("invoice-preview");
    const buttons = element.querySelector(".hidden-on-export");
      
    if (buttons) buttons.style.display = "none";
      
    if (format === "PDF") {
      const cloned = element.cloneNode(true);
      cloned.style.position = "absolute";
      cloned.style.top = "-9999px";
      cloned.style.width = `${element.offsetWidth}px`;
      cloned.style.height = `${element.scrollHeight}px`;
      cloned.style.overflow = "visible";
      
      cloned.querySelectorAll("*").forEach(el => {
        el.style.fontSize = "10px";
      });
      
      document.body.appendChild(cloned);
      
      html2canvas(cloned, {
        scale: 2,
        useCORS: true
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
        let heightLeft = imgHeight;
        let position = 0;
      
        while (heightLeft > 0) {
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
          heightLeft -= pageHeight;
          if (heightLeft > 0) {
            pdf.addPage();
            position = -imgHeight + heightLeft;
          }
        }
      
        pdf.save("hoa-don.pdf");
        document.body.removeChild(cloned);
      }).finally(() => {
        if (buttons) buttons.style.display = "flex";
      });
    } else if (format === "Word") {
      const html = `
        <html>
          <head>
            <meta charset='utf-8'>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
            </style>
          </head>
          <body>${element.innerHTML}</body>
        </html>
      `;
      
      const blob = HTMLtoDOCX.asBlob(html);
      saveAs(blob, "hoa-don.docx");
      
      if (buttons) buttons.style.display = "flex";
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get("/settings");
      const data = response.data.data.userProfile;
  
      setAgencyInfo({
        agencyName: data.agencyName,
        ownerName: data.ownerName,
        address: data.address,
        taxCode: data.taxCode,
        phoneNumber: data.phoneNumber,
      });
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
      fetchSettings();
  }, []); 


  return (
    <>
      <div className="rounded-lg py-2 outline-none w-3/5 flex justify-end">
        <button
          className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-4 py-2 inline-flex items-center rounded-lg"
          onClick={() => setShowModal(true)}
        >
          <span>THÊM HÓA ĐƠN</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md w-[1200px] max-h-[650px] overflow-y-auto p-6">
            <h3 className="text-2xl font-semibold text-center">Thêm hóa đơn mới</h3>

            <div className="flex gap-4 mt-4">
              <div className="w-full">
                <label className="p-2 block text-sm font-medium text-gray-700">Khách hàng</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="" disabled>Chọn khách hàng</option>
                  {customersList.map((customer) => (
                    <option key={customer.customerId} value={customer.customerId}>
                      {customer.customerName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-center p-2 mt-5">Danh sách sản phẩm</h4>

            <div className="p-2 block text-sm font-medium text-gray-700">
              <div className="w-full overflow-auto max-h-[200px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-center border-b">
                        <th className="p-2">STT</th>
                        <th className="p-2 w-1/2">Tên sản phẩm</th>
                        <th className="p-2 w-32">Số lượng</th>
                        <th className="p-2 w-48">Giá bán</th>
                        <th className="p-2 w-48">Thành tiền</th>
                        <th className="p-2 w-24 text-white">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id}>
                        <td className="p-2 text-center">{index + 1}</td>
                        <td className="p-2">
                          <select
                            className="w-full p-2 border rounded-lg"
                            value={product.productId}
                            onChange={(e) => handleProductChange(product.id, "productId", e.target.value)}
                          >
                            <option value="" disabled>Tên sản phẩm</option>
                            {productsList.map((prod) => (
                              <option key={prod.productId} value={prod.productId}>
                                {prod.productName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            className="w-full p-2 border rounded-lg"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(product.id, "quantity", e.target.value)}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            className="w-full p-2 border rounded-lg"
                            value={product.outPrice}
                            onChange={(e) => handleProductChange(product.id, "outPrice", e.target.value)}
                          />
                        </td>
                        <td className="p-2 text-center">
                          {(product.quantity * product.outPrice).toLocaleString()}
                        </td>
                        <td className="p-2 text-center">
                            {index === products.length - 1 && (
                                <button onClick={() => removeProduct(product.id)}>
                                <img src={trashBin} alt="Delete" className="w-5 h-5" />
                                </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-start">
              <button className="flex items-center gap-2 px-4" onClick={addProduct}>
                <img src={plus} alt="Add" className="w-5 h-5" />
              </button>
            </div>

            <div className="text-lg font-semibold text-right p-2 mt-5">
              TỔNG CỘNG: {totalAmount.toLocaleString()}
            </div>

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
            <h3 className="text-2xl font-semibold text-center">Xác nhận</h3>
            <p className="my-4 text-gray-700 text-lg leading-relaxed text-center">
              Bạn có muốn lưu hóa đơn này không?
            </p>
            <div className="flex justify-center gap-4 p-4">
              <button
                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                onClick={handleSubmit}
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
      {showInvoiceModal && savedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md w-[900px] max-h-[650px] overflow-y-auto p-6" id="invoice-preview">
            <div className="text-[13px]">
              <h3 className="font-bold text-center uppercase">Đại lý Vật tư nông nghiệp {agencyInfo.agencyName}</h3>
              <p className="text-center">Địa chỉ: {agencyInfo.address}</p>
              <p className="text-center">Số điện thoại: {agencyInfo.phoneNumber}</p>
              <p className="text-center mb-6">Mã số thuế: {agencyInfo.taxCode}</p>
              <h2 className="text-xxl font-bold text-center">HÓA ĐƠN BÁN HÀNG</h2>
              <hr className="my-2" />
              <div style={{ display: 'flex', gap: '150px' }}>
                <div>
                  <p><strong>Mã số:</strong> {dataInvoice.codeInvoice}</p>
                  <p><strong>Tên khách hàng:</strong> {dataInvoice.customerName}</p>
                  <p><strong>Địa chỉ:</strong> {dataInvoice.addressCustomer}</p>
                </div>
                <div>
                  <p><br></br></p>
                  <p><strong>Thời gian:</strong> {dataInvoice.timestamp}</p>
                  <p><strong>Số điên thoại:</strong> {dataInvoice.phoneCustomer}</p>
                </div>
              </div>

              <table className="w-full border-collapse border mt-4">
                <thead>
                  <tr className="bg-gray-200 text-center">
                    <th className="border p-2">STT</th>
                    <th className="border p-2">Tên sản phẩm</th>
                    <th className="border p-2">Số lượng</th>
                    <th className="border p-2">Giá bán</th>
                    <th className="border p-2">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {savedInvoice.products.map((product, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{product.productName}</td>
                      <td className="border p-2">{product.quantity}</td>
                      <td className="border p-2">{Number(product.outPrice).toLocaleString()}</td>
                      <td className="border p-2">{(product.quantity * product.outPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                    <tr className="text-center font-semibold">
                      <td className="border p-2" colSpan={4}>TỔNG CỘNG</td>
                      <td className="border p-2">
                        {savedInvoice.products.reduce((sum, p) => sum + p.quantity * p.outPrice, 0).toLocaleString()}
                      </td>
                    </tr>
                </tbody>
              </table>
            <div className="mt-6 text-right pr-20">
              <div className="inline-block text-center">
                <p><strong>Người bán hàng</strong></p>
                <p>{agencyInfo.ownerName}</p>
              </div>
            </div>
          </div>
            <div className="flex justify-center mt-6 gap-4 hidden-on-export">
              <button
                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                onClick={() => handleDownload("PDF")}
              >
                TẢI VỀ PDF
              </button>
              <button
                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                onClick={() => handleDownload("Word")}
              >
                TẢI VỀ DOCX
              </button>
              <button
                className="bg-[#2c9e4b] hover:bg-[#0c5c30] text-white px-6 py-2 rounded-lg"
                onClick={() => setShowInvoiceModal(false)}
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
