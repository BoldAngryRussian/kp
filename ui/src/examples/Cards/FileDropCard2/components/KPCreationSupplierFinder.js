import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import { GridLoader } from "react-spinners";
import { authFetch } from 'utils/authFetch'

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

const columns = [
    { field: 'name', headerName: 'Поставщик', flex: 1 },
];

export default function KPPriceLoadingSupplierFinder({ onLoadingChange, setSelectedSupplierId }) {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [suppliers, setSuppliers] = useState([])
    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
    );

    useEffect(() => {
        handleSupplierClick();
        setSelectedSupplierId?.(null);
    }, []);

    useEffect(() => {
        onLoadingChange?.(loading);
    }, [loading]);

    const transformToGridRows = (data) =>
        data.map(s => ({
            id: s.id,
            name: s.company,
        }));

    const handleSupplierClick = () => {
        setLoading(true);
        const startTime = Date.now();

        authFetch('/api/v1/supplier/all')
            .then((res) => {
                if (!res.ok) throw new Error("Ошибка ответа от сервера");
                return res.json();
            })
            .then((data) => {
                setSuppliers(transformToGridRows(data));
            })
            .catch((err) => {
                console.error('Ошибка при загрузке поставщиков', err);
            })
            .finally(() => {
                const elapsed = Date.now() - startTime;
                const remaining = 1000 - elapsed;
                setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
            });
    };

    // --- LOADING SPINNER ---
    if (loading) {
        return (
            <ThemeProvider theme={customTheme}>
                <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="55vh"
                >
                    <GridLoader color="#1976d2" size={24} margin={2} />
                </MDBox>
            </ThemeProvider>
        );
    }

    return (
        <div>
            {/* Центральная колонка */}
            <ThemeProvider theme={customTheme}>
                <MDBox
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '55vh', // устанавливаем фиксированную высоту в соответствие с Dialog
                        overflow: 'hidden'
                    }}
                >
                    {/* Фиксированный поиск */}
                    <MDBox px={2} pt={2}>
                        <TextField
                            placeholder="Поиск поставщика"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton size="small">
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34C15.08 5.02 12.06 2 8.5 2S2 5.02 2 8.5 5.02 15 8.5 15a6.5 6.5 0 005.34-1.48l.27.28v.79l5 5L20.5 19l-5-5zm-7 0C5.47 14 3 11.53 3 8.5S5.47 3 8.5 3 14 5.47 14 8.5 11.53 14 8.5 14z" />
                                        </svg>
                                    </IconButton>
                                ),
                                sx: { borderRadius: '8px' },
                            }}
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                                    borderWidth: 2,
                                },
                            }}
                        />
                    </MDBox>

                    {/* Прокручиваемая таблица */}
                    <MDBox
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            px: 2,
                            pb: 2,
                        }}
                    >
                        <DataGrid
                            rows={filteredSuppliers}
                            columns={columns}
                            hideFooter
                            disableColumnMenu
                            autoHeight={false} // Важно: отключаем autoHeight
                            rowHeight={32}
                            disableSelectionOnClick
                            onRowClick={(params) => {
                                setSelectedSupplierId?.(params.id);
                            }}
                            sx={{
                                minHeight: '100%', // 🟢 заменено с height на minHeight
                                '& .MuiDataGrid-columnHeaders': { display: 'none' },
                                '& .MuiDataGrid-columnSeparator': { display: 'none' },
                                '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                                    borderBottom: 'none',
                                },
                                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                                    outline: 'none',
                                },
                            }}
                        />
                    </MDBox>
                </MDBox>
            </ThemeProvider>
        </div>
    );
}