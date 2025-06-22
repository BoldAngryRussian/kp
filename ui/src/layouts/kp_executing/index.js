import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Fade from '@mui/material/Fade';
import KpExecutingApp from "./components/kp_work";
import MDBox from "components/MDBox";

export default function KpExecuting() {
  return (
        <DashboardLayout>
          <Fade in={true} timeout={500}>
            <div>
                <KpExecutingApp/>
            </div>
          </Fade>
        </DashboardLayout>
  );
}