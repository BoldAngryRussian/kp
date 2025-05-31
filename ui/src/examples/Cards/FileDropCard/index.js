// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Images
import masterCardLogo from "assets/images/logos/mastercard.png";
import swapLogo from "assets/images/icons/swap.png"

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function FileDropCard() {
  const [controller] = useMaterialUIController();

  return (
    <Card id="delete-account" sx={{ width: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Загрузка нового прайс-листа
        </MDTypography>
        <MDButton variant="gradient" color="dark">
          <Icon sx={{ fontWeight: "bold" }}>add</Icon>
          &nbsp;Выбрать файл
        </MDButton>
      </MDBox>
      <MDBox p={2} width="100%" height="100%">
            <MDBox
              borderRadius="lg"
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={3}
              sx={{
                border: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
            <MDBox 
                    component="img" 
                    src={swapLogo} 
                    alt="master card" 
                    width="5%" 
                    justifyContent="center" 
                    sx={{
                        opacity: 0.3, // делает изображение "бледным"
                    }}
            />
            </MDBox>
      </MDBox>
    </Card>
  );
}

export default FileDropCard;
