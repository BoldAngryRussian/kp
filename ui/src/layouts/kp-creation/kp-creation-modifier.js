import { useState, useMemo, useRef, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from '@mui/material/Tooltip';

import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

import BillingInformation from "layouts/billing/components/BillingInformation";
import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

import TextField from '@mui/material/TextField';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import AddIcon from '@mui/icons-material/Add';
//import KPGrid from "examples/Cards/KPGrid";
import KPGrid from "examples/Cards/KPGrid/KPGrid";
import KPGridEdit from "examples/Modals/KPGridEdit";
import { styled } from '@mui/material/styles';

import MDButton from "components/MDButton";
import CalculateIcon from "@mui/icons-material/Calculate";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ProductCatalog from "layouts/catalog/ProductCatalog";

import KPCreationCustomerFinder from 'layouts/kp-creation/kp-creation-customer-finder'


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
    const catalogRef = useRef();
    const [openDialog, setOpenDialog] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([...selectedFromCatalog])
    const [kpEditData, setKpEditData] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [findCustomerModalOpen, setFindCustomerModalOpen] = useState(false);

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.toggleColumnGroupVisibility('details', detailsVisible);
        }
    }, [detailsVisible]);

    const handleCatalogSelection = (newProducts) => {
        setSelectedProducts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const merged = newProducts.filter(p => !existingIds.has(p.id));
            return [...prev, ...merged];
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
        { label: "📈 Маржа", value: (<strong style={{ color: "green", fontSize: "1.1rem" }}>{summary.totalMargin} ₽</strong>), },
    ];

    const handleCardClick = () => {
        if (!selectedCustomer) {
            setFindCustomerModalOpen(true);
        }
    };

    return (
        <div>
            <KPGridEdit open={openDialog} onClose={() => setOpenDialog(false)} onApply={handleApplyKPGridEdit} />
            <MDBox mb={3}>
                <Card>
                    <MDBox
                        m={2} // ← равномерные отступы со всех сторон
                        p={2}
                        sx={{
                            backgroundColor: '#e3f2fd',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            justifyContent: 'flex-start', // ← теперь кнопки слева
                        }}
                    >
                        <Tooltip title="Рассчитать">
                            <IconButton>
                                <CalculateIcon onClick={() => setOpenDialog(true)} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Добавить">
                            <IconButton>
                                <AddIcon onClick={() => setCatalogOpen(true)} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Сохранить">
                            <IconButton>
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Удалить">
                            <IconButton>
                                <DeleteIcon onClick={handleDeleteSelected} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={detailsVisible ? "Скрыть колонки" : "Показать колонки"}>
                            <IconButton onClick={() => setDetailsVisible(prev => !prev)}>
                                {detailsVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </Tooltip>
                    </MDBox>
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
                                        borderColor: "#ccc", // ← убрали голубую рамку при фокусе
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
                    <Card
                        sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
                        onClick={handleCardClick}
                    >
                        <MDBox p={3} display="flex" justifyContent="center" alignItems="center">
                            {selectedCustomer ? (
                                <BillingInformation customer={selectedCustomer} />
                            ) : (
                                <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                                    <img src="https://cdn-icons-png.flaticon.com/512/4086/4086679.png" alt="Select Contact" width={180} />
                                    <MDTypography variant="h6" mt={2}>
                                        Пожалуйста, выберите поставщика
                                    </MDTypography>
                                </MDBox>
                            )}
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
            <Dialog
                open={catalogOpen}
                onClose={() => setCatalogOpen(false)}
                fullWidth
                maxWidth={false} // убираем ограничение по ширине
                PaperProps={{
                    sx: {
                        m: 3, // отступ от краёв экрана
                    },
                }}
            >
                <DialogContent
                    sx={{
                        flex: 1, // растягивает внутри Dialog
                        display: 'flex',
                        flexDirection: 'column',
                        p: 0,
                        height: '100vh', // задаём фиксированную высоту
                    }}
                >
                    <ProductCatalog ref={catalogRef} onSelect={handleCatalogSelection} />
                </DialogContent>
                <DialogActions>
                    <MDButton
                        onClick={() => {
                            catalogRef.current?.handleAddToKP();
                            setCatalogOpen(false);         // закрываем модалку
                        }}
                        color="info"
                        variant="contained">
                        Добавить в КП
                    </MDButton>
                    <MDButton onClick={() => setCatalogOpen(false)} color="secondary">Отмена</MDButton>
                </DialogActions>
            </Dialog>
            <Dialog
                open={findCustomerModalOpen}
                fullWidth
                maxWidth={false} // Отключаем ограничение MUI
                PaperProps={{
                    sx: {
                        width: '40vw',    // ширина окна
                        height: '60vh',   // высота окна
                    },
                }}
            >
                <DialogContent
                    disableScrollLock
                    sx={{
                        p: 0,
                        height: '100%',
                        overflow: 'hidden', // 🔒 запрещаем скролл здесь
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <KPCreationCustomerFinder />
                </DialogContent>
                <DialogActions>
                    <MDButton
                        onClick={() => {
                            setFindCustomerModalOpen(false);         // закрываем модалку
                        }}
                        color="info"
                        variant="contained">
                        Добавить поставщика
                    </MDButton>
                    <MDButton onClick={() => setFindCustomerModalOpen(false)} color="secondary">Отмена</MDButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}