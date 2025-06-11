import { useState, useMemo, useRef, useEffect } from "react";

import { useGridApiRef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from '@mui/material/Tooltip';

import BillingInformation from "layouts/billing/components/BillingInformation";

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

import TextField from '@mui/material/TextField';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import projectsTableData from "layouts/tables/data/kpProjectTableData";

import AddIcon from '@mui/icons-material/Add';
import KPGrid from "examples/Cards/KPGrid";
import KPGridEdit from "examples/Modals/KPGridEdit";
import { styled } from '@mui/material/styles';


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



export default function KPCreationModifier({ selectedFromCatalog }) {
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
/*
    useEffect(() => {
        if (selectedFromCatalog?.length) {
            console.log("Получены товары из каталога:", selectedFromCatalog);
            // можно использовать selectedFromCatalog для инициализации
        }
    }, [selectedFromCatalog]);
*/
    const handleApplyKPGridEdit = (data) => {
        setKpEditData(data); // сохраняем в состояние, если надо
        setOpenDialog(false); // закрываем диалог
    };

    const handleDeleteSelected = () => {
        const selectedNums = gridRef.current?.getSelectedIds();
        if (!selectedNums?.length) return;
        gridRef.current.deleteRowsByNum(selectedNums);
    };

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
        <div>
            <KPGridEdit open={openDialog} onClose={() => setOpenDialog(false)} onApply={handleApplyKPGridEdit} />
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
                        <KPGrid ref={gridRef} selectedProducts={selectedFromCatalog} kpEditData={kpEditData} />
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
    );
}