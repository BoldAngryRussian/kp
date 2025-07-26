import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import uylaLogo from "assets/images/uyta-logo.png"
import MDTypography from "components/MDTypography";
import KPCreationModifier from "./kp-creation-modifier";
import { authFetch } from 'utils/authFetch'

export default function KPCreationStart() {
    const catalogRef = useRef();
    const [open, setOpen] = useState(false);
    const [openAddPersentPriceListDownloader, setOpenAddPersentPriceListDownloader] = useState(false)
    const [kpCode, setKPCode] = useState('');
    const [priceAddtitional, setPriceAddtitional] = useState('')
    const [showModifier, setShowModifier] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [supplierDesc, setSupplierDesc] = useState('')
    const [offerId, setOfferId] = useState('')
    const [customerId, setCustomerId] = useState(null)
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const onDownloadPriceClicked = async (percentToAdd) => {   
        try{
            const payload = { multy: percentToAdd }
            const response = await authFetch(
                `/api/v1/price-list/customer/export/excel`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            )

            if (!response.ok) {
                throw new Error("Ошибка при экспорте файла");
            }

            setOpenAddPersentPriceListDownloader(false)
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "price-list.xlsx";
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Ошибка при экспорте", error)
        }
    }

    const onFindKPClicked = (kpRef) => {
        authFetch(`/api/v1/offer/${kpRef}/find`)
            .then(response => {
                if (!response.ok) {
                    setErrorMessage(`КП ${kpRef} не найдено`)
                    throw new Error("Ошибка при загрузке данных");
                }
                return response.json();
            })
            .then(data => {
                const processed = data.products.map((row, index) => ({
                    id: (index + 1).toString(),
                    name: row.name,
                    price: row.price,
                    markupPercent: row.markupPercent,
                    markupExtra: row.markupExtra,
                    transportPercent: row.transportPercent,
                    transportExtra: row.transportExtra,
                    weightKg: row.weightKg,
                    amount: row.quantity,
                    company: row.supplier,
                    date: row.priceListDate,
                    temperatureCode: row.temperatureMode,
                    measurement: row.measurement
                }));
                setSelectedProducts(processed)
                setSupplierDesc(data.desc)
                setOfferId(data.offerId)
                setCustomerId(data.customerId)
                setOpen(false);         // закрываем модалку
                setShowModifier(true);  // отображаем модификатор
            })
            .catch(error => {
                console.error("Ошибка:", error);
            });
    }

    return (
        <>
            {!showModifier && (
                <MDBox
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="center"
                    height="60vh" // высота всей видимой области экрана
                    gap={3}
                    sx={{
                        //border: "1px solid #ccc"
                    }}
                >
                    <MDBox
                        sx={{
                            //border: "1px solid #ccc",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",         // Убрать ограничение по ширине
                            maxWidth: "1000px",    // Добавить максимум, если нужно
                            margin: "0 auto",      // Центровка
                        }}
                    >
                        <img
                            src={uylaLogo}
                            alt="UYLA Logo"
                            style={{
                                width: "100%",
                                maxWidth: "700px",
                                height: "auto",
                                filter: "grayscale(100%)", // делаем чёрно-белым
                                opacity: 0.05,
                            }}
                        />
                    </MDBox>
                    <MDBox>
                        <MDBox>
                            <MDButton
                                onClick={() => setShowModifier(true)}
                                variant="text"
                                color="secondary"
                                size="small"
                                sx={{
                                    width: '100%',
                                    minWidth: '300px',
                                    fontSize: "1rem",
                                    textTransform: "none",
                                    border: "1px solid #999",
                                    backgroundColor: "#f0f0f0",
                                    "&:hover": {
                                        backgroundColor: "#e0e0e0",
                                    },
                                }}
                            >
                                Создать
                            </MDButton>
                        </MDBox>
                        <MDBox pt={2}>
                            <MDButton
                                onClick={() => setOpen(true)}
                                variant="text"
                                color="secondary"
                                size="small"
                                sx={{
                                    width: '100%',
                                    fontSize: "1rem",
                                    textTransform: "none",
                                    border: "1px solid #999",
                                    backgroundColor: "#f0f0f0",
                                    "&:hover": {
                                        backgroundColor: "#e0e0e0",
                                    },
                                }}
                            >
                                Редактировать
                            </MDButton>
                        </MDBox>
                        <MDBox pt={2}>
                            <MDButton
                                onClick={() => setOpenAddPersentPriceListDownloader(true)}
                                variant="text"
                                color="secondary"
                                size="small"
                                sx={{
                                    width: '100%',
                                    fontSize: "1rem",
                                    textTransform: "none",
                                    border: "1px solid #999",
                                    backgroundColor: "#f0f0f0",
                                    "&:hover": {
                                        backgroundColor: "#e0e0e0",
                                    },
                                }}
                            >
                                Выгрузить прайс-лист
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            )}
            {showModifier && <KPCreationModifier offerId={offerId} customerId={customerId} supplierDesc={supplierDesc} selectedFromCatalog={selectedProducts} />}

            <Dialog
                open={openAddPersentPriceListDownloader}
                onClose={() => setOpenAddPersentPriceListDownloader(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogContent
                    sx={{
                        flex: 1, // растягивает внутри Dialog
                        display: 'flex',
                        flexDirection: 'column',
                        p: 0,
                        height: '20vh', // задаём фиксированную высоту
                    }}
                >
                    <MDBox px={3} py={2}>
                        <TextField
                            label="Введите наценку на товары прайс-листа в %"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={priceAddtitional}
                            onChange={(e) => setPriceAddtitional(e.target.value)}
                            inputProps={{
                                autoComplete: 'off'
                            }}
                        />
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <MDButton
                        onClick={() => { onDownloadPriceClicked(priceAddtitional) }}
                        color="info"
                        variant="contained">
                        Выгрузить
                    </MDButton>
                    <MDButton onClick={() => setOpenAddPersentPriceListDownloader(false)} color="secondary">Отмена</MDButton>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogContent
                    sx={{
                        flex: 1, // растягивает внутри Dialog
                        display: 'flex',
                        flexDirection: 'column',
                        p: 0,
                        height: '20vh', // задаём фиксированную высоту
                    }}
                >
                    <MDBox px={3} py={2}>
                        <TextField
                            label="Введите код КП"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={kpCode}
                            onChange={(e) => setKPCode(e.target.value)}
                            inputProps={{
                                autoComplete: 'off'
                            }}
                        />
                    </MDBox>
                </DialogContent>
                <DialogActions>
                    <MDButton
                        onClick={() => {
                            //catalogRef.current?.handleAddToKP();
                            onFindKPClicked(kpCode);
                        }}
                        color="info"
                        variant="contained">
                        Найти КП
                    </MDButton>
                    <MDButton onClick={() => setOpen(false)} color="secondary">Отмена</MDButton>
                </DialogActions>
            </Dialog>
            {errorMessage && (
                <MDBox
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
        </>
    )
}