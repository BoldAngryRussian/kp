// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-in-blue.jpg";

import { useState, useEffect } from "react";

function Cover() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [thirdName, setThirdName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [openSignupSnackbar, setOpenSignupSnackbar] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setOpenErrorSnackbar(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (signupMessage) {
      const timer = setTimeout(() => {
        setSignupMessage("");
        setOpenSignupSnackbar(false);
        navigate("/authentication/sign-in");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [signupMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!firstName || !secondName || !thirdName || !phone || !email || !password) {
      setErrorMessage("Пожалуйста, заполните все поля")
      setOpenErrorSnackbar(true);
      return;
    }

    const payload = {
      firstName,
      secondName,
      thirdName,
      phone,
      email,
      password,
    };

    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json(); // ← читаем тело ответа
        setErrorMessage(errorData.error || "Ошибка регистрации");
        setOpenErrorSnackbar(true);
      } else {
        setSignupMessage("Вы успешно зарегистрированы! Ожидайте валидации администратором")
      }

      // можно показать уведомление или перенаправить
      console.log("Регистрация успешна");
    } catch (error) {
      console.error(error);
    } finally {
      setFirstName("");
      setSecondName("");
      setThirdName("");
      setPhone("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Регистрация
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Введите имя, email и пароль для регистрации
          </MDTypography>
        </MDBox>
        <MDBox pt={1} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Фамилия"
                variant="standard"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Имя"
                variant="standard"
                fullWidth
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Отчество"
                variant="standard"
                fullWidth
                value={thirdName}
                onChange={(e) => setThirdName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Телефон"
                variant="standard"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Пароль"
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleSubmit}
                disabled={!firstName || !secondName || !thirdName || !phone || !email || !password}
              >
                Зарегистрировать
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Уже работаете с нами?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Вход
                </MDTypography>
              </MDTypography>
            </MDBox>
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
      {signupMessage && (
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#7FFFD4',
            border: '1px solid rgb(129, 192, 152)',
            borderRadius: '6px',
            padding: '12px 24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 9999,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          <MDTypography variant="body2" fontWeight="medium" color="success">
            {signupMessage}
          </MDTypography>
        </MDBox>
      )}
    </CoverLayout>
  );
}

export default Cover;
