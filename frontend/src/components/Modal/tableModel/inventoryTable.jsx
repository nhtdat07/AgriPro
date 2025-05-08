import React from "react";
import Datatables from "../../Datatables/Table";
import TableCell from "../../Datatables/TableCell";

function InventoryTable({ loading, dataHeader, data, handleDelete }) {
  return (
    <Datatables loading={loading} dataHeader={dataHeader}>  
      {data?.map((row, index) => (
        <tr
          key={index}
          className="bg-white border md:border-b block md:table-row rounded-lg shadow-md md:rounded-none md:shadow-none mb-5"
        >
          <TableCell dataLabel="STT" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{index + 1}</p>
          </TableCell>
          <TableCell dataLabel="Tên sản phẩm" showLabel={true}>
            <p className="font-normal text-sm text-black">{row.productName}</p>
          </TableCell>
          <TableCell dataLabel="Số lượng" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.quantity}</p>
          </TableCell>
          <TableCell dataLabel="Ngày nhập kho" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.importDate}</p>
          </TableCell>
          <TableCell dataLabel="Hạn dùng" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.expiredDate ? row.expiredDate : "Không thời hạn"}</p>
          </TableCell>
          <TableCell dataLabel="Giá nhập" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.inPrice}</p>
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default InventoryTable;
