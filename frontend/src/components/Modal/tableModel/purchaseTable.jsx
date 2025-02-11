import React from "react";
import Datatables from "../../Datatables/Table";
import TableCell from "../../Datatables/TableCell";
import ModifyPurchase from "../modifyModel/modifyPurchase";

function PurchaseTable({ loading, dataHeader, data, handleDelete }) {
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
          <TableCell dataLabel="Thời gian nhập kho" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.timestamp}</p>
          </TableCell>
          <TableCell dataLabel="Nhà cung cấp" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.supplier}</p>
          </TableCell>
          <TableCell>
            <ModifyPurchase name={row.name} email={row.email} stu_id={row.stu_id}/>
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default PurchaseTable;
