import React from "react";
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import { Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import MDBadge from "components/MDBadge";
import { deepmerge } from '@mui/utils';
import baseTheme from 'assets/theme'; // или createTheme() если ты не используешь кастомную тему MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import OrdersOverview from 'layouts/dashboard/components/OrdersOverview'
import { authFetch } from 'utils/authFetch'
import { GridLoader } from "react-spinners";


const customTheme = deepmerge(baseTheme, {
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          fontFamily: 'Roboto, sans-serif',
        },
        columnHeaders: {
          backgroundColor: '#ffffff !important',
          fontSize: '0.8rem',
        },
        footerContainer: {
          backgroundColor: '#ffffff !important',
        },
        panel: {
          '& .MuiInputBase-root': {
            fontSize: '0.875rem',
            fontFamily: 'Roboto, sans-serif',
            height: '42px',
            boxSizing: 'border-box',
          },
        },
      },
    },
  },
});

const productColumns = [
  { field: 'id', headerName: '#', width: 60 },
  { field: 'name', headerName: 'Наименование', flex: 1 },
  { field: 'purchase', headerName: 'Закупка, ₽', width: 120 },
  { field: 'markup', headerName: 'Наценка, ₽', width: 120 },
  { field: 'price', headerName: 'Продажа, ₽', width: 120 },
  { field: 'amount', headerName: 'Количество', width: 120 },
  { field: 'weight', headerName: 'Вес, кг', width: 120 },
  { field: 'margin', headerName: 'Маржа, ₽', width: 120 }
];


const columns = [
  { field: 'id', headerName: 'ID', flex: 0.1, hide: true },
  { field: 'kp_ref', headerName: '№', flex: 0.1 },
  {
    field: 'status',
    headerName: 'Статус',
    flex: 0.1,
    renderCell: (params) => (
      <MDBadge
        badgeContent={
          params.value === "FINISHED"
            ? "Оплачено"
            : params.value === "WAIT_CUSTOMER"
              ? "У заказчика"
              : "Новый"
        }
        color={
          params.value === "FINISHED"
            ? "success"
            : params.value === "WAIT_CUSTOMER"
              ? "warning"
              : "info"
        }
        variant="gradient"
        size="sm"
      />
    )
  },
  { field: 'castomer', headerName: 'Заказчик', flex: 0.3 },
  { field: 'phone', headerName: 'Телефон', flex: 0.2 },
  { field: 'manager', headerName: 'Менеджер', flex: 0.2 },
  { field: 'weight', headerName: 'Вес(т)', flex: 0.2 },
  { field: 'amount', headerName: 'Сумма закупки, ₽', flex: 0.2 },
  { field: 'date', headerName: 'Создано', flex: 0.2 },
];

export default function KpExecutingApp() {

  const [productRows, setProductRows] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [company, setCompany] = useState("")
  const [created, setCreated] = useState("")
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    email: ""
  })
  const [manager, setManager] = useState({
    name: "",
    phone: "",
    email: ""
  })
  const [total, setTotal] = useState({
    weight: "",
    pricePurchase: "",
    priceTransport: "",
    priceSell: "",
    marga: ""
  })
  const [showLoader, setShowLoader] = useState(false);
  const [history, setHistory] = useState([])

  // Экспорт в Excel
const handleExport = async () => {
  try {
    const selectedKpRef = filteredProducts.find(row => row.id === selectedRowId)?.kp_ref;
    const response = await authFetch(`/api/v1/export/${selectedKpRef}/excel`);

    if (!response.ok) {
      throw new Error("Ошибка при экспорте файла");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "export.xlsx";
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Ошибка при экспорте:", error);
  }
};

const formatNumber = (value) => {
  return Number(value).toLocaleString('ru-RU');
};

  const onOfferIdSelected = (kpRef) => {
    //setLoadingDetails(true);
    //setShowLoader(true);

    const start = performance.now();

    authFetch(`/api/v1/offer/${kpRef}/details`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }
        return response.json();
      })
      .then(data => {
        const processed = data.products.map((row, index) => ({
          name: row.name,
          purchase: formatNumber(row.purchasePrice),
          markup: formatNumber(row.markupPrice),
          price: formatNumber(row.sellPrice),
          amount: formatNumber(row.quantity),
          weight: formatNumber(row.weight),
          margin: formatNumber(row.marga),
          id: (index + 1).toString(),
        }));
        setTotal(data.finance);
        setManager(data.manager);
        setCustomer(data.customer);
        setCreated(data.created);
        setCompany(data.customerName);
        setHistory(data.history)
        setProductRows(processed);
      })
      .catch(error => {
        console.error("Ошибка:", error);
      })
      .finally(() => {
          setLoadingDetails(false);
          setShowLoader(false);
      });

  };

  useEffect(() => {
    setLoading(true);
    authFetch("/api/v1/offer/all/short")
      .then(response => {
        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }
        return response.json();
      })
      .then(data => {
        const processed = data.map((row, index) => ({
          status: row.type,
          kp_ref: row.id,
          castomer: row.company,
          manager: `${row.managerFirstName} ${row.managerSecondName[0]}. ${row.managerThirdName[0]}.`,
          date: row.date,
          phone: row.phone,
          weight: formatNumber(row.weight),
          amount: formatNumber(row.pricePurchase),
          id: (index + 1).toString(), // ID для DataGrid
        }));
        setFilteredProducts(processed);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка:", error);
        setLoading(false);
      });
  }, []);


  return (
    <MDBox width="100%" display="flex" flexDirection="column" gap={2}>
      <Card>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={3} pt={1}
          sx={{ width: "100%" }}
        >
          <MDTypography variant="h6" fontWeight="medium">
            Управление созданными КП
          </MDTypography>
        </MDBox>
        <ThemeProvider theme={customTheme}>
          <MDBox display="flex" alignItems="center" width="100%" px={2} py={1} sx={{ height: 'auto' }}>
            {loading ? (
              <MDBox display="flex" justifyContent="center" alignItems="center" width="100%" height={300}>
                <GridLoader color="#1976d2" size={24} margin={2} />
              </MDBox>
            ) : (
              <DataGrid
                rows={filteredProducts}
                columns={columns}
                onRowClick={(params) => {
                  setSelectedRowId(params.id);
                  onOfferIdSelected(params.row.kp_ref);
                }}
                autoHeight // <-- Автоматическая высота таблицы
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 20,
                      page: 0,
                    },
                  },
                }}
                pageSizeOptions={[20, 50, 100]}
                pagination
                rowHeight={32}
                columnVisibilityModel={{
                  id: false,
                }}
                sx={{
                  fontSize: '0.875rem',
                  fontFamily: 'Roboto, sans-serif',
                  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-row': {
                    backgroundColor: '#fff',
                  },
                  '& .MuiDataGrid-row.Mui-selected': {
                    backgroundColor: '#e3f2fd !important',
                  },
                  '& .MuiDataGrid-row.Mui-selected:hover': {
                    backgroundColor: '#bbdefb !important',
                  },
                }}
                selectionModel={selectedRowId ? [selectedRowId] : []}
              />
            )}
          </MDBox>
        </ThemeProvider>
      </Card>
      {loadingDetails && showLoader ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" py={3}>
          <GridLoader color="#1976d2" size={24} margin={2} />
        </MDBox>
      ) : selectedRowId === null ? (<div></div>) : (
        <Card>
          <MDBox
            m={2}
            flex={2}
            sx={{
              backgroundColor: '#e3f2fd',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              borderRadius: 2,
              px: 1
            }}
          >
            <Tooltip title="Экспорт">
              <span>
                <IconButton
                  onClick={handleExport}
                >
                  <i className="material-icons">file_download</i>
                </IconButton>
              </span>
            </Tooltip>
          </MDBox>
          <MDBox display="flex" justifyContent="space-between" px={5}>
            <MDTypography variant="body1" fontWeight="bold" color="text">
              {company}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              <strong>Создано от:</strong> {created}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" justifyContent="space-between" px={1} mt={2} mb={1}>
            <MDBox
              flex={1}
              mx={1}
              sx={{
                border: '1px solid',
                borderColor: '#f0f0f0',
                borderRadius: 2,
                p: 2
              }}
            >
              <MDTypography variant="body2" fontWeight="bold" color="text" gutterBottom>
                Заказчик:
              </MDTypography>
              <MDTypography variant="body2" color="text">{customer.name}</MDTypography>
              <MDTypography variant="body2" color="text">{customer.address}</MDTypography>
              <MDTypography variant="body2" color="text">{customer.phone}</MDTypography>
              <MDTypography variant="body2" color="text">{customer.email}</MDTypography>
            </MDBox>
            <MDBox
              flex={1}
              mx={1}
              sx={{
                border: '1px solid',
                borderColor: '#f0f0f0',
                borderRadius: 2,
                p: 2
              }}
            >
              <MDTypography variant="body2" fontWeight="bold" color="text" gutterBottom>
                Менеджер:
              </MDTypography>
              <MDTypography variant="body2" color="text">{manager.name}</MDTypography>
              <MDTypography variant="body2" color="text">{manager.phone}</MDTypography>
              <MDTypography variant="body2" color="text">{manager.email}</MDTypography>
            </MDBox>
            <MDBox
              flex={1}
              mx={1}
              sx={{
                border: '1px solid',
                borderColor: '#f0f0f0',
                borderRadius: 2,
                p: 2
              }}
            >
              <MDTypography variant="body2" fontWeight="bold" color="text" gutterBottom>
                Финансы:
              </MDTypography>
              <MDBox display="flex" justifyContent="space-between">
                <MDTypography variant="body2" color="text">Вес:</MDTypography>
                <MDTypography variant="body2" color="text">{formatNumber(total.weight)} кг</MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between">
                <MDTypography variant="body2" color="text">Закупка:</MDTypography>
                <MDTypography variant="body2" color="text">{formatNumber(total.pricePurchase)} ₽</MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between">
                <MDTypography variant="body2" color="text">Доставка:</MDTypography>
                <MDTypography variant="body2" color="text">{formatNumber(total.priceTransport)} ₽</MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between">
                <MDTypography variant="body2" color="text">Продажа:</MDTypography>
                <MDTypography variant="body2" color="text">{formatNumber(total.priceSell)} ₽</MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between">
                <MDTypography variant="body2" color="text">Маржа:</MDTypography>
                <MDTypography variant="body2" fontWeight="bold" color="success">{formatNumber(total.marga)} ₽</MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
          <Card>
            <MDBox p={2} sx={{ height: 'auto' }}>
              <ThemeProvider theme={customTheme}>
                <DataGrid
                  rows={productRows}
                  columns={productColumns}
                  disableRowSelectionOnClick
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 20,
                        page: 0,
                      },
                    },
                  }}
                  pageSizeOptions={[20, 50, 100]}
                  pagination
                  rowHeight={32}
                  //pageSizeOptions={[10]}
                  //hideFooterPagination
                  sx={{
                    fontSize: '0.875rem',
                    fontFamily: 'Roboto, sans-serif',
                    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within': {
                      outline: 'none',
                    },
                    '& .MuiDataGrid-row': {
                      backgroundColor: '#fff',
                    },
                    '& .MuiDataGrid-row.Mui-selected': {
                      backgroundColor: '#e3f2fd !important',
                    },
                    '& .MuiDataGrid-row.Mui-selected:hover': {
                      backgroundColor: '#bbdefb !important',
                    },
                  }}
                />
              </ThemeProvider>
            </MDBox>
          </Card>
        </Card>          
      )}
      {selectedRowId === null ? (<div></div>) : (<OrdersOverview data={history} />) }                
    </MDBox>
  )
}