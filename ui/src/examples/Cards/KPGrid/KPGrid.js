// Пример AG Grid с многоуровневой шапкой и данными из Excel-подобной таблицы

import React, { useMemo, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from "ag-grid-react";
import { GlobalStyles } from '@mui/material';
import MDButton from "components/MDButton";
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';

ModuleRegistry.registerModules([AllCommunityModule]);

const KPGrid = forwardRef(({ selectedProducts, kpEditData }, ref) => {
  const gridRef = useRef(null);
  const gridApiRef = useRef(null);     // новая ссылка на API
  const columnApiRef = useRef(null);   // новая ссылка на columnApi
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%", position: 'relative' }), []);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, data: null });
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowData, setRowData] = useState([]);



  const handleRowDoubleClick = (event) => {
    const colDef = event.colDef;
    const isEditable = typeof colDef.editable === 'function'
      ? colDef.editable(event)
      : colDef.editable;

    if (!isEditable) {
      setSelectedRow(event.data);
      setOpenDialog(true);
    }
  };


  const handleCellContextMenu = (event) => {
    event.event.preventDefault(); // отключаем системное меню    
    setContextMenu({
      visible: true,
      x: event.event.clientX - 200,
      y: event.event.clientY,
      data: event.data,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      resizable: true,
      sortable: false,
      cellStyle: { borderRight: '1px solid #ccc' }
    };
  }, []);

  const initialColumnDefs = [
    { headerName: "№", field: "num", width: 50, editable: false },
    { headerName: "Поставщик", field: "company", width: 220, editable: false, hideGroup: 'details' },
    { headerName: "Наименование", field: "name", width: 550 },
    { headerName: "Товар от", field: "date", width: 100, editable: false, hideGroup: 'details' },
    {
      headerName: "Цена закуп. ед.", field: "purchasePrice", width: 100, editable: false,
      headerStyle: { backgroundColor: '#FFFFF0' },
      cellStyle: { backgroundColor: '#FFFFF0' }
    },
    {
      headerName: "Наценка",
      headerStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: '#F5F5DC'
      },
      children: [
        { headerName: "% от цены", field: "markupPercent", width: 80 },
        { headerName: "+доп, ₽", field: "markupExtra", width: 80 },
        {
          headerName: "Итого, ₽", field: "markupTotal", width: 100, editable: false,
          headerStyle: { backgroundColor: '#F5F5DC' },
          cellStyle: { backgroundColor: '#F5F5DC' }
        },
      ],
    },
    {
      headerName: "Транспортные услуги",
      headerStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: '#F5F5DC'
      },
      children: [
        { headerName: "за кг", field: "transportPercent", width: 80 },
        { headerName: "+доп, ₽", field: "transportExtra", width: 80, height: 100 },
        {
          headerName: "Итого, ₽", field: "transportTotal", width: 100, editable: false,
          headerStyle: { backgroundColor: '#F5F5DC' },
          cellStyle: { backgroundColor: '#F5F5DC' }
        },
      ],
    },
    {
      headerName: "Цена продажи, ₽", 
      field: "salePrice", 
      width: 120, 
      editable: false,  
      hideGroup: 'details',     
      headerStyle: { backgroundColor: '#FAF0E6' },
      cellStyle: { backgroundColor: '#FAF0E6' },
      valueGetter: (params) => {
        const price = parseFloat(params.data.purchasePrice)
        const markupTotal = parseFloat(params.data.markupTotal);
        const transportTotal = parseFloat(params.data.transportTotal);
        if (!isNaN(price) && !isNaN(markupTotal) && !isNaN(transportTotal)) {
          return (price + markupTotal + transportTotal).toFixed(2);
        }
        return null;
      },
    },
    { headerName: "Вес, кг", field: "weightKg", width: 100, hideGroup: 'details', },
    { headerName: "Кол-во", field: "amount", width: 90 },
    {
      headerName: "Вес итого, кг", field: "totalWeight", width: 120, editable: false,
      valueGetter: (params) => {
        const amount = parseFloat(params.data.amount);
        const weightKg = parseFloat(params.data.weightKg);
        if (!isNaN(amount) && !isNaN(weightKg)) {
          return (amount * weightKg).toFixed(2);
        }
        return null;
      },
    },
    {
      headerName: "Стоимость закупки, ₽", 
      field: "totalPurchase", 
      width: 150, 
      editable: false,
      hideGroup: 'details',
      headerStyle: { backgroundColor: '#FFFFF0' },
      cellStyle: { backgroundColor: '#FFFFF0' },
      valueGetter: (params) => {
        const amount = parseFloat(params.data.amount);
        const price = parseFloat(params.data.purchasePrice);
        if (!isNaN(amount) && !isNaN(price)) {
          return (amount * price).toFixed(2);
        }
        return null;
      },
    },
    {
      headerName: "Стоимость продажи, ₽", 
      field: "totalSale", 
      width: 120, 
      editable: false,      
      headerStyle: { backgroundColor: '#FAF0E6' },
      cellStyle: { backgroundColor: '#FAF0E6' },
      valueGetter: (params) => {
        const amount = parseFloat(params.data.amount);
        const price = parseFloat(params.data.purchasePrice)
        const markupTotal = parseFloat(params.data.markupTotal);
        const transportTotal = parseFloat(params.data.transportTotal);
        const salePrice = (!isNaN(price) && !isNaN(markupTotal) && !isNaN(transportTotal))
          ? price + markupTotal + transportTotal
          : NaN;
        if (!isNaN(amount) && !isNaN(salePrice)) {
          return (amount * salePrice).toFixed(2);
        }
        return null;
      },
    },
    {
      headerName: "Транспортные услуги, ₽", 
      field: "totalTransport", 
      width: 120, 
      editable: false,
      valueGetter: (params) => {
        const amount = parseFloat(params.data.amount);
        const transportTotal = parseFloat(params.data.transportTotal);
        if (!isNaN(amount) && !isNaN(transportTotal)) {
          return (transportTotal * amount).toFixed(2);
        }
        return null;
      },
    },
    {
      headerName: "Маржа, ₽", 
      field: "margin", 
      width: 120, 
      editable: false, 
      aggFunc: "sum",
      hideGroup: 'details',
      headerStyle: { backgroundColor: '#e0f2f1' },
      cellStyle: { backgroundColor: '#e0f2f1' },
      valueGetter: (params) => {
        const amount = parseFloat(params.data.amount);
        const price = parseFloat(params.data.purchasePrice)
        const markupTotal = parseFloat(params.data.markupTotal);
        const transportTotal = parseFloat(params.data.transportTotal);
        if (!isNaN(amount) && !isNaN(transportTotal) && !isNaN(price) && !isNaN(markupTotal)) {
          return (amount * (price + markupTotal) - (amount * price)).toFixed(2);
        }
        return null;
      },
    },
  ];
  const [columnDefs, setColumnDefs] = useState(initialColumnDefs);

  const onGridReady = (params) => {
    gridRef.current = params.api;
    gridApiRef.current = params.api;
    columnApiRef.current = params.columnApi; // ← самый надёжный способ
  };


useImperativeHandle(ref, () => ({
    getSelectedIds: () => {
      const selectedNodes = gridRef.current?.getSelectedNodes() || [];
      return selectedNodes.map(n => n.data.id);
    },
    getCalculatedSummary: () => {
      let totalPurchase = 0;
      let totalTransport = 0;
      let totalSale = 0;
      let totalMargin = 0;

      rowData.forEach(item => {
        const purchasePrice = parseFloat(item.purchasePrice) || 0;
        const transportTotal = parseFloat(item.transportTotal) || 0;
        const salePrice = parseFloat(item.salePrice) || 0;
        const margin = parseFloat(item.margin) || 0;

        totalPurchase +=  purchasePrice;
        totalTransport += transportTotal;
        totalSale += salePrice;
        totalMargin += margin;
      });

      return {
        totalPurchase: totalPurchase.toFixed(2),
        totalTransport: totalTransport.toFixed(2),
        totalSale: totalSale.toFixed(2),
        totalMargin: totalMargin.toFixed(2),
      };
    },
    deleteRowsByNum: (ids) => {
      setRowData(prev => {
        const filtered = prev.filter(row => !ids.includes(row.id));

        return filtered.map((row, index) => ({
          ...row,
          num: index + 1, // пересчёт номера
        }));
      });
    },

    toggleColumnGroupVisibility: (groupName, visible) => {
      const updatedDefs = columnDefs.map(col => {
        if (col.hideGroup === groupName) {
          return { ...col, hide: !visible };
        }
        return col;
      });
      setColumnDefs(updatedDefs);
    }

  }));

  useEffect(() => {
    if (selectedProducts && Array.isArray(selectedProducts)) {
      setRowData(prevRowData => {
        // Уникальные имена уже в таблице
        const existingNames = new Set(prevRowData.map(row => row.id));

        // Добавляем только новые строки
        const newRows = selectedProducts
          .filter(p => !existingNames.has(p.id))
          .map(p => ({
            ...p,
            name: p.name,
            purchasePrice: (p.price / 100).toFixed(2),
            markupPercent: null,
            markupExtra: null,
            markupTotal: null,
            transportPercent: null,
            transportExtra: null,
            transportTotal: null,
            salePrice: null,
            weightKg: null,
            amount: null,
            totalWeight: null,
            totalPurchase: null,
            totalSale: null,
            totalTransport: null,
            margin: null,
          }));

        // Объединяем старые и новые, пересчитываем номер строки
        const merged = [...prevRowData, ...newRows];

        return merged.map((row, index) => ({
          ...row,
          num: index + 1, // ← номер строки от 1
        }));
      });
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (rowData.length > 0) {

      const value = kpEditData?.value ?? null;
      const type = kpEditData?.type ?? null;
      const calculate = kpEditData?.calculate ?? null

      setRowData(prevRowData =>
        prevRowData.map(row => {
          let markupPercent = row.markupPercent
          let markupExtra = row.markupExtra
          let markupTotal = row.markupTotal

          let transportPercent = row.transportPercent
          let transportExtra = row.transportExtra
          let transportTotal = row.transportTotal

          let weightKg = row.weightKg
          let amount = row.amount

          if (calculate === 'markup' && row.purchasePrice != null && value != null && type != null) {
            if (type === "percent") {
              let markupExtraValue = markupExtra ?? 0
              markupPercent = value
              markupTotal = (row.purchasePrice * value / 100 + markupExtraValue).toFixed(2);
            } else if (type === "fixed") {
              let markupPercentValue = markupPercent ?? 0
              markupExtra = value
              markupTotal = (value + (row.purchasePrice * markupPercentValue / 100)).toFixed(2);
            }
          }

          if (calculate === 'transport' && row.purchasePrice != null && value != null && type != null) {
            if (type === "percent") {
              let transportExtraValue = transportExtra ?? 0
              transportPercent = value
              transportTotal = (row.weightKg * value + transportExtraValue).toFixed(2);
            } else if (type === "fixed") {
              let transportPercentValue = transportPercent ?? 0
              transportExtra = value
              transportTotal = (value + row.weightKg * transportPercentValue).toFixed(2);
            }
          }

          if (calculate === 'weight') {
            weightKg = value
          }

          if (calculate === 'count') {
            amount = value
          }

          return {
            ...row,
            markupPercent,
            markupExtra,
            markupTotal,
            transportPercent,
            transportExtra,
            transportTotal,
            weightKg,
            amount
          };
        })
      );
    }
  }, [kpEditData]);

  return (
    <>
      <GlobalStyles
        styles={{
          '.ag-theme-alpine .ag-cell': {
            fontWeight: 'normal !important',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif !important"',
            fontSize: '0.875rem !important',
            color: '#344767 !important',
          },
          '.ag-theme-alpine .ag-cell-value': {
            fontWeight: 'normal !important',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif !important"',
            fontSize: '0.875rem !important',
            color: '#344767 !important',
          },
          '.ag-theme-alpine .ag-row-selected, .ag-theme-alpine .ag-row-selected .ag-cell': {
            backgroundColor: '#e3f2fd !important',
            color: 'black !important',
            transition: 'background-color 0.3s ease',
          },
          '.ag-theme-alpine .ag-row-selected.ag-row-focus, .ag-theme-alpine .ag-row-selected.ag-row-focus .ag-cell': {
            backgroundColor: '#bbdefb !important',
          },
          '.ag-theme-alpine .ag-header-cell, .ag-theme-alpine .ag-header-group-cell, .ag-theme-alpine .ag-cell': {
            borderRight: '1px solid black !important',
            boxSizing: 'border-box',
          },
          '.ag-theme-alpine .ag-cell': {
            fontWeight: 'normal !important',
            fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif !important"`,
            fontSize: '0.875rem',
            color: '#344767',
          },
          '.ag-header-cell-label': {
            display: 'flex !important',
            justifyContent: 'center !important',
            alignItems: 'center !important',
            whiteSpace: 'normal !important',
            lineHeight: '1.2em',
            paddingRight: '4px',
            height: '100%',
          },
          '.ag-theme-alpine': {
            outline: 'none !important',
            border: 'none !important',
          },
          '.ag-root-wrapper': {
            border: 'none !important',
            boxShadow: 'none !important',
          },
          '.highlight-column': {
            backgroundColor: '#ffe082 !important',
          }
        }}
      />
      <div style={{ height: 850, width: "100%" }} onContextMenu={(e) => e.preventDefault()}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            //theme={theme}
            headerHeight={60}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            onRowSelected={(event) => console.log('Selected row:', event.data)}
            onCellDoubleClicked={handleRowDoubleClick}
            //onColumnHeaderClicked={handleColumnHeaderClick}
            //onCellContextMenu={handleCellContextMenu}
            suppressContextMenu={true}
            onCellContextMenu={handleCellContextMenu}
            suppressMaintainedSelection={true}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={50}
            getRowId={(params) => params.data.id} // ← Уникальный ключ для строк
            ref={gridRef}
          />
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            backgroundColor: '#f8f9fa', // светло-серый фон как в MD2
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h2" fontWeight="bold">
            Детали строки
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRow && (
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedRow.id}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Наименование:</strong> {selectedRow.name}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Цена закупки:</strong> {selectedRow.purchasePrice}
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Надбавка:</strong> {selectedRow.markupPercent}%
                </Typography>
              </li>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
          <MDButton color="info" onClick={() => setOpenDialog(false)}>Закрыть</MDButton>
        </DialogActions>
      </Dialog>
    </>

  );
});

export default KPGrid;