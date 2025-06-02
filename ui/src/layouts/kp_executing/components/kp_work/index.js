import React from "react";
import MDBox from "components/MDBox";
import { Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import MDBadge from "components/MDBadge";
import { deepmerge } from '@mui/utils';
import baseTheme from 'assets/theme'; // или createTheme() если ты не используешь кастомную тему MUI


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

  const columns = [
  { field: 'id', headerName: 'ID', flex: 0.1, hide: true },
  { field: 'kp_ref', headerName: '№', flex: 0.1 },
  { 
    field: 'status',
    headerName: 'Статус',
    flex: 0.2,
    renderCell: (params) => (
      <MDBadge
        badgeContent={params.value}
        color={
          params.value === "Готово"
            ? "success"
            : params.value === "На согласовании"
            ? "warning"
            : "info"
        }
        variant="gradient"
        size="sm"
      />
    )
  },
  { field: 'castomer', headerName: 'Заказчик', flex: 0.2 },
  { field: 'phone', headerName: 'Телефон', flex: 0.2 },
  { field: 'manager', headerName: 'Менеджер', flex: 0.2 },  
  { field: 'weight', headerName: 'Вес(т)', flex: 0.2 },
  { field: 'amount', headerName: 'Общая сумма', flex: 0.2 },
  { field: 'date', headerName: 'Создано', flex: 0.2 },
  ];

export default function KpExecutingApp(){
    const filteredProducts = [
      { id: 1, status: "В работе", kp_ref: 1, castomer: 'ООО "Лютик"', manager: "Иванов В.В", date: '01-01-2025', amount: '100.000', phone: '+7(926)777-77-77', weight: '20.000' },
      { id: 2, status: "На согласовании", kp_ref: 2, castomer: 'ООО "Озон"', manager: "Сидоров В.В", date: '01-01-2025', amount: '250.000', phone: '+7(926)888-88-88', weight: '10.000' },
      { id: 3, status: "Готово", kp_ref: 3, castomer: 'ООО "Цветочек"', manager: "Петров В.В", date: '01-01-2025', amount: '1.000.000', phone: '+7(926)999-99-99', weight: '15.000' },
    ].map(row => ({ ...row, id: row.id.toString() }));
    return (
        <MDBox width="100%" display="flex" flexDirection="column" gap={2}>
            <Card>
              <MDBox 
                display="flex" 
                justifyContent="space-between"
                alignItems="center"
                p={3}
                sx={{ width: "100%" }}
              >
                <MDTypography variant="h6" fontWeight="medium">
                  Управление созданными КП
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
                    &nbsp;<strong>74</strong> на текущий момент
                  </MDTypography>
                </MDBox>
              </MDBox>
              <ThemeProvider theme={customTheme}>
                <MDBox display="flex" alignItems="center" width="100%" px={2} py={1} mt={3}>
                  <DataGrid
                    rows={filteredProducts}
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
                  />
                </MDBox>
              </ThemeProvider>
            </Card>
        </MDBox>

    )
}