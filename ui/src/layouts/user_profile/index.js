import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Fade from '@mui/material/Fade';
import UserProfileApp from "layouts/user_profile/component/profile"
import MDBox from "components/MDBox";


export default function UserProfile() {
  return (
        <DashboardLayout>
          <Fade in={true} timeout={500}>
            <MDBox mt={8} mb={3}>                
                <UserProfileApp/>
            </MDBox>
          </Fade>
        </DashboardLayout>
  );
}