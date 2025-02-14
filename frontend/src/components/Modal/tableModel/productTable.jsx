import React from "react";

function ProductCard({ row }) {
  return (
    <div className="bg-[#efffef] border rounded-lg shadow-md p-4 mb-4 flex-shrink-0 overflow-hidden flex flex-col justify-between">
      <div className="w-full h-40 flex items-center justify-center overflow-hidden">
        <img src={row.photo} alt={row.name} className="w-full h-full object-cover rounded-lg border-none" />
      </div>
      <div className="flex-grow mt-2">
        <p className="text-sm text-black break-words">{row.category}</p>
        <p className="text-sm text-black font-semibold break-words w-full">{row.name}</p>
      </div>
      <p className="font-semibold text-black break-words text-right">{row.price}</p>
    </div>
  );
}

function ProductTable({ loading, data }) {
  if (loading) {
    return <p className="text-center text-black">Đang tải...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-start">
      {data?.map((row, index) => (
        <ProductCard key={index} row={row} />
      ))}
    </div>
  );
}

export default ProductTable;
