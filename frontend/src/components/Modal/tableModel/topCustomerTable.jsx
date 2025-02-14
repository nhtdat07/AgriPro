import React from "react";
import Datatables from "../../Datatables/Table";
import TableCell from "../../Datatables/TableCell";

function TopCustomerTable({ loading, dataHeader, data, handleDelete }) {
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
          <TableCell dataLabel="Tên khách hàng" showLabel={true}>
            <p className="font-normal text-sm text-black">{row.name}</p>
          </TableCell>
          <TableCell dataLabel="Tổng tiền mua hàng" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.value}</p>
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default TopCustomerTable;
