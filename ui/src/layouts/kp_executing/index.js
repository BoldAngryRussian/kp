import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Fade from '@mui/material/Fade';
import KpExecutingApp from "./components/kp_work";
import MDBox from "components/MDBox";

export default function KpExecuting() {
  return (
        <DashboardLayout>
          <Fade in={true} timeout={500}>
            <MDBox mt={8} mb={3} >                
              <MDBox width="100%">
                <KpExecutingApp/>
              </MDBox>                
            </MDBox>
          </Fade>
        </DashboardLayout>
  );
}