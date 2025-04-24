import React, { useState } from "react";
import DetailProduct from "../detailModel/detailProduct";

function ProductCard({ row, onClick }) {
  return (
    <div className="bg-[#efffef] border rounded-lg shadow-md p-4 mb-4 flex-shrink-0 overflow-hidden flex flex-col justify-between">
      <div
        className="w-full h-40 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => onClick(row)}
      >
        <img src={row.imagePath} alt={row.productName} className="w-full h-full object-cover rounded-lg border-none"/>
      </div>
      <div className="flex-grow mt-2">
        <p className="text-sm text-black break-words">{row.category}</p>
        <p className="text-sm text-black font-semibold break-words w-full">{row.productName}</p>
      </div>
      <p className="font-semibold text-black break-words text-right">{row.outPrice}</p>
    </div>
  );
}

function ProductTable({ loading, data }) {
  const [selectedProduct, setSelectedProduct] = useState();

  const handleCloseDetail = () => { setSelectedProduct(undefined); };

  return (
    <div className={selectedProduct ? "relative overflow-hidden" : ""}>
      {selectedProduct && <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-start relative z-10">
        {data?.map((row, index) => (
          <ProductCard key={index} row={row} onClick={setSelectedProduct} />
        ))}
      </div>
      
      {selectedProduct && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4 max-w-2xl">
            <DetailProduct product={selectedProduct} onClose={handleCloseDetail} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTable;
