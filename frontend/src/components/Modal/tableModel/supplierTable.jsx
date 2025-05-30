import React from "react";
import Datatables from "../../Datatables/Table";
import TableCell from "../../Datatables/TableCell";
import ViewSupplier from "../detailModel/detailSupplier";

function SupplierTable({ loading, dataHeader, data, handleDelete, refreshSuppliers }) {
  return (
    <Datatables loading={loading} dataHeader={dataHeader}>
      {data?.map((row, index) => (
        <tr
          key={index}
          className="bg-white border md:border-b block md:table-row rounded-lg shadow-md md:rounded-none md:shadow-none mb-5"
        >
          <TableCell dataLabel="STT" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black break-words whitespace-normal">
              {index + 1}
            </p>
          </TableCell>
          <TableCell dataLabel="Tên nhà cung cấp" showLabel={true}>
            <p className="font-normal text-sm text-black break-words whitespace-normal">
              {row.supplierName}
            </p>
          </TableCell>
          <TableCell dataLabel="Địa chỉ" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black break-words whitespace-normal">
              {row.address}
            </p>
          </TableCell>
          <TableCell dataLabel="Số điện thoại" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black break-words whitespace-normal">
              {row.phoneNumber}
            </p>
          </TableCell>
          <TableCell dataLabel="Email" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black break-words whitespace-normal">
              {row.email}
            </p>
          </TableCell>
          <TableCell>
            <ViewSupplier code={row.supplierId} refreshSuppliers={refreshSuppliers} />
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default SupplierTable;
