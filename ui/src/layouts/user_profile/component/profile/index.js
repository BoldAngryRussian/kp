import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { authFetch } from 'utils/authFetch'
import { GridLoader } from "react-spinners";
import CircularProgress from '@mui/material/CircularProgress';
import MDSnackbar from "components/MDSnackbar";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

const customTheme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          fontFamily: 'Roboto, sans-serif',
        },
        columnHeaders: {
          backgroundColor: '#f8f9fa',
          color: '#344767',
          fontWeight: 'bold',
        },
      },
    },
  },
});


export default function UserProfileApp() {
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [passwordData, setPasswordData] = useState({ old: '', new: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordConfirmOpen, setIsPasswordConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Произошла что-то странное и не понятное");
  const [userData, setUserData] = useState({
    firstName: '',
    secondName: '',
    thirdName: '',
    phone: '',
    email: '',
    details: '',
  });

  const openErrorSB = (message) => {
    setErrorMessage(message)
    setErrorSB(true);
  }
  const closeErrorSB = () => setErrorSB(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);


  const handleUpdateClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsSaving(true);
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const minSpinnerDuration = delay(2000); // ⏳ минимум 2 секунды

    try {
      const responsePromise = authFetch(`/api/v1/user/${userId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const [response] = await Promise.all([
        responsePromise,
        minSpinnerDuration, // ⏱ ждем как минимум 2 секунды
      ]);

      if (!response.ok) {
        console.error("Ошибка при обновлении данных");
        await handleErrorResponse(response)
      } else {
        openSuccessSB()
      }
    } catch (err) {
      console.error("Ошибка:", err);
    } finally {
      setIsSaving(false);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    authFetch(`/api/v1/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки пользователя:", err)
        setIsLoading(false);
      });

  }, []);


  const handleChangePasswordClick = () => {

    if (!passwordData.old || !passwordData.new || !passwordData.confirm) {
      openErrorSB("Все поля должны быть заполнены!");
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      openErrorSB("Пароль и подтверждение не совпадают!");
      return;
    }

    setIsPasswordConfirmOpen(true);
  };

  const handleErrorResponse = async (response) => {
    try {
      const errorJson = await response.json();
      const errorMsg = errorJson.error || "Неизвестная ошибка";
      console.error("Ошибка:", errorMsg);
      openErrorSB(errorMsg);
    } catch (e) {
      console.error("Ошибка при разборе ответа:", e);
      openErrorSB("Ошибка при разборе ответа сервера");
    }
  };

  const handleConfirmPasswordChange = async () => {
    setIsChangingPassword(true);
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    const minSpinner = delay(2000);

    try {
      const responsePromise = authFetch(`/api/v1/user/password/${userId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old: passwordData.old, new: passwordData.new }),
      });

      const [response] = await Promise.all([responsePromise, minSpinner]);

      if (!response.ok) {
        await handleErrorResponse(response)
      }
    } catch (err) {
      console.error("Ошибка:", err);
    } finally {
      setIsChangingPassword(false);
      setIsPasswordConfirmOpen(false);
      setPasswordData({ old: '', new: '', confirm: '' });
    }
  };

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Профиль пользователя"
      content="Данные пользователя успешно обновлены!"
      dateTime=""
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      sx={{
        backgroundColor: "#e8f5e9", // нежно-зелёный фон
        color: "#2e7d32", // тёмно-зелёный текст
      }}
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Ошибка исполнения запросв"
      content={errorMessage}
      dateTime=""
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite={false}
      autoHideDuration={5000}
      sx={{
        backgroundColor: "#fdecea", // мягкий красный
        color: "#b71c1c", // насыщенный тёмно-красный текст
      }}
    />
  );

  return (
    <MDBox width="100%" display="flex" flexDirection="column" gap={2}>
      <Card
        id="dictionaries"
        sx={{
          width: "100%",
          height: 'calc(100vh - 85px)',
          overflow: 'auto',
          maxWidth: '100%',
        }}
      >
        <MDBox display="flex" height="100%" flexDirection="column" px={2} pt={2}>
          <>
            <MDBox mt={10} display="flex" justifyContent="center" gap={4} flexWrap="wrap" >
              <MDBox display="flex" flexWrap="wrap" gap={3} sx={{ width: '80%' }}>
                {isLoading ? (
                  <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <GridLoader color="#1976d2" size={24} />
                  </MDBox>
                ) : (
                  <MDBox
                    p={2}
                    borderRadius={2}
                    border="1px solid #eee"
                    sx={{ width: '100%' }}
                    flex={1}
                  >
                    <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                      Личная информация
                    </MDTypography>
                    <Divider flexItem sx={{ borderColor: '#cfd8dc', borderWidth: '3px' }} />
                    <MDBox display="flex" justifyContent="center" my={2}>
                    </MDBox>
                    <MDBox display="flex" flexDirection="column">
                      <MDBox mb={2}>
                        <TextField label="Фамилия" fullWidth
                          value={userData.firstName}
                          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <TextField label="Имя" fullWidth
                          value={userData.secondName}
                          onChange={(e) => setUserData({ ...userData, secondName: e.target.value })}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <TextField label="Отчество" fullWidth
                          value={userData.thirdName}
                          onChange={(e) => setUserData({ ...userData, thirdName: e.target.value })}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <TextField label="Телефон" fullWidth
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <TextField label="Email" fullWidth
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </MDBox>
                      <MDBox mb={2}>
                        <TextField label="Дополнительная информация" multiline rows={4} fullWidth
                          value={userData.details}
                          onChange={(e) => setUserData({ ...userData, details: e.target.value })}
                        />
                      </MDBox>
                    </MDBox>
                    <MDBox
                      sx={{
                        width: '100%',
                        padding: 1       // чтобы текст не прилипал к краям
                      }}
                      display="flex"
                      justifyContent="flex-end"
                      mt={3}
                      mb={1}
                    >
                      <MDButton variant="contained" color="info" onClick={handleUpdateClick}>
                        Изменить данные профиля
                      </MDButton>
                    </MDBox>
                  </MDBox>
                )}
                <MDBox
                  p={2}
                  borderRadius={2}
                  border="1px solid #eee"
                  sx={{ width: '100%', maxWidth: 600 }}
                  flex={1}
                >
                  <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                    Смена пароля
                  </MDTypography>
                  <Divider flexItem sx={{ borderColor: '#cfd8dc', borderWidth: '3px' }} />
                  <MDBox>
                    <Grid container spacing={3} mt={4} sx={{ width: '100%' }}>
                      <Grid item xs={12} md={9} sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <MDBox display="flex" flexDirection="column" gap={2}>
                          <TextField label="Старый пароль" type="password" fullWidth
                            value={passwordData.old}
                            onChange={(e) => setPasswordData({ ...passwordData, old: e.target.value })}
                          />
                          <TextField label="Новый пароль" type="password" fullWidth
                            value={passwordData.new}
                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                          />
                          <TextField label="Подтвердите пароль" type="password" fullWidth
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} md={3} sx={{ minWidth: 250 }}>
                        <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                          Новый пароль должен содержать:
                        </MDTypography>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 14, color: '#444', listStyleType: 'none' }}>
                          {[
                            "Не менее 8 символов",
                            "Хотя бы одну строчную букву (a-z)",
                            "Хотя бы одну заглавную букву (A-Z)",
                            "Хотя бы одну цифру (0-9)",
                            "Хотя бы один спецсимвол",
                          ].map((text, index) => (
                            <li key={index} style={{ position: 'relative', paddingLeft: '1em' }}>
                              <span style={{ position: 'absolute', left: 0 }}>–</span>
                              {text}
                            </li>
                          ))}
                        </ul>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox
                    sx={{
                      width: '100%',
                      padding: 1       // чтобы текст не прилипал к краям
                    }}
                    display="flex"
                    justifyContent="flex-end"
                    mt={16}
                    mb={1}
                  >
                    <MDButton variant="contained" color="info" onClick={handleChangePasswordClick}>
                      Изменить пароль
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
          </>
        </MDBox>
      </Card>
      {confirmOpen && (
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
        >
          <DialogTitle>Подтверждение изменений</DialogTitle>
          <DialogContent>
            <Typography>Вы уверены, что хотите обновить данные?</Typography>
          </DialogContent>
          <DialogActions>
            <MDButton
              color="info"
              variant="contained"
              onClick={handleConfirmUpdate}
              disabled={isSaving}
            >
              {isSaving && <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />}
              Подтвердить
            </MDButton>
            <MDButton
              color="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={isSaving}
            >
              Отмена
            </MDButton>
          </DialogActions>
        </Dialog>
      )}
      {isPasswordConfirmOpen && (
        <Dialog
          open={isPasswordConfirmOpen}
          onClose={() => !isChangingPassword && setIsPasswordConfirmOpen(false)}
        >
          <DialogTitle>Подтвердите смену пароля</DialogTitle>
          <DialogContent>
            <Typography>Вы уверены, что хотите изменить пароль?</Typography>
          </DialogContent>
          <DialogActions>
            <MDButton
              color="info"
              variant="contained"
              onClick={handleConfirmPasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword && (
                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
              )}
              Подтвердить
            </MDButton>
            <MDButton
              color="secondary"
              onClick={() => setIsPasswordConfirmOpen(false)}
              disabled={isChangingPassword}
            >
              Отмена
            </MDButton>
          </DialogActions>
        </Dialog>
      )}
      {renderErrorSB}
      {renderSuccessSB}
    </MDBox>
  );
}