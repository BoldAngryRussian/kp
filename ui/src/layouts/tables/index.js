import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function FileDropCard2() {
  const [summaryRows, setSummaryRows] = useState([]);
  const summaryColumns = [
    { field: "label", headerName: "Name", flex: 1 },
    { field: "value", headerName: "Price", flex: 1 },
  ];

  const uploadFile = (file) => {
    // Assume parseFile returns an array of objects with name and price
    const data = []//parseFile(file);

    const rows = Array.isArray(data)
      ? data.map((item, index) => ({
          id: `${item.name}-${index}`, // более надёжный уникальный id
          label: item.name,
          value: `${item.price} ₽`,
        }))
      : [];

    setSummaryRows(rows);
  };

  return (
    <div>
      {/* File upload input and other UI elements */}
      <DataGrid
        rows={summaryRows}
        columns={summaryColumns}
        disableColumnMenu
        hideFooterPagination
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
}

export default FileDropCard2;
