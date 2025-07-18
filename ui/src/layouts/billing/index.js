
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import PriceListLoader from "examples/Cards/FileDropCard2/PriceListLoader";
import Fade from '@mui/material/Fade';

function Billing() {
  return (
    <DashboardLayout>
      <Fade in={true} timeout={500}>
        <div>
            <PriceListLoader />
        </div>
      </Fade>
    </DashboardLayout>
  );
}

export default Billing;
