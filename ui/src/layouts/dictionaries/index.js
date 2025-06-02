import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Fade from '@mui/material/Fade';
import ContactApp from "layouts/dictionaries/components/contacs"


import MDBox from "components/MDBox";


export default function Dictionaries() {
return (
        <DashboardLayout>
          <Fade in={true} timeout={500}>
            <div>
              <MDBox mt={8} mb={3}>
                <MDBox width="100%">
                  <ContactApp />
                </MDBox>
              </MDBox>
            </div>
          </Fade>
        </DashboardLayout>
  );
}
