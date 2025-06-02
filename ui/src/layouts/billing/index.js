// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import MDTypography from "components/MDTypography";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import patternTree from "assets/images/illustrations/pattern-tree.svg"
import FileDropCard from "examples/Cards/FileDropCard"
import FileDropCardV2 from "examples/Cards/FileDropCard2";
import Fade from '@mui/material/Fade';

function Billing() {
  return (
    <DashboardLayout>
      <Fade in={true} timeout={500}>
        <div>
          <MDBox mt={8} mb={3}>
            <MDBox width="100%">
              <FileDropCardV2 />
            </MDBox>
          </MDBox>
        </div>
      </Fade>
    </DashboardLayout>
  );
}

export default Billing;
