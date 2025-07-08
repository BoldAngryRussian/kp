import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { authFetch } from 'utils/authFetch'
import TextField from "@mui/material/TextField";

// @mui material components
import Card from "@mui/material/Card";

import CustomColumnMenu from "components/CustomColumnMenu"
import { GridLoader } from "react-spinners";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { Visibility } from "@mui/icons-material";

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
    { field: 'id', headerName: 'ID', flex: 0.1, hide: true },
    { field: 'name', headerName: 'Название', flex: 0.7 },
    { field: 'company', headerName: 'Компания', flex: 0.1 },
    { field: 'date', headerName: 'Товар от', flex: 0.1 },
    { field: 'measurement', headerName: 'Ед.Измерения', flex: 0.1 },
    { field: 'price', headerName: 'Цена', flex: 0.1 },
    { field: 'price_formatted', headerName: 'Цена', flex: 0.1 }
];

const ProductCatalog = forwardRef(({ onSelect }, ref) => {
    const apiRef = useGridApiRef();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Перетащите .xlsx файл сюда');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchText, setSearchText] = useState('');


    // Загрузка списка продуктов с сервера с искусственной задержкой 1 секунда
    useEffect(() => {
        setLoadingProducts(true);
        authFetch('/api/v1/products/all/short')
            .then(res => res.json())
            .then(data => {
                const converted = data.map(product => ({
                    ...product,
                    price_formatted: (product.price / 100).toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                }));
                setProducts(converted);
                setFilteredProducts(converted);
            })
            .catch(() => setStatus('❌ Ошибка при загрузке списка продуктов'))
            .finally(() => setLoadingProducts(false));

    }, []);

    const handleAddToKP = () => {
        const selectedIDs = apiRef.current.getSelectedRows();

        const selected = Array.from(selectedIDs.values()).map(p => ({
            ...p,
            id: p.id || uuidv4(), // если id нет — создаём
        }));

        if (onSelect && typeof onSelect === 'function') {
            onSelect(selected); // ← просто передаём выбранные
        }
    };

    useImperativeHandle(ref, () => ({
        handleAddToKP
    }));

    useEffect(() => {
        setFilteredProducts(
            products.filter(p =>
                p.name?.toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [searchText, products]);

    return (
        <div>
            {loadingProducts ? (

                <MDBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="80vh"
                >
                    <GridLoader color="#1976d2" size={24} margin={2} />
                </MDBox>
            ) : (
                <MDBox
                    p={5}
                    sx={{
                        flex: 1,
                        overflow: 'hidden', // если нужно
                    }}
                >
                    <TextField
                        label="Фильтрация по названию"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <ThemeProvider theme={customTheme}>
                        <>
                            <DataGrid
                                apiRef={apiRef}
                                rows={filteredProducts.map(row => ({ ...row, id: String(row.id), }))}
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
                                //onRowSelectionModelChange={handleAddToKP}
                                rowHeight={32}
                                columnVisibilityModel={{
                                    id: false,  // скрыта    
                                    price: false            
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
                        </>
                    </ThemeProvider>
                </MDBox>
            )}
        </div>
    )
});

export default ProductCatalog;