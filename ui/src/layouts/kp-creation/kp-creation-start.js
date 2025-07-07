import React, { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import uylaLogo from "assets/images/uyta-logo.png"
import ProductCatalog from "layouts/catalog/ProductCatalog"
import KPCreationModifier from "./kp-creation-modifier";
import { authFetch } from 'utils/authFetch'

export default function KPCreationStart() {
    const catalogRef = useRef();
    const [open, setOpen] = useState(false);
    const [kpCode, setKPCode] = useState('');
    const [showModifier, setShowModifier] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const onFindKPClicked = (kpRef) => {
        authFetch(`/api/v1/offer/${kpRef}/find`)
            .then(response => {
                if (!response.ok) {
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
                    amount: row.quantity
                }));
                setSelectedProducts(processed)
            })
            .catch(error => {
                console.error("Ошибка:", error);
            })
            .finally(() => {
                setOpen(false);         // закрываем модалку
                setShowModifier(true);  // отображаем модификатор
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
                    </MDBox>
                </MDBox>
            )}
            {showModifier && <KPCreationModifier selectedFromCatalog={selectedProducts} />}
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
        </>
    )
}