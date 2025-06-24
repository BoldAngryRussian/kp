import { useState, useRef, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Tooltip from '@mui/material/Tooltip';

import { Dialog, DialogContent, DialogActions, Button, Fade } from "@mui/material";

import CircularProgress from '@mui/material/CircularProgress';

import VisibilityIcon from '@mui/icons-material/Visibility';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
import PriceListCustomerInformation from 'layouts/kp-creation/kp-creation-customer-detail-info'
import { authFetch } from 'utils/authFetch'


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
    const [selectedCustomerId, setSelectedCustomerId] = useState(null)
    const [userConfirmedCustomerId, setUserConfirmedCustomerId] = useState(false)
    const [summary, setSummary] = useState({
        totalPurchase: "0.00",
        totalTransport: "0.00",
        totalSale: "0.00",
        totalMargin: "0.00",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
    const [deliveryTerms, setDeliveryTerms] = useState("");
    const [kpId, setKpId] = useState("");
    const [createdManager, setCreatedManager] = useState({
        firstName: "",
        secondName: "",
        created: ""
    })
    const [saveMode, setSaveMode] = useState("create"); // "create" или "update"

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.toggleColumnGroupVisibility('details', detailsVisible);
        }
    }, [detailsVisible]);

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

    const summaryColumns = [
        { Header: "Название", accessor: "label", width: "60%", align: "left", sx: { fontSize: '1rem', fontWeight: 600 } },
        { Header: "Сумма", accessor: "value", width: "40%", align: "right", sx: { fontSize: '1rem', fontWeight: 600 } },
    ];

    const summaryRows = [
        { label: "💰 Сумма закупки", value: `${summary.totalPurchase} ₽` },
        { label: "🚛 Транспорт", value: `${summary.totalTransport} ₽` },
        { label: "🛒 Сумма продажи", value: `${summary.totalSale} ₽` },
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
        const data = gridRef.current?.getRowData();
        if (!selectedCustomerId || data.length === 0 || userId === '') return;

        setIsSaving(true);
        const saveStart = Date.now(); // ← запоминаем время начала

        const payload = {
            offerId: kpId,
            customerId: selectedCustomerId,
            managerId: userId,
            terms: deliveryTerms,
            elems: data.map((product) => ({
                name: product.name || "",
                price: parseInt(product.price, 10) || 0,
                markupExtra: product.markupExtra || null,
                markupPercent: product.markupPercent || null,
                transportExtra: product.transportExtra || null,
                transportPercent: product.transportPercent || null,
                quantity: product.amount || 0,
                weightKg: product.weightKg || 0,
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
            .then((res) => {
                if (!res.ok) throw new Error("Ошибка при сохранении КП");
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
            })
            .catch((error) => {
                console.error("Save error:", error);
            })
            .finally(() => {
                const elapsed = Date.now() - saveStart;
                const remaining = Math.max(0, 2000 - elapsed);
                setTimeout(() => {
                    setIsSaving(false);
                    setConfirmSaveOpen(false);
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

                        <Tooltip title="Добавить">
                            <IconButton>
                                <AddIcon onClick={() => setCatalogOpen(true)} />
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

                        <Tooltip title="Удалить">
                            <IconButton>
                                <DeleteIcon onClick={handleDeleteSelected} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Копировать">
                            <IconButton onClick={handleCopySelected}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={detailsVisible ? "Скрыть колонки" : "Показать колонки"}>
                            <IconButton onClick={() => setDetailsVisible(prev => !prev)}>
                                {detailsVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </Tooltip>
                    </MDBox>
                    <MDBox px={2} sx={{ minHeight: 200, maxHeight: 2000, height: 'auto' }}>
                        <KPGrid ref={gridRef} selectedProducts={selectedProducts} kpEditData={kpEditData} summary={setSummary} />
                    </MDBox>
                </Card>

            </MDBox>

            <MDBox >

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
        </div>
    );
}