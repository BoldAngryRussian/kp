import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import uylaLogo from "assets/images/uyta-logo.png"

export default function KPCreationStart() {
    return (
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
    )
}