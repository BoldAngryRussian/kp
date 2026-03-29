import { useState, useRef, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Tooltip from '@mui/material/Tooltip';

import { Dialog, DialogContent, DialogActions, Button, Fade, DialogTitle } from "@mui/material";

import CircularProgress from '@mui/material/CircularProgress';

import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { DataGrid } from '@mui/x-data-grid';

import ConstructionIcon from '@mui/icons-material/Construction';

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

import TextField from '@mui/material/TextField';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
//import KPGrid from "examples/Cards/KPGrid";
import KPGrid from "examples/Cards/KPGrid/KPGrid";
import KPGridEdit from "examples/Modals/KPGridEdit";
import { styled } from '@mui/material/styles';

import { deepmerge } from '@mui/utils';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import baseTheme from 'assets/theme'; // или createTheme() если ты не используешь кастомную тему MUI

import MDButton from "components/MDButton";
import CalculateIcon from "@mui/icons-material/Calculate";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ProductCatalog from "layouts/catalog/ProductCatalog";

import KPCreationCustomerFinder from 'layouts/kp-creation/kp-creation-customer-finder'
import PriceListCustomerInformation from 'layouts/kp-creation/kp-creation-customer-detail-info'
import { authFetch } from 'utils/authFetch'
import { KPSummaryCalculation } from "utils/KPSummaryCalculation";


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

export default function KPCreationModifier({ offerId, customerId, supplierDesc, selectedFromCatalog, additionalServices }) {
    const gridRef = useRef(null);
    const catalogRef = useRef();
    const [openDialog, setOpenDialog] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([...selectedFromCatalog])
    const [kpEditData, setKpEditData] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [findCustomerModalOpen, setFindCustomerModalOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null)
    const [userConfirmedCustomerId, setUserConfirmedCustomerId] = useState(false);
    const [summary, setSummary] = useState({
        totalPurchase: "0.00",
        totalTransport: "0.00",
        totalSale: "0.00",
        totalAdditionalServices: "0.00",
        totalMargin: "0.00",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
    const [deliveryTerms, setDeliveryTerms] = useState(supplierDesc);
    const [kpId, setKpId] = useState(offerId);
    const [createdManager, setCreatedManager] = useState({
        firstName: "",
        secondName: "",
        created: ""
    })
    const [saveMode, setSaveMode] = useState("create"); // "create" или "update"
    const [openAdditionalServicesModal, setOpenAdditionalServicesModal] = useState(false)
    const [addServicesType, setAddServicesType] = useState(null)
    const [addServicesCount, setAddServicesCount] = useState(null)
    const [addServicesPrice, setAddServicesPrice] = useState(null)
    const [selectedAdditionalServiceIds, setSelectedAdditionalServiceIds] = useState([]);
    const [additionalServicesRows, setAdditionalServicesRows] = useState([...additionalServices])
    const [openAddByHandsModal, setOpenAddByHandsModal] = useState(false)
    const [addByHandsProductName, setAddByHandsProductName] = useState(null)
    const [addByHandsMeasurement, setAddByHandsMeasurement] = useState(null)
    const [addByHandsPrice, setAddByHandsPrice] = useState(null)     
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); 
    const [infoMessage, setInfoMessage] = useState("");   
    const [openInfoSnackbar, setOpenInfoSnackbar] = useState(false);         

    const clearAndCloseAddProductsByHandsModal = () => {
        setAddByHandsProductName(null)
        setAddByHandsMeasurement(null)
        setAddByHandsPrice(null)

        setOpenAddByHandsModal(false)
    };

    const handleAddByHandsProduct = () => {
        const formattedDate = (new Date())
            .toLocaleDateString('ru-RU')
            .replace(/\./g, '-');

        gridRef.current?.addProductByHands([{
            company: "Вручную",
            name: addByHandsProductName,
            date: formattedDate,
            measurement: addByHandsMeasurement,
            price: addByHandsPrice * 100
        }])
        clearAndCloseAddProductsByHandsModal()
    };

    useEffect(() => {
        if (infoMessage) {
        const timer = setTimeout(() => {
            setInfoMessage("");
            setOpenInfoSnackbar(false);
        }, 4000);
        return () => clearTimeout(timer);
        }
    }, [infoMessage]);

    useEffect(() => {
        if (errorMessage) {
        const timer = setTimeout(() => {
            setErrorMessage("");
            setOpenErrorSnackbar(false);
        }, 4000);
        return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleAddAdditionalService = () => {
        if (!addServicesType || !addServicesCount || !addServicesPrice) return;

        const count = parseFloat(addServicesCount);
        const price = parseFloat(addServicesPrice);

        setAdditionalServicesRows(prev => [
            ...prev,
            {
                id: prev.length ? Math.max(...prev.map(row => row.id)) + 1 : 1,
                type: addServicesType,
                count: isNaN(count) ? 0 : count,
                price: isNaN(price) ? 0 : price,
                total: (isNaN(count) ? 0 : count) * (isNaN(price) ? 0 : price),
            },
        ]);

        setAddServicesType('');
        setAddServicesCount(0);
        setAddServicesPrice(0);
        setOpenAdditionalServicesModal(false);
    };

    useEffect(() => {
        const data = gridRef.current?.getRowData();
        if (data.length === 0 && additionalServicesRows.length === 0) 
            return         
        setSummary(KPSummaryCalculation(data, additionalServicesRows))
    }, [additionalServicesRows])

    const additionalServicesColumns = [
        { field: 'id', headerName: 'ID', flex: 0.05, hide: true },
        { field: 'type', headerName: 'Дополнительная услуга', flex: 0.8, hide: true },
        { field: 'count', headerName: 'Количество', flex: 0.1 },
        { field: 'price', headerName: 'Цена услуги', flex: 0.1 },
        { field: 'total', headerName: 'Итого', flex: 0.1 }
    ]

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.toggleColumnGroupVisibility('details', detailsVisible);
        }
    }, [detailsVisible]);

    useEffect(() => {
        if (customerId != null) {
            setSelectedCustomerId(customerId)
            setUserConfirmedCustomerId(true)
        }
    }, [customerId]);

    const handleOpenConfirmSave = () => {
        setSaveMode(kpId && kpId !== "" ? "update" : "create");
        setConfirmSaveOpen(true);
    };

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

    const handleCopySelected = () => {
        setKpId("");
        setSaveMode("copy");
        setConfirmSaveOpen(true);
    };

    const handleDeleteSelected = () => {
        const selectedNums = gridRef.current?.getSelectedIds();
        if (!selectedNums?.length) return;
        gridRef.current.deleteRowsByNum(selectedNums);

        setSelectedProducts(prev =>
            prev.filter(row => !selectedNums.includes(row.id))
        );
    };

    const handleDeleteAdditionalServices = () => {
        if (selectedAdditionalServiceIds.length === 0) return;

        setAdditionalServicesRows((prev) =>
            prev.filter((row) => !selectedAdditionalServiceIds.includes(row.id))
        );
        setSelectedAdditionalServiceIds([]);
    };

    const summaryColumns = [
        { Header: "Название", accessor: "label", width: "60%", align: "left", sx: { fontSize: '1rem', fontWeight: 600 } },
        { Header: "Сумма", accessor: "value", width: "40%", align: "right", sx: { fontSize: '1rem', fontWeight: 600 } },
    ];

    const summaryRows = [
        { label: "💰 Сумма закупки", value: `${summary.totalPurchase} ₽` },        
        { label: "🛒 Сумма продажи", value: `${summary.totalSale} ₽` },
        { label: "🚛 Транспорт", value: `${summary.totalTransport} ₽` },
        {
            label: (
                <>
                    <ConstructionIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Доп. услуги
                </>
            ),
            value: `${summary.totalAdditionalServices} ₽`,
        },
        { label: "📈 Маржа", value: (<strong style={{ color: "green", fontSize: "1.1rem" }}>{summary.totalMargin} ₽</strong>), },
    ];

    const handleCardClick = () => {
        if (!selectedCustomer) {
            setFindCustomerModalOpen(true);
        }
    };

    const onEditCustomerClick = () => {
        setSelectedCustomerId(null)
        setUserConfirmedCustomerId(false);
        setFindCustomerModalOpen(true);
    };

    // Функция сохранения КП
    const saveKP = () => {
        const userId = localStorage.getItem("userId");
        const data = gridRef.current?.getRowData() || [];
        const reasons = [];

        if (!selectedCustomerId) reasons.push("заказчик не определен");
        if (!data.length) reasons.push("товары не выбраны");
        if (!userId) reasons.push("идентификатор менеджера не определен");

        if (reasons.length > 0) {
            const message = `Невозможно сохранить КП: ${reasons.join(", ")}`;
            setErrorMessage(message);
            setOpenErrorSnackbar(true);
            setConfirmSaveOpen(false);
            console.error(message, { selectedCustomerId, dataLength: data.length, userId });
            return;
        }
        setIsSaving(true);
        const saveStart = Date.now(); // ← запоминаем время начала
        let isSuccess = false;

        const payload = {
            offerId: kpId,
            customerId: selectedCustomerId,
            managerId: userId,
            terms: deliveryTerms,
            additionalServices: additionalServicesRows.map((elem) => ({
                type: elem.type,
                count: parseInt(elem.count, 10),
                price: elem.price
            })),
            elems: data.map((product) => ({
                name: product.name || "",
                price: parseInt(product.price, 10) || 0,
                markupExtra: product.markupExtra || null,
                markupPercent: product.markupPercent || null,
                transportExtra: product.transportExtra || null,
                transportPercent: product.transportPercent || null,
                quantity: product.amount || 0,
                weightKg: product.weightKg || 0,
                supplier: product.company || null,
                temperatureMode: product.temperatureCode || null,
                priceListDate: product.date || null,
                measurement: product.measurement
            })),
        };

        const url = kpId && kpId !== "" ? "/api/v1/kp/update" : "/api/v1/kp/save";

        authFetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) {
                    let serverError = res.statusText || "Ошибка при сохранении КП";
                    try {
                        const contentType = res.headers.get("content-type") || "";
                        if (contentType.includes("application/json")) {
                            const errorJson = await res.json();
                            serverError = errorJson.message || errorJson.error || JSON.stringify(errorJson);
                        } else {
                            serverError = await res.text();
                        }
                    } catch (err) {
                        console.error("Ошибка разбора ответа сервера:", err);
                    }
                    throw new Error(`Ошибка при сохранении КП: ${serverError}`);
                }
                return res.json();
            })
            .then((data) => {
                setKpId(data.id)
                setCreatedManager(
                    {
                        firstName: data.firstName,
                        secondName: data.secondName,
                        created: data.created
                    }
                )
                isSuccess = true
            })
            .catch((error) => {
                const message = error?.message || "Ошибка при сохранении КП";
                setErrorMessage(message);
                setOpenErrorSnackbar(true);
                console.error("Save error:", error);
            })
            .finally(() => {
                const elapsed = Date.now() - saveStart;
                const remaining = Math.max(0, 2000 - elapsed);
                setTimeout(() => {
                    setIsSaving(false);
                    setConfirmSaveOpen(false);

                    if (isSuccess) {
                        setInfoMessage("КП успешно сохранено");
                        setOpenInfoSnackbar(true);
                    }
                }, remaining);
            });
    };

    return (
        <div>
            <KPGridEdit open={openDialog} onClose={() => setOpenDialog(false)} onApply={handleApplyKPGridEdit} />
            <MDBox mb={3}>
                {kpId && (
                    <MDBox mb={1} display="flex" justifyContent="flex-end">
                        <MDTypography variant="caption" color="success.main">
                            Коммерческое предложение {kpId}, создал менеджер {createdManager.firstName} {createdManager.secondName} от {createdManager.created}
                        </MDTypography>
                    </MDBox>
                )}
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

                        <Tooltip title="Добавить из прайс-листа">
                            <IconButton>
                                <AddBoxIcon onClick={() => setCatalogOpen(true)} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Добавить вручную">
                            <IconButton>
                                <PersonAddIcon onClick={() => setOpenAddByHandsModal(true)} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Добавить дополнительную услугу">
                            <IconButton >
                                <AddRoadIcon onClick={() => setOpenAdditionalServicesModal(true)} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Сохранить">
                            <span>
                                <IconButton
                                    onClick={handleOpenConfirmSave}
                                    disabled={selectedProducts.length === 0 || userConfirmedCustomerId === null || deliveryTerms === ''}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Tooltip title="Копировать">
                            <IconButton onClick={handleCopySelected}>
                                <ContentCopyIcon />
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
                    <MDBox px={2} sx={{ minHeight: 200, height: 'auto' }}>
                        <KPGrid 
                            ref={gridRef} 
                            selectedProducts={selectedProducts} 
                            kpEditData={kpEditData} 
                            summary={setSummary} 
                            additionalServices={additionalServicesRows}
                        />
                    </MDBox>
                </Card>

            </MDBox>
            
            { additionalServicesRows.length > 0 &&
                (
                <MDBox>
                    <Card>
                        <MDBox
                            m={2} // ← равномерные отступы со всех сторон
                            p={2}
                            sx={{
                                backgroundColor: '#d5f6dcff',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2,
                                justifyContent: 'flex-start', // ← теперь кнопки слева
                            }}
                        >
                            <Tooltip title="Удалить">
                                <IconButton>
                                    <DeleteIcon onClick={handleDeleteAdditionalServices} />
                                </IconButton>
                            </Tooltip>
                        </MDBox>
                        <MDBox sx={{ mx: 2 }}>
                            <ThemeProvider theme={customTheme}>
                                <DataGrid
                                    rows={additionalServicesRows}
                                    columns={additionalServicesColumns}
                                    onRowClick={(params) => {
                                    }}
                                    checkboxSelection
                                    onRowSelectionModelChange={(newSelection) => {
                                        const ids = Array.from(newSelection?.ids || []);
                                        setSelectedAdditionalServiceIds(ids);
                                    }}
                                    selectionModel={selectedAdditionalServiceIds}
                                        rowHeight={32}
                                        columnVisibilityModel={{
                                            id: false,
                                        }}
                                        sx={{
                                            height: 500,
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
                            </ThemeProvider>
                        </MDBox>
                    </Card>
                </MDBox>
                )
            }

            <MDBox mt={2}>

                <MDBox display="flex" gap={2}>

                    {/* Правая карточка — BillingInformation */}
                    <Card sx={{ width: "32%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        <MDBox p={1} display="flex" justifyContent="center" alignItems="center">
                            <Fade in timeout={1000}>
                                {userConfirmedCustomerId && selectedCustomerId ? (
                                    <PriceListCustomerInformation customerId={selectedCustomerId} onEditCustomerClick={onEditCustomerClick} />
                                ) : (
                                    <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/4086/4086679.png"
                                            alt="Select Contact"
                                            width={140}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                                            onClick={handleCardClick}
                                            style={{
                                                filter: "grayscale(100%)",
                                                opacity: 0.3,
                                                transition: "transform 0.3s ease-in-out",
                                                cursor: "pointer"
                                            }}
                                        />
                                        <MDTypography variant="body2" mt={2} sx={{ color: 'text.disabled' }}>
                                            Пожалуйста, выберите заказчика
                                        </MDTypography>
                                    </MDBox>
                                )}
                            </Fade>
                        </MDBox>
                    </Card>

                    <Card sx={{ width: "50%" }}>
                        <MDBox p={1}>
                            <TextField
                                value={deliveryTerms}
                                onChange={(e) => setDeliveryTerms(e.target.value)}
                                placeholder="Условия оплаты, дата и место поставки"
                                multiline
                                rows={10}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#fff",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#fff",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#fff",
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
                    </Card>

                    {/* Левая карточка — таблица итогов */}
                    <Card sx={{ width: "30%" }}>
                        <MDBox p={1}>
                            <DataTable
                                table={{ columns: summaryColumns, rows: summaryRows }}
                                showTotalEntries={false}
                                isSorted={false}
                                noEndBorder
                                entriesPerPage={false}
                                showHeader={false}
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
                        minHeight: '900px',
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
                    <KPCreationCustomerFinder setSelectedCustomerId={setSelectedCustomerId} />
                </DialogContent>
                <DialogActions>
                    <MDButton
                        onClick={() => {
                            setFindCustomerModalOpen(false);
                            setUserConfirmedCustomerId(true)
                        }}
                        color="info"
                        variant="contained"
                        disabled={selectedCustomerId == null}
                    >
                        Выбрать заказчика
                    </MDButton>
                    <MDButton onClick={() => setFindCustomerModalOpen(false)} color="secondary">Отмена</MDButton>
                </DialogActions>
            </Dialog>
            <Dialog
                open={confirmSaveOpen}
                onClose={() => !isSaving && setConfirmSaveOpen(false)}
                disableEscapeKeyDown={isSaving}
            >
                <DialogContent>
                    <MDTypography variant="h6">
                        {saveMode === "update" ? (
                            <>Обновить <strong style={{ color: 'orange' }}>существующее</strong> коммерческое предложение?</>
                        ) : saveMode === "copy" ? (
                            <>Сделать <strong style={{ color: 'blue' }}>копию</strong> коммерческого предложения?</>
                        ) : (
                            <>Сохранить <strong style={{ color: 'green' }}>новое</strong> коммерческое предложение?</>
                        )}
                    </MDTypography>
                </DialogContent>
                <DialogActions>
                    <MDButton
                        onClick={saveKP}
                        color="info"
                        variant="contained"
                        disabled={isSaving}
                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        Сохранить
                    </MDButton>
                    <MDButton
                        onClick={() => setConfirmSaveOpen(false)}
                        color="secondary"
                        disabled={isSaving}
                    >
                        Отмена
                    </MDButton>
                </DialogActions>
            </Dialog>

            <Dialog open={openAdditionalServicesModal} maxWidth="sm" fullWidth>
                <DialogTitle>Дополнительные услуги</DialogTitle>
                <DialogContent>
                    <MDBox component="form" display="flex" flexDirection="column" p={1} gap={3}>
                        <TextField 
                            label="Услуга" fullWidth value={addServicesType} onChange={(e) => setAddServicesType(e.target.value)} 
                            autoComplete="off"
                        />
                        <TextField 
                            label="Кол-во" fullWidth value={addServicesCount} onChange={(e) => setAddServicesCount(e.target.value)} 
                            type="number"
                            autoComplete="off"
                            inputProps={{ min: 0 }}
                        />
                        <TextField 
                            label="Цена за единицу" fullWidth value={addServicesPrice} onChange={(e) => setAddServicesPrice(e.target.value)} 
                            type="number"
                            autoComplete="off"
                            inputProps={{ min: 0 }}
                        />
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <MDButton
                        color="info"
                        variant="contained"
                        onClick={handleAddAdditionalService}
                    >
                        Добавить
                    </MDButton>
                    <MDButton
                        color="secondary"
                        onClick={() => {
                            setAddServicesType('')
                            setAddServicesCount(null)
                            setAddServicesPrice(null)
                            setOpenAdditionalServicesModal(false)
                        }}
                    >
                        Отмена
                    </MDButton>
                </DialogActions>
            </Dialog>      

            <Dialog open={openAddByHandsModal} maxWidth="sm" fullWidth>
                <DialogTitle>Ввод продукта вручную</DialogTitle>
                <DialogContent>
                    <MDBox component="form" display="flex" flexDirection="column" p={1} gap={3}>
                        <TextField 
                            label="Наименование продукта" fullWidth 
                            value={addByHandsProductName} 
                            onChange={(e) => setAddByHandsProductName(e.target.value)} 
                            autoComplete="off"
                        />
                        <TextField 
                            label="Единица измерения" fullWidth 
                            value={addByHandsMeasurement} 
                            onChange={(e) => setAddByHandsMeasurement(e.target.value)} 
                            autoComplete="off"
                            inputProps={{ min: 0 }}
                        />
                        <TextField 
                            label="Цена закупочная" fullWidth 
                            value={addByHandsPrice} 
                            onChange={(e) => setAddByHandsPrice(e.target.value)} 
                            type="number"
                            autoComplete="off"
                            inputProps={{ min: 0 }}
                        />
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <MDButton
                        color="info"
                        variant="contained"
                        onClick={handleAddByHandsProduct}
                    >
                        Добавить
                    </MDButton>
                    <MDButton
                        color="secondary"
                        onClick={() => { clearAndCloseAddProductsByHandsModal() }}
                    >
                        Отмена
                    </MDButton>
                </DialogActions>
            </Dialog>                  


            { openErrorSnackbar && errorMessage && (<MDBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            position: 'fixed',
                            top: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#fdecea',
                            border: '1px solid #f5c6cb',
                            borderRadius: '6px',
                            padding: '12px 24px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            zIndex: 9999,
                            transition: 'opacity 0.5s ease-in-out'
                        }}
                        >
                        <MDTypography variant="body2" fontWeight="medium" color="error">
                            {errorMessage}
                        </MDTypography>
                    </MDBox>
            )}

            {openInfoSnackbar && infoMessage && (
                <MDBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    position: 'fixed',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#7FFFD4',
                    border: '1px solid rgb(129, 192, 152)',
                    borderRadius: '6px',
                    padding: '12px 24px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    zIndex: 9999,
                    transition: 'opacity 0.5s ease-in-out'
                }}
                >
                <MDTypography variant="body2" fontWeight="medium" color="success">
                    {infoMessage}
                </MDTypography>
                </MDBox>
            )}

        </div>
    );
}