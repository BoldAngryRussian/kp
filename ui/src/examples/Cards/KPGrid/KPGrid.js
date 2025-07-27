// Пример AG Grid с многоуровневой шапкой и данными из Excel-подобной таблицы

import React, { useMemo, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { AgGridReact } from "ag-grid-react";
import { GlobalStyles } from '@mui/material';
import MDButton from "components/MDButton";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import { calculateUpdatedRows, recalculationWhenRowDataChanged } from 'utils/KPCalculation';
import { KPSummaryCalculation } from 'utils/KPSummaryCalculation'
import { v4 as uuidv4 } from 'uuid';
import MDBox from 'components/MDBox';

ModuleRegistry.registerModules([AllCommunityModule]);

const KPGrid = forwardRef(({ selectedProducts, kpEditData, summary, additionalServices }, ref) => {

  const gridRef = useRef(null);
  const gridApiRef = useRef(null);     // новая ссылка на API
  const columnApiRef = useRef(null);   // новая ссылка на columnApi
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%", position: 'relative' }), []);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [pendingRecalc, setPendingRecalc] = useState(false);


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


  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      resizable: true,
      sortable: false,
      tooltip: true, // ← вот это добавь
      cellStyle: { borderRight: '1px solid #ccc' }
    };
  }, []);

  const initialColumnDefs = [
    { headerName: "№", field: "num", width: 50, editable: false },
    { headerName: "Поставщик", field: "company", width: 120, editable: false, hideGroup: 'details' },
    { headerName: "Наименование", field: "name", width: 630 },
    { headerName: "Прайс", field: "date", width: 100, editable: false, hideGroup: 'details' },
    { headerName: "Ед.Изм", field: "measurement", width: 90, editable: false, hideGroup: 'details' },
    {
      field: "temperatureCode",
      headerName: "Темп.режим",
      editable: true,
      width: 140,
      hideGroup: 'details',
      valueParser: params => {
        const parsed = parseInt(params.newValue, 10);
        const code = isNaN(parsed) || parsed < 1 || parsed > 4 ? null : parsed;
        const temperatureMap = {
          1: "Заморозка",
          2: "Охлажденка",
          3: "Тёплый",
          4: "Без температурный"
        };        
        return temperatureMap[code] || null;
      }
    },
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
        { headerName: "от цены, %", field: "markupPercent", width: 80 },
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
    },
    { headerName: "Вес, кг", field: "weightKg", width: 100, hideGroup: 'details', },
    { headerName: "Кол-во", field: "amount", width: 90 },
    {
      headerName: "Вес итого, кг", field: "totalWeight", width: 120, editable: false,
    },
    {
      headerName: "Стоимость закупки, ₽",
      field: "totalPurchase",
      width: 150,
      editable: false,
      hideGroup: 'details',
      headerStyle: { backgroundColor: '#FFFFF0' },
      cellStyle: { backgroundColor: '#FFFFF0' },
    },
    {
      headerName: "Стоимость продажи, ₽",
      field: "totalSale",
      width: 120,
      editable: false,
      headerStyle: { backgroundColor: '#FAF0E6' },
      cellStyle: { backgroundColor: '#FAF0E6' },
    },
    {
      headerName: "Транспортные услуги, ₽",
      field: "totalTransport",
      width: 120,
      editable: false,
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
    },
  ];

  const [columnDefs, setColumnDefs] = useState(initialColumnDefs);

  const onGridReady = (params) => {
    gridRef.current = params.api;
    gridApiRef.current = params.api;
    columnApiRef.current = params.columnApi; // ← самый надёжный способ
  };

  const getSelectedIds = () => {
    const selectedNodes = gridRef.current?.getSelectedNodes() || [];
    return selectedNodes.map(n => n.data.id);
  };

  useImperativeHandle(ref, () => ({
    getSelectedIds,
    deleteRowsByNum: (ids) => {
      const filtered = rowData.filter(row => !ids.includes(row.id));
      const updateRowData = filtered.map((row, index) => ({
        ...row,
        num: index + 1, // пересчёт номера
      }));
      setRowData(updateRowData)
      summary?.(KPSummaryCalculation(updateRowData, additionalServices))
    },
    toggleColumnGroupVisibility: (groupName, visible) => {
      const updatedDefs = columnDefs.map(col => {
        if (col.hideGroup === groupName) {
          return { ...col, hide: !visible };
        }
        return col;
      });
      setColumnDefs(updatedDefs);
    },
    getRowData: () => {
      return rowData;
    },
    addProductByHands: (productsToAdd) => { mergeProducts(productsToAdd) },
  }));

  const mergeProducts = (productsToAdd) => {
      if (productsToAdd && Array.isArray(productsToAdd)) {
        setRowData(currentProducts => { return mergeProductsArrays(currentProducts, productsToAdd) })
        setPendingRecalc(true);
      }
  };

  const mergeProductsArrays = (prevRowData, productsToAdd) => {
              // Уникальные имена уже в таблице
        const existingNames = new Set(prevRowData.map(row => row.id));

        // Добавляем только новые строки
        const newRows = productsToAdd
          .filter(p => !existingNames.has(p.id))
          .map(p => ({
            ...p,
            id: p.id ?? uuidv4(),
            name: p.name,
            purchasePrice: (p.price / 100).toFixed(2),
            markupPercent: p.markupPercent ?? null,
            markupExtra: p.markupExtra ?? null,
            markupTotal: null,
            transportPercent: p.transportPercent ?? null,
            transportExtra: p.transportExtra ?? null,
            transportTotal: null,
            salePrice: null,
            weightKg: p.weightKg ?? null,
            amount: p.amount ?? null,
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
  };

  useEffect(() => {
    mergeProducts(selectedProducts)
  }, [selectedProducts]);

  useEffect(() => {
    if (pendingRecalc && rowData.length > 0) {          
      recalculateOnChange(rowData)
      setPendingRecalc(false); // сбрасываем флаг
    }
  }, [rowData, pendingRecalc]);

  useEffect(() => {
    if (rowData.length > 0) {
      const updated = calculateUpdatedRows(rowData, kpEditData, getSelectedIds());
      refreshRowDataAndTotalInfo(updated);
    }
  }, [kpEditData]);

  const refreshRowDataAndTotalInfo = (updated) => {
      setRowData(updated);
      summary?.(KPSummaryCalculation(updated, additionalServices))
  }
  // Функция для пересчёта при изменении данных
  const recalculateOnChange = (rows) => {
    if (rows.length > 0) {
      const updated = recalculationWhenRowDataChanged(rows);
      refreshRowDataAndTotalInfo(updated);
    }
  };

  const handleCellValueChange = () => {
    const allRows = gridRef.current?.getRenderedNodes().map(node => node.data) || [];
    recalculateOnChange(allRows);
  };

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
      <MDBox>
        <div style={{ width: '100%' }}>
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              headerHeight={60}
              domLayout="autoHeight" // ← вот ключ!
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onCellValueChanged={handleCellValueChange}
              onRowSelected={(event) => console.log('Selected row:', event.data)}
              onCellDoubleClicked={handleRowDoubleClick}
              suppressContextMenu={true}
              suppressMaintainedSelection={true}
              onGridReady={onGridReady}
              pagination={true}
              paginationPageSize={50}
              getRowId={(params) => params.data.id} // ← Уникальный ключ для строк
              ref={gridRef}
              enableBrowserTooltips={true}
            />
          </div>
        </div>
      </MDBox>
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