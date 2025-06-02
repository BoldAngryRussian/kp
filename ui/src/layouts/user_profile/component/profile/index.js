import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";
import LockIcon from "@mui/icons-material/Lock";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddIcon from "@mui/icons-material/Add";

const suppliers = [
  { id: 1, name: 'ООО "Ромашка"' },
  { id: 2, name: 'OOO "Букашка"' },
  { id: 3, name: 'OOO "Озон"' },
];

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

const columns = [
  { field: 'name', headerName: 'Поставщик', flex: 1 },
];

const contacts = [
  {
    id: 1,
    name: "Иванов Иван Иванович",
    department: "Отдел продаж",
    company: 'ООО "Рога и Копыта"',
    phone: "+7(926)777-77-77",
    email: "ivanov.ivan@mail.ru",
    address: "г.Омск, ул.Цветочная, д.1",
    notes: "Хорошая кампания делает много заказов",
    avatar: "https://i.pravatar.cc/150?img=1",
    starred: true
  }
];

const categories = [
  { id: "supplier", label: "Поставщики", color: "#6366f1" },
  { id: "customer", label: "Заказчики", color: "#f87171" },
];

export default function UserProfileApp() {
  const [selected, setSelected] = useState(contacts[0]);
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("support");
  const [searchText, setSearchText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <MDBox width="100%" display="flex" flexDirection="column" gap={2}>
      <Card
        id="dictionaries"
        sx={{
          width: "100%",
          height: 'calc(100vh - 120px)',
          overflow: 'auto',
          maxWidth: '100%',
        }}
      >
        <MDBox display="flex" height="100%" flexDirection="column" px={2} pt={2}>
          <MDBox sx={{ overflowX: 'auto' }}>
            <Tabs
              value={tabIndex}
              onChange={(e, newIndex) => setTabIndex(newIndex)}
              variant="standard"
              centered={false}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                px: 2,
                minHeight: 'auto',
                width: 'max-content',
              }}
              indicatorColor="primary"
              TabIndicatorProps={{ style: { display: 'none' } }}
            >
              <Tab
                icon={<DescriptionIcon />}
                label="Личная информация"
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  borderRadius: 2,
                  bgcolor: tabIndex === 0 ? '#AFEEEE' : 'transparent',
                  color: tabIndex === 0 ? 'white' : 'text.primary',
                }}
              />
            </Tabs>
          </MDBox>

          {tabIndex === 0 && (
            <>
            <MDBox mt={10} display="flex" justifyContent="center" gap={4} flexWrap="wrap" >
              <MDBox display="flex" flexWrap="wrap" gap={3} sx={{ width:'80%' }}>
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
                  <Box
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      '&:hover .upload-icon': {
                        display: 'flex',
                      },
                    }}
                  >
                    <Avatar
                      alt="Аватар"
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: '#e0f2ff',
                        cursor: 'pointer',
                      }}
                    />
                    <Box
                      className="upload-icon"
                      sx={{
                        display: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0,0,0,0.4)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        cursor: 'pointer',
                      }}
                      onClick={() => document.getElementById('avatar-upload').click()}
                    >
                      <SaveIcon sx={{ color: 'white', width: 48, height: 48 }} />
                    </Box>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => console.log("Файл выбран:", e.target.files[0])}
                    />
                  </Box>
                </MDBox>
                <MDBox display="flex" flexDirection="column">
                  <MDBox mb={2}>
                    <TextField label="Фамилия" fullWidth />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField label="Имя" fullWidth />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField label="Отчество" fullWidth />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField label="Телефон" fullWidth />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField label="Email" fullWidth />
                  </MDBox>
                  <MDBox mb={2}>
                    <TextField label="Дополнительная информация" multiline rows={4} fullWidth />
                  </MDBox>
                </MDBox>
              </MDBox>

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
                <Grid container spacing={3} mt={1} sx={{ width: '100%' }}>
                  <Grid item xs={12} md={9} sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <MDBox display="flex" flexDirection="column" gap={2}>
                      <TextField
                        label="Старый пароль"
                        type="password"
                        fullWidth
                        placeholder="Введите старый пароль"
                      />
                      <TextField
                        label="Новый пароль"
                        type="password"
                        fullWidth
                        placeholder="Введите новый пароль"
                      />
                      <TextField
                        label="Подтвердите пароль"
                        type="password"
                        fullWidth
                        placeholder="Повторите новый пароль"
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
                <MDBox sx={{ width: '100%' }} display="flex" justifyContent="flex-end" mt={3} mb={2}>
                  <MDButton variant="contained" color="info">
                    Обновить
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
            </>
          )}
        </MDBox>
      </Card>
  </MDBox>
  );
}