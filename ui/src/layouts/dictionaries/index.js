import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Fade from '@mui/material/Fade';
import ContactApp from "layouts/dictionaries/components/contacs/Dictionaties"


import MDBox from "components/MDBox";


export default function Dictionaries() {
return (
        <DashboardLayout>
          <Fade in={true} timeout={500}>
            <div>
              <MDBox mt={2}>
                <MDBox width="100%">
                  <ContactApp />
                </MDBox>
              </MDBox>
            </div>
          </Fade>
        </DashboardLayout>
  );
}
