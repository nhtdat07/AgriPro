import React from "react";
import Datatables from "../../Datatables/Table";
import TableCell from "../../Datatables/TableCell";
import ViewInvoice from "../detailModel/detailInvoice";

function InvoiceTable({ loading, dataHeader, data, handleDelete }) {
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
            <p className="font-normal text-sm text-right md:text-center text-black">{row.salesInvoiceId}</p>
          </TableCell>
          <TableCell dataLabel="Thời gian bán hàng" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black break-words whitespace-normal">
              {row.recordedTimestamp}
            </p>
          </TableCell>
          <TableCell dataLabel="Khách hàng" showLabel={true}>
            <p className="font-normal text-sm text-right md:text-center text-black break-words whitespace-normal">
              {row.customerName}
            </p>
          </TableCell>
          <TableCell>
            <ViewInvoice code={row.salesInvoiceId} timestamp={row.recordedTimestamp} customer={row.customerName}/>
          </TableCell>
        </tr>
      ))}
    </Datatables>
  );
}

export default InvoiceTable;
