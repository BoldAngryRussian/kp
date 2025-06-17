import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import PriceListLoader from "examples/Cards/FileDropCard2/PriceListLoader";
import Fade from '@mui/material/Fade';

function Billing() {
  return (
    <DashboardLayout>
      <Fade in={true} timeout={500}>
        <div>
          <MDBox>
            <MDBox width="100%">
              <PriceListLoader />
            </MDBox>
          </MDBox>
        </div>
      </Fade>
    </DashboardLayout>
  );
}

export default Billing;
