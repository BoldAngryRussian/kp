// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Dashboard components
import KPCreationStart from "./kp-creation-start";

function KPCreationStartLayout() {
    const email = localStorage.getItem("email")
    const firstName = localStorage.getItem("firstName")
    const secondName = localStorage.getItem("secondName")
    const role = localStorage.getItem("role")
    return (
        <DashboardLayout>
            <KPCreationStart />
        </DashboardLayout>
    )
}

export default KPCreationStartLayout;
