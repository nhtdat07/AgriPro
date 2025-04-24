import React from "react";
import Datatables from "../../Datatables/Table";
import TableCell from "../../Datatables/TableCell";
import ViewPurchase from "../detailModel/detailOrder";

function PurchaseTable({ loading, dataHeader, data, handleDelete }) {
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
          <TableCell dataLabel="Mã số" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.purchaseOrderId}</p>
          </TableCell>
          <TableCell dataLabel="Thời gian nhập kho" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.recordedTimestamp}</p>
          </TableCell>
          <TableCell dataLabel="Nhà cung cấp" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black">{row.supplierName}</p>
          </TableCell>
          <TableCell>
            <ViewPurchase code={row.purchaseOrderId} timestamp={row.recordedTimestamp} supplier={row.supplierName}/>
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default PurchaseTable;
