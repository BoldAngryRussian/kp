// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
// Dashboard components
import Products from "layouts/dashboard/components/Products";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

 return (
      <DashboardLayout>
      <MDBox py={3}>        
        <MDBox>          
          <Grid spacing={1}>
            <Grid item xs={12}>
              <Products />
            </Grid>
          </Grid>
        </MDBox>        
      </MDBox>
    </DashboardLayout>
 )
}

export default Dashboard;
