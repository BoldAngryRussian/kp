import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Box,
    Card,
    Divider,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddIcon from "@mui/icons-material/Add";

const suppliers = [
    { id: 1, name: 'ООО "Ромашка"' },
    { id: 2, name: 'OOO "Букашка"' },
    { id: 3, name: 'OOO "Озон"' },
    { id: 4, name: 'ООО "Ромашка"' },
    { id: 5, name: 'OOO "Букашка"' },
    { id: 6, name: 'OOO "Озон"' },
    { id: 7, name: 'ООО "Ромашка"' },
    { id: 8, name: 'OOO "Букашка"' },
    { id: 9, name: 'OOO "Озон"' },
    { id: 10, name: 'ООО "Ромашка"' },
    { id: 11, name: 'OOO "Букашка"' },
    { id: 12, name: 'OOO "Озон"' },
    { id: 13, name: 'ООО "Ромашка"' },
    { id: 14, name: 'OOO "Букашка"' },
    { id: 15, name: 'OOO "Озон"' },
    { id: 16, name: 'ООО "Ромашка"' },
    { id: 17, name: 'OOO "Букашка"' },
    { id: 18, name: 'OOO "Озон"' },
    { id: 19, name: 'ООО "Ромашка"' },
    { id: 20, name: 'OOO "Букашка"' },
    { id: 21, name: 'OOO "Озон"' },
    { id: 22, name: 'ООО "Ромашка"' },
    { id: 23, name: 'OOO "Букашка"' },
    { id: 24, name: 'OOO "Озон"' },
    { id: 25, name: 'OOO "Букашка"' },
    { id: 26, name: 'OOO "Озон"' },
    { id: 27, name: 'ООО "Ромашка"' },
    { id: 28, name: 'OOO "Букашка"' },
    { id: 29, name: 'OOO "Озон"' },
    { id: 30, name: 'ООО "Ромашка"' },
    { id: 31, name: 'OOO "Букашка"' },
    { id: 32, name: 'OOO "Озон"' },
    { id: 33, name: 'ООО "Ромашка"' },
    { id: 34, name: 'OOO "Букашка"' },
    { id: 35, name: 'OOO "Озон"' },
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

const columns = [
    { field: 'name', headerName: 'Поставщик', flex: 1 },
];

export default function KPCreationCustomerFinder() {

    const [searchText, setSearchText] = useState('');
    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
    );

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
                                            <path d="M15.5 14h-.79l-.28-.27A6.471..." />
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
                            onRowClick={() => { }}
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