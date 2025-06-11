// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Dashboard components
import KPCreationStart from "./kp-creation-start";

function KPCreationStartLayout() {
    return (
        <DashboardLayout>
            <MDBox py={3}>
                <MDBox>
                    <KPCreationStart />
                </MDBox>
            </MDBox>
        </DashboardLayout>
    )
}

export default KPCreationStartLayout;
