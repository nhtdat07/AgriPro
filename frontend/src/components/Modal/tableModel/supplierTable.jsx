import React from "react";
import Datatables from "../../Datatables/Table";
import TableCell from "../../Datatables/TableCell";
import ViewSupplier from "../detailModel/detailSupplier";

function SupplierTable({ loading, dataHeader, data, handleDelete }) {
  return (
    <Datatables loading={loading} dataHeader={dataHeader}>
      {data?.map((row, index) => (
        <tr
          key={index}
          className="bg-white border md:border-b block md:table-row rounded-lg shadow-md md:rounded-none md:shadow-none mb-5"
        >
          <TableCell dataLabel="STT" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.id}</p>
          </TableCell>
          <TableCell dataLabel="Tên nhà cung cấp" showLabel={true}>
            <p className="font-normal text-sm text-black">{row.name}</p>
          </TableCell>
          <TableCell dataLabel="Địa chỉ" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.address}</p>
          </TableCell>
          <TableCell dataLabel="Số điện thoại" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.phone}</p>
          </TableCell>
          <TableCell dataLabel="Email" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.email}</p>
          </TableCell>
          <TableCell>
            <ViewSupplier name={row.name} address={row.address} phone={row.phone} email={row.email}/>
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default SupplierTable;
