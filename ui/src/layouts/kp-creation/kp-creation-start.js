import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

export default function KPCreationStart() {
    return (
        <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh" // высота всей видимой области экрана
        >
            <MDButton
                variant="text"
                color="secondary"
                size="small"
                sx={{
                    fontSize: "1rem",
                    textTransform: "none",
                    border: "1px solid #999",
                    backgroundColor: "#f0f0f0",
                    "&:hover": {
                        backgroundColor: "#e0e0e0",
                    },
                }}
            >
                загрузить с вашего устройства
            </MDButton>
        </MDBox>
    )
}