import React from "react";
import Header from "./Header";

function Table({
  loading,
  dataHeader,
  handleSort,
  direction,
  field,
  children,
} = {}) {
  return (
    <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
      <table
        className={`block md:table w-full text-sm text-center text-gray-500`}
      >
        <Header
          data={dataHeader}
          handleSort={handleSort}
          direction={direction}
          field={field}
        ></Header>
        <tbody className="block md:table-row-group">{children}</tbody>
      </table>
    </div>
  );
  
}

export default Table;
