// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Fade from '@mui/material/Fade';
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { GridLoader } from "react-spinners";
import { createTheme, ThemeProvider } from '@mui/material/styles';
// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import { useState, useEffect } from "react";
import { authFetch } from 'utils/authFetch'

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

function PriceListSupplierInformation({ supplierId, onEditSupplierClick }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(null)
    const [company, setCompany] = useState(null)
    const [email, setEmail] = useState(null)
    const [vat, setVat] = useState(null)

    useEffect(() => {
        fetchContactDetails(supplierId)
    }, []);

    // Получение деталей контакта по id и категории
    const fetchContactDetails = (id) => {
        setLoading(true);
        const startTime = Date.now();

        const endpoint = `/api/v1/supplier/${id}`;
        authFetch(endpoint)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Ошибка загрузки деталей");
                }
                return res.json();
            })
            .then((data) => {
                setName(`${data.secondName} ${data.firstName} ${data.thirdName}`)
                setCompany(data.company)
                setEmail(data.email)
                setVat(data.phone)
            })
            .catch((err) => {
                console.error('Ошибка при получении данных', err);
                setLoading(false);
            })
            .finally(() => {
                const elapsed = Date.now() - startTime;
                const remaining = 1000 - elapsed;
                setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
            });

    };

    // --- LOADING SPINNER ---
    if (loading) {
        return (
            <MDBox
                pt={1}
                pb={1}
                px={2}
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="120px"
            >
                <ThemeProvider theme={customTheme}>
                    <GridLoader color="#1976d2" size={20} margin={2} />
                </ThemeProvider>
            </MDBox>
        );
    }

    return (
        <Fade in timeout={400}>
            <MDBox pt={1} pb={1} px={2} width="100%">
                <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                    <MDBox
                        component="li"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        bgColor={darkMode ? "rgba(0, 0, 0, 0)" : "grey-100"}
                        borderRadius="lg"
                        p={3}
                        mt={1}
                    >
                        <MDBox width="100%" display="flex" flexDirection="column">
                            <MDBox
                                display="flex"
                                justifyContent="space-between"
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                flexDirection={{ xs: "column", sm: "row" }}
                                mb={2}
                            >
                                <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
                                    {name}
                                </MDTypography>

                                <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
                                    <MDButton
                                        variant="text"
                                        color={darkMode ? "white" : "dark"}
                                        onClick={onEditSupplierClick}
                                    >
                                        <Icon>edit</Icon>
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                            <MDBox mb={1} lineHeight={0}>
                                <MDTypography variant="caption" color="text">
                                    Компания:&nbsp;&nbsp;&nbsp;
                                    <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                                        {company}
                                    </MDTypography>
                                </MDTypography>
                            </MDBox>
                            <MDBox mb={1} lineHeight={0}>
                                <MDTypography variant="caption" color="text">
                                    Email адрес:&nbsp;&nbsp;&nbsp;
                                    <MDTypography variant="caption" fontWeight="medium">
                                        {email}
                                    </MDTypography>
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="caption" color="text">
                                Телефон:&nbsp;&nbsp;&nbsp;
                                <MDTypography variant="caption" fontWeight="medium">
                                    {vat}
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </MDBox>
        </Fade>
    );
}

// Typechecking props for the Bill
PriceListSupplierInformation.propTypes = {
    name: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    vat: PropTypes.string.isRequired
};

export default PriceListSupplierInformation;
