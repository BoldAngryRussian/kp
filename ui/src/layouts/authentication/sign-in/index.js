import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// react-router-dom components
import { Link } from "react-router-dom";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-blue.jpg";

function Basic() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  localStorage.clear();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: login, password })
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.error || "Ошибка входа");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", data.token);
        navigate("/creating-kp");
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <BasicLayout image={bgImage}>
      <Card sx={{ width: 300 }}>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput type="login" label="Логин" fullWidth value={login} onChange={(e) => setLogin(e.target.value)} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Пароль" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Войти
              </MDButton>
            </MDBox>
          </MDBox>
          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              <MDTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Регистрация
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
      {errorMessage && (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fdecea',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            padding: '12px 24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 9999,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          <MDTypography variant="body2" fontWeight="medium" color="error">
            {errorMessage}
          </MDTypography>
        </MDBox>
      )}
    </BasicLayout>
  );
}

export default Basic;
