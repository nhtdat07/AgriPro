import React from "react";
import Datatables from "../../Datatables/Table";
import TableCell from "../../Datatables/TableCell";
import ModifyInvoice from "../modifyModel/modifyInvoice";

function InvoiceTable({ loading, dataHeader, data, handleDelete }) {
  return (
    <Datatables loading={loading} dataHeader={dataHeader}>
      {data?.map((row, index) => (
        <tr
          key={index}
          className="bg-white border md:border-b block md:table-row rounded-md shadow-md md:rounded-none md:shadow-none mb-5"
        >
          <TableCell dataLabel="STT" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.id}</p>
          </TableCell>
          <TableCell dataLabel="Mã số" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.code}</p>
          </TableCell>
          <TableCell dataLabel="Thời gian bán hàng" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.timestamp}</p>
          </TableCell>
          <TableCell dataLabel="Khách hàng" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.customer}</p>
          </TableCell>
          <TableCell>
            <ModifyInvoice name={row.name} email={row.email} stu_id={row.stu_id}/>
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default InvoiceTable;
