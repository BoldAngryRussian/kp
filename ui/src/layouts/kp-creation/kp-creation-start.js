import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import uylaLogo from "assets/images/uyta-logo.png"
import ProductCatalog from "layouts/catalog/ProductCatalog"

export default function KPCreationStart() {
    const [open, setOpen] = useState(false);

    return (
        <>
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
                            onClick={() => setOpen(true)}
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
            {/* Модальное окно */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
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
                    <ProductCatalog />
                </DialogContent>
                <DialogActions>
                    <MDButton onClick={() => setOpen(false)} color="secondary">Отмена</MDButton>
                    <MDButton onClick={() => { /* логика */ }} color="info" variant="contained">Добавить в КП</MDButton>
                </DialogActions>
            </Dialog>
        </>
    )
}