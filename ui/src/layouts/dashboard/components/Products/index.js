import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from "assets/theme"; // ← тема из Material Dashboard 2
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuidv4 } from 'uuid';

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from '@mui/material/Tooltip';

import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import { motion } from "framer-motion";

import BillingInformation from "layouts/billing/components/BillingInformation";

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

import CustomColumnMenu from "components/CustomColumnMenu"
import TextField from '@mui/material/TextField';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { Box, CircularProgress } from '@mui/material';
import MDTypography from "components/MDTypography";

import projectsTableData from "layouts/tables/data/kpProjectTableData";

import AddIcon from '@mui/icons-material/Add';
import KPGrid from "examples/Cards/KPGrid";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import KPGridEdit from "examples/Modals/KPGridEdit";
import { styled } from '@mui/material/styles';

import { GlobalStyles } from '@mui/material'; // ← если ещё не импортировано

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: '#333', // тёмный фон
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
    padding: '8px 12px',
    borderRadius: 6,
    boxShadow: theme.shadows[2],
  },
}));

const tabsTheme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#7b809a',
          '&.Mui-selected': {
            color: '#1976d2',
          },
          '&:hover': {
            color: '#B8860B',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#1976d2',
          height: 3,
          borderRadius: 2,
        },
      },
    },
  },
});

/*
  const columns = [
      { Header: "Номер", accessor: "id", width: "5%", align: "left" },
      { Header: "Название", accessor: "name", width: "60%", align: "left" },
      { Header: "Цена", accessor: "price", width: "35%", align: "left" },
  ];
*/
  const columns = [
  { field: 'id', headerName: 'ID', flex: 0.1, hide: true },
  { field: 'name', headerName: 'Название', flex: 0.7 },
  { field: 'price', headerName: 'Цена', flex: 0.1 },
  ];


const customTheme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          fontFamily: 'Roboto, sans-serif',
        },
        columnHeaders: {
          backgroundColor: '#f8f9fa',
          color: '#344767',
          fontWeight: 'bold',
        },
      },
    },
  },
});



function Products() {
    const gridRef = useRef(null);
    const apiRef = useGridApiRef();
    const [status, setStatus] = useState('Перетащите .xlsx файл сюда');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { columns: pColumns, rows: pRows } = projectsTableData();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([])
    const [kpEditData, setKpEditData] = useState(null);
    const [calculateType, setCalculateType] = useState('catalog');

    // Загрузка списка продуктов с сервера
    useEffect(() => {
        console.log("useEffect вызван");
        setLoadingProducts(true);
        fetch('/api/v1/products/list')
        .then(res => res.json())
        .then(data => {
            setProducts(data);            
            setFilteredProducts(data);
        })
        .catch(() => setStatus('❌ Ошибка при загрузке списка продуктов'));
    }, []);

/*
    useEffect(() => {
      if (calculateType === 'catalog') {
        setSelectedProducts([]);
      }
    }, [calculateType]);
*/
    // Фильтрация по поиску
    useEffect(() => {
        const filtered = products.filter(product =>
        Object.values(product).some(value =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);

const summary = useMemo(() => {
  const totals = {
    totalPurchase: 0,
    totalTransport: 0,
    totalSale: 0,
    totalMargin: 0,
  };

  selectedProducts.forEach((item) => {
    const amount = parseFloat(item.amount) || 0;
    const purchasePrice = parseFloat(item.purchasePrice) || 0;
    const transport = parseFloat(item.transportTotal) || 0;
    const sale = parseFloat(item.salePrice) || 0;
    const margin = parseFloat(item.margin) || 0;

    totals.totalPurchase += amount * purchasePrice;
    totals.totalTransport += amount * transport;
    totals.totalSale += amount * sale;
    totals.totalMargin += margin;
  });

  return {
    totalPurchase: totals.totalPurchase.toFixed(2),
    totalTransport: totals.totalTransport.toFixed(2),
    totalSale: totals.totalSale.toFixed(2),
    totalMargin: totals.totalMargin.toFixed(2),
  };
}, [selectedProducts]);

    const handleOpenPdf = () => {
      fetch("/api/v1/pdf")
        .then(res => {
          if (!res.ok) throw new Error("Ошибка загрузки PDF");
          return res.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
        })
        .catch(err => {
          console.error("PDF не загружен:", err);
        });
    };    

    const handleRadioCalculateChange = (event) => {
        setCalculateType(event.target.value);
    };

    const handleAddToKP = () => {
      const selectedIDs = apiRef.current.getSelectedRows();
      const selected = Array.from(selectedIDs.values()).map(p => ({
        ...p,
        id: p.id || uuidv4() // ← генерируем id, если его нет
      }));

      setSelectedProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = selected.filter(p => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
    };

    const handleApplyKPGridEdit = (data) => {
        setKpEditData(data); // сохраняем в состояние, если надо
        setOpenDialog(false); // закрываем диалог
    };

    const handleDeleteSelected = () => {
      const selectedNums = gridRef.current?.getSelectedIds();
      if (!selectedNums?.length) return;
      gridRef.current.deleteRowsByNum(selectedNums);
    };

const summaryColumns = [
  { Header: "Название", accessor: "label", width: "60%", align: "left", sx: { fontSize: '1rem', fontWeight: 600 } },
  { Header: "Сумма", accessor: "value", width: "40%", align: "right", sx: { fontSize: '1rem', fontWeight: 600 } },
];

const summaryRows = [
  { label: "💰 Сумма закупки", value: `${summary.totalPurchase} ₽` },
  { label: "🚛 Транспортные расходы", value: `${summary.totalTransport} ₽` },
  { label: "🛒 Цена продажи", value: `${summary.totalSale} ₽` },
  { label: "📈 Маржа", value: `${summary.totalMargin} ₽` },
];

    return (

<>
<MDBox display="flex" justifyContent="center" mt={1} mb={2}>
  <MDBox
    sx={{ width: 500 }}
  >
    <ThemeProvider theme={tabsTheme}>
    <Tabs
      value={calculateType}
      onChange={(e, newValue) => setCalculateType(newValue)}
      centered
      TabIndicatorProps={{
        sx: {
          backgroundColor: '#1976d2', // Цвет подчёркивания
          height: 3,
          borderRadius: 2,
        },
      }}
    >
      <Tab
        value="catalog"
        label="Каталог товаров"
      />
      <Tab
        value="proposal"
        label="Коммерческое предложение"
      />
    </Tabs>
    </ThemeProvider>
  </MDBox>
</MDBox>
{calculateType === 'proposal' && (
  <>
  <Fade in={calculateType === 'proposal'} timeout={400} unmountOnExit>
  <div>
  <KPGridEdit open={openDialog} onClose={() => setOpenDialog(false)} onApply={handleApplyKPGridEdit}/>
  <MDBox mb={1} display="flex" justifyContent="flex-end">
    <StyledTooltip title="Редактировать" arrow>
      <IconButton 
          onClick={() => setOpenDialog(true)}
          sx={{
            color: '#0000FF',
            width: 36,
            height: 36,
            borderRadius: '50%',       
            backgroundColor: '#e3f2fd', 
            transition: '0.3s ease',
            '&:hover': {
              backgroundColor: '#B0E0E6',
            }
          }}
      >
        <EditIcon sx={{ fontSize: 32 }} />
      </IconButton>
    </StyledTooltip>
        <StyledTooltip title="Добавить">
        <IconButton 
            onClick={() => {
              // Вставь свою логику удаления
              console.log("Добавление элемента");
            }}
            sx={{
              color: '#006400',
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'e3f2fd', 
              transition: '0.3s ease',
              '&:hover': {
                backgroundColor: '#B0E0E6',
              }
            }}
        >
          <AddIcon sx={{ fontSize: 64 }} />
        </IconButton>
    </StyledTooltip>
    <StyledTooltip title="Удалить">
        <IconButton 
            color="primary"
            onClick={handleDeleteSelected}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'e3f2fd', 
              transition: '0.3s ease',
              '&:hover': {
                backgroundColor: '#B0E0E6',
              }
            }}
        >
          <DeleteIcon sx={{ fontSize: 32 }} />
        </IconButton>
  </StyledTooltip>
  </MDBox>
<MDBox mb={3}>           
            <Card>
                <MDBox pt={3} px={2}>
                    <KPGrid ref={gridRef} selectedProducts={selectedProducts} kpEditData={kpEditData} />
                </MDBox>
            </Card>
</MDBox>

<MDBox mt={1}>
  <MDBox mb={2}>
    <MDBox width="100%">
      <TextField
        placeholder="Условия оплаты, дата и место поставки"
        multiline
        rows={6}
        fullWidth
        variant="outlined"
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#ccc",
            },
            "&:hover fieldset": {
              borderColor: "#999",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
            },
          },
        }}
        InputProps={{
          style: {
            fontSize: "1rem",
            fontFamily: "Roboto, sans-serif",
          },
        }}
      />
    </MDBox>
  </MDBox>
<MDBox mt={2} display="flex" gap={2}>

  {/* Правая карточка — BillingInformation */}
  <Card sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
    <MDBox p={3}>
      <BillingInformation />
    </MDBox>
  </Card>
  {/* Левая карточка — таблица итогов */}
  <Card sx={{ width: "50%" }}>
    <MDBox p={3}>
      <MDTypography variant="h4" gutterBottom>
        Итого
      </MDTypography>
      <MDBox display="flex" alignItems="center" lineHeight={0} mb={2}>
        <Icon
          sx={{
            fontWeight: "bold",
            color: ({ palette: { info } }) => info.main,
            mt: -0.5,
          }}
        >
          analytics
        </Icon>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;<strong>{selectedProducts.length}</strong> позиций
        </MDTypography>
      </MDBox>

      <DataTable
        table={{ columns: summaryColumns, rows: summaryRows }}
        showTotalEntries={false}
        isSorted={false}
        noEndBorder
        entriesPerPage={false}
      />
    </MDBox>
  </Card>
</MDBox>
</MDBox>

</div>
</Fade>
</>
)}
{calculateType === 'catalog' && (
  <>
    <Fade in={calculateType === 'catalog'} timeout={400} unmountOnExit>
    <div>
    <MDBox  mb={1} display="flex" gap={2} justifyContent="flex-end">
      <MDButton color="info" onClick={handleAddToKP}>Добавить в КП</MDButton>
      <MDButton color="success" onClick={handleOpenPdf}>Выгрузить КП в PDF</MDButton>
  </MDBox>
  <Card>
        <MDBox    
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            sx={{ width: "100%" }}
        >
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              Доступные товары
            </MDTypography>
            <MDBox display="flex" alignItems="center" lineHeight={0}>
              <Icon
                sx={{
                  fontWeight: "bold",
                  color: ({ palette: { info } }) => info.main,
                  mt: -0.5,
                }}
              >
                done
              </Icon>
              <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;<strong>2000</strong> на текущий момент
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>        
        <ThemeProvider theme={customTheme}>
        <MDBox display="flex" alignItems="center" width="100%" px={2} py={1}>
              {loading && <CircularProgress />}        
              <DataGrid
                  apiRef={apiRef}
                  rows={ filteredProducts.map(row => ({...row,id: String(row.id),})) }
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 20,
                        page: 0,
                      },
                    },
                  }}
                  pageSizeOptions={[20, 50, 100]}
                  pagination // ← ОБЯЗАТЕЛЬНО
                  checkboxSelection
                  components={{ ColumnMenu: CustomColumnMenu, }}               
                  rowHeight={32}
                  columnVisibilityModel={{
                    id: false,  // скрыта                
                  }}
                  sx={{
                    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within': {
                      outline: 'none',
                    }
                  }}
              />
        </MDBox>
        </ThemeProvider>
      </Card>
      </div>
      </Fade>
  </>
)}

    </>
  );
}

export default Products;
