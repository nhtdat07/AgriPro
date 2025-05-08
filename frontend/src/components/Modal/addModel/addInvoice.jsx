import React, { useState, useEffect } from "react";
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import { saveAs } from "file-saver";
import html2docx from 'html-docx-js/dist/html-docx.js';
import axiosInstance from "../../../utils/axiosInstance.js"

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
  const [detailCustomer, setDetailCustomer] = useState({
    customerName: "",
    addressCustomer: "",
    phoneCustomer: "",
  });  
  const [dataInvoice, setDataInvoice] = useState({
    codeInvoice: "",
    timestamp: "",
  });

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/customers", {
        params: {
          limit: Number.MAX_SAFE_INTEGER,
        },
      });
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

  const fetchDetailCustomers = async () => {
    try {
      const response = await axiosInstance.get(`/customers/${selectedCustomerId}`);
      const data = response.data.data;
      setDetailCustomer({
        customerName: data.customerName || "",
        addressCustomer: data.address || "",
        phoneCustomer: data.phoneNumber || "",
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

  const fetchInvoices = async () => {
    try {
      const res = await axiosInstance.get("/sales-invoices");
      const invoices = res.data.data.salesInvoices || [];
      setDataInvoice({
        codeInvoice: invoices[0].salesInvoiceId || "",
        timestamp: invoices[0].recordedTimestamp || "",
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
  
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products", {
        params: {
          limit: Number.MAX_SAFE_INTEGER,
        },
      });
      const products = response.data.data.products || [];
      const productsWithQuantity = await Promise.all(
        products.map(async (product) => {
          try {
            const detailResponse = await axiosInstance.get(`/products/${product.productId}`);
            const availableQuantity = detailResponse.data.data.availableQuantity;
  
            return {
              ...product,
              availableQuantity,
            };
          } catch (detailError) {
            console.error(`Lỗi khi lấy chi tiết sản phẩm ${product.productId}:`, detailError);
            return null;
          }
        })
      );
  
      const filteredProducts = productsWithQuantity.filter(
        (p) => p && p.availableQuantity > 0
      );
      setProductsList(filteredProducts);
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
                productName: productsList.find(p => p.productId === value)?.productName || "",
                outPrice: productsList.find(p => p.productId === value)?.outPrice || 0
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
      await axiosInstance.post("/sales-invoices", invoiceData);
      setShowSaveModal(false);
      setShowModal(false);
      setSavedInvoice({ code: dataInvoice.codeInvoice, products });
      setShowInvoiceModal(true);
      fetchDetailCustomers();
      fetchInvoices();
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

  const handleDownload = async (format) => {
    const element = document.getElementById("invoice-preview");
    const buttons = element.querySelector(".hidden-on-export");

    if (buttons) buttons.style.display = "none";

    let fontSize = 12;
    let marginTop = 2;
    let marginRight = 2;
    let marginBottom = 2;
    let marginLeft = 2;

    try {
      const res = await axiosInstance.get("/settings");
      const settings = res.data.data.settings;

      settings.forEach((item) => {
        if (item.category === "PRINT_FORMAT") {
          if (item.key === "left_margin") {
            marginLeft = parseFloat(item.value);
          } else if (item.key === "right_margin") {
            marginRight = parseFloat(item.value);
          } else if (item.key === "top_margin") {
            marginTop = parseFloat(item.value);
          } else if (item.key === "bottom_margin") {
            marginBottom = parseFloat(item.value);
          } else if (item.key === "font_size") {
            fontSize = parseInt(item.value, 10);
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

    const FONT_SIZE_PT = fontSize;
    const MARGIN_TOP_CM = marginTop;
    const MARGIN_RIGHT_CM = marginRight;
    const MARGIN_BOTTOM_CM = marginBottom;
    const MARGIN_LEFT_CM = marginLeft;
    
    const invoicePdfHtml = `
        <html>
            <head>
                <meta charset='utf-8'>
                <style>
                    body {
                        font-family: Times New Roman, serif;
                        font-size: ${FONT_SIZE_PT}pt;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    p.heading {
                        text-align: center;
                    }
                    th, td {
                        border: 1px solid black;
                        font-size: ${FONT_SIZE_PT}pt;
                        line-height: 1.75;
                        text-align: center;
                    }
                </style>
            </head>
            <body>${element.innerHTML}</body>
        </html>
    `;

    const invoiceDocHtml = `
        <html>
            <head>
                <meta charset='utf-8'>
                <style>
                    body {
                        font-family: Times New Roman, serif;
                        font-size: ${FONT_SIZE_PT}pt;
                    }
                    h2 {
                        margin: 15px 0px 0px;
                    }
                    h2, h3 {
                        text-align: center;
                        text-transform: uppercase;
                        margin: 0px;
                    }
                    p {
                        text-align: left;
                        margin: 5px 0px;
                    }
                    #heading {
                        text-align: center;
                    }
                    #signature-title {
                        text-align: right;
                        margin: 10px 75px 0px;
                    }
                    #signature-name {
                        text-align: right;
                        margin: 0px 75px;
                    }
                    hr {
                        width: 50%
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        border: 1px solid black;
                        font-size: ${FONT_SIZE_PT}pt;
                        line-height: 1.25;
                    }
                    #row {
                        font-family: Times New Roman, serif;
                        font-size: ${FONT_SIZE_PT}pt;
                        text-align: center;
                    }
                </style>
            </head>
            <body>${element.innerHTML}</body>
        </html>
    `;

    if (format === "PDF") {
        const opt = {
          margin: [
            MARGIN_TOP_CM,
            MARGIN_LEFT_CM,
            MARGIN_BOTTOM_CM,
            MARGIN_RIGHT_CM
          ],
          filename: 'hoa-don.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(invoicePdfHtml).save();
    } else if (format === "Word") {
        const blob = html2docx.asBlob(invoiceDocHtml, {
          orientation: 'portrait',
          margins: {
            top: MARGIN_TOP_CM * 566.93,
            bottom: MARGIN_BOTTOM_CM * 566.93,
            left: MARGIN_LEFT_CM * 566.93,
            right: MARGIN_RIGHT_CM * 566.93,
          }
        });
        saveAs(blob, "hoa-don.docx");
    } else {
        alert("Định dạng không hỗ trợ!");
    }

    if (buttons) buttons.style.display = "flex";
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
                            max={
                              productsList.find((p) => p.productId === product.productId)?.availableQuantity || 0
                            }
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
                            onChange={(e) =>
                              handleProductChange(product.id, "outPrice", Number(e.target.value))
                            }
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
          <div className="bg-white rounded-lg shadow-md w-[900px] max-h-[650px] overflow-y-auto p-6">
            <div className="text-[13px]" id="invoice-preview">
              <h3 className="font-bold text-center uppercase">Đại lý Vật tư nông nghiệp {agencyInfo.agencyName}</h3>
              <p id="heading" className="text-center">Địa chỉ: {agencyInfo.address}</p>
              <p id="heading" className="text-center">Số điện thoại: {agencyInfo.phoneNumber}</p>
              <p id="heading" className="text-center mb-6">Mã số thuế: {agencyInfo.taxCode}</p>
              <br/>
              <h2 className="text-xxl font-bold text-center">HÓA ĐƠN BÁN HÀNG</h2>
              <hr className="mx-auto mt-5 mb-2 w-1/2 border-t border-black" />
              <div id="info" style={{ display: 'flex', gap: '150px' }}>
                <div>
                  <p><strong>Mã số:</strong> {dataInvoice.codeInvoice}</p>
                  <p><strong>Tên khách hàng:</strong> {detailCustomer.customerName}</p>
                  <p><strong>Địa chỉ:</strong> {detailCustomer.addressCustomer}</p>
                </div>
                <div>
                  <p><br></br></p>
                  <p><strong>Thời gian:</strong> {dataInvoice.timestamp}</p>
                  <p><strong>Số điên thoại:</strong> {detailCustomer.phoneCustomer}</p>
                </div>
              </div>

              <table className="w-full border-collapse border mt-4">
                <thead>
                  <tr className="bg-gray-200 text-center">
                    <th className="border p-2"><p id="row">STT</p></th>
                    <th className="border p-2"><p id="row">Tên sản phẩm</p></th>
                    <th className="border p-2"><p id="row">Số lượng</p></th>
                    <th className="border p-2"><p id="row">Giá bán</p></th>
                    <th className="border p-2"><p id="row">Thành tiền</p></th>
                  </tr>
                </thead>
                <tbody>
                  {savedInvoice.products.map((product, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-2"><p id="row">{index + 1}</p></td>
                      <td className="border p-2"><p id="row">{product.productName}</p></td>
                      <td className="border p-2"><p id="row">{product.quantity}</p></td>
                      <td className="border p-2"><p id="row">{Number(product.outPrice).toLocaleString()}</p></td>
                      <td className="border p-2"><p id="row">{(product.quantity * product.outPrice).toLocaleString()}</p></td>
                    </tr>
                  ))}
                    <tr className="text-center font-semibold">
                      <td className="border p-2" colSpan={4}><p id="row">TỔNG CỘNG</p></td>
                      <td className="border p-2">
                        <p id="row">{savedInvoice.products.reduce((sum, p) => sum + p.quantity * p.outPrice, 0).toLocaleString()}</p>
                      </td>
                    </tr>
                </tbody>
              </table>
              <div className="mt-6 text-right pr-20">
                <div className="mb-2 inline-block text-center">
                  <div class="signature-block">
                    <p id="signature-title"><strong>Người bán hàng</strong></p>
                    <p id="signature-name">{agencyInfo.ownerName}</p>
                  </div>
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
