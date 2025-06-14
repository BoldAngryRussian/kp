import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Card,
  Divider,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
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

export default function ContactApp() {
  const [selected, setSelected] = useState(contacts[0]);
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("support");
  const [searchText, setSearchText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <MDBox width="100%" display="flex" flexDirection="column" gap={2}>
      <Card id="dictionaries" sx={{ width: "100%", height: 'calc(100vh - 120px)' }}>
        <MDBox display="flex" height="100%">
          {/* Левая колонка */}
          <MDBox width="14.28%" p={2}>
            <MDBox display="flex" flexDirection="column" height="100%">
              <MDBox flexGrow={1}>
                {categories.map((category) => (
                  <MDBox
                    key={category.id}
                    display="flex"
                    alignItems="center"
                    px={1}
                    py={0.75}
                    mb={1}
                    sx={{
                      borderRadius: 2,
                      cursor: "pointer",
                      backgroundColor:
                        activeCategory === category.id ? "rgba(99,102,241,0.05)" : "transparent",
                      transition: "background-color 0.2s ease-in-out",
                    }}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.id === 'supplier' ? (
                      <LocalShippingIcon sx={{ fontSize: 18, color: category.color, mr: 1 }} />
                    ) : category.id === 'customer' ? (
                      <MonetizationOnIcon sx={{ fontSize: 18, color: category.color, mr: 1 }} />
                    ) : (
                      <FolderOpenIcon sx={{ fontSize: 18, color: category.color, mr: 1 }} />
                    )}
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      sx={{ color: "#344767" }}
                    >
                      {category.label}
                    </MDTypography>
                  </MDBox>
                ))}
              </MDBox>
              <MDButton
                variant="outlined"
                color="info"
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
              >
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>

          {/* Разделитель */}
          <Divider orientation="vertical" sx={{ borderColor: '#cfd8dc', borderWidth: '3px', height: '90%', alignSelf: 'center' }} />

          {/* Центральная колонка */}
          <ThemeProvider theme={customTheme}>
            <MDBox width="42.86%" p={2}>
              <TextField
                placeholder={
                  activeCategory === 'supplier'
                    ? 'Поиск поставщика'
                    : activeCategory === 'customer'
                    ? 'Поиск заказчика'
                    : 'Поиск контакта'
                }
                variant="outlined"
                size="small"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5
                        6.5 6.5 0 109.5 16c1.61 0 3.09-.59 
                        4.23-1.57l.27.28v.79l5 4.99L20.49 
                        19l-4.99-5zm-6 0C8.01 14 6 11.99 
                        6 9.5S8.01 5 10.5 5 15 7.01 15 
                        9.5 12.99 14 10.5 14z" />
                      </svg>
                    </IconButton>
                  ),
                  sx: {
                    borderRadius: '8px',
                  }
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderWidth: 2,
                  }
                }}
              />
              <DataGrid
                rows={filteredSuppliers}
                columns={columns}
                hideFooter
                disableColumnMenu
                autoHeight
                rowHeight={32}
                disableSelectionOnClick
                onRowClick={() => {
                  setDeleted(false);
                  setIsEditMode(false);
                }}
                sx={{
                  '& .MuiDataGrid-columnHeaders': { display: 'none' },
                  '& .MuiDataGrid-columnSeparator': { display: 'none' },
                  '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                    borderBottom: 'none',
                  },
                  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                  },
                }}
              />
            </MDBox>
          </ThemeProvider>

          {/* Разделитель */}
          <Divider orientation="vertical" sx={{ borderColor: '#cfd8dc', borderWidth: '3px', height: '90%', alignSelf: 'center' }} />

          {/* Правая колонка */}
          <MDBox width="42.86%" p={3} sx={{ height: '100%', overflow: 'auto', wordBreak: 'break-word', whiteSpace: 'normal' }}>
            {deleted ? (
              <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                <img src="https://cdn-icons-png.flaticon.com/512/4086/4086679.png" alt="Select Contact" width={180} />
                <MDTypography variant="h6" mt={2}>
                  Пожалуйста, выберите контакт
                </MDTypography>
              </MDBox>
            ) : (
              <>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h3" fontWeight="bold" color="text" mb={1}>
                    Информация о контакте
                  </MDTypography>
                  <MDBox>
                    <IconButton size="small"><StarIcon fontSize="small" color="warning" /></IconButton>
                    {isEditMode ? (
                      <IconButton size="small" onClick={() => setIsEditMode(false)}>
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => setIsEditMode(true)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => setDeleted(true)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </MDBox>
                </MDBox>
                <Divider flexItem sx={{ borderColor: '#cfd8dc', borderWidth: '3px' }} />
                {isEditMode ? (
                  <MDBox component="form" display="flex" flexDirection="column" gap={2}>
                    <TextField label="Фамилия" fullWidth defaultValue={selected.name.split(' ')[0]} />
                    <TextField label="Имя" fullWidth defaultValue={selected.name.split(' ')[1] || ''} />
                    <TextField label="Кампания" fullWidth defaultValue={selected.company} />
                    <TextField label="Департамент" fullWidth defaultValue={selected.department} />
                    <TextField label="Email" fullWidth defaultValue={selected.email} />
                    <TextField label="Телефон" fullWidth defaultValue={selected.phone} />
                    <TextField
                      label="Дополнительная информация"
                      fullWidth
                      defaultValue={selected.notes}
                      multiline
                      rows={5}
                    />
                    <MDBox display="flex" gap={2} mt={2}>
                      <MDButton color="info" variant="contained" onClick={() => setIsEditMode(false)}>
                        Сохранить
                      </MDButton>
                      <MDButton color="secondary" variant="outlined" onClick={() => setIsEditMode(false)}>
                        Отмена
                      </MDButton>
                    </MDBox>
                  </MDBox>
                ) : (
                  <>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <MDBox display="flex" alignItems="center">
                        <Box>
                          <MDTypography fontWeight="bold">{selected.name}</MDTypography>
                          <Typography variant="caption" color="text.secondary">
                            {selected.department} <span style={{ margin: "0 4px" }}>•</span> {selected.company}
                          </Typography>
                        </Box>
                      </MDBox>
                    </MDBox>
                    <>
                      <MDBox mb={2}>
                        <Typography variant="caption" color="text.secondary">Телефон</Typography>
                        <Typography fontWeight="bold">{selected.phone}</Typography>
                      </MDBox>
                      <MDBox mb={2}>
                        <Typography variant="caption" color="text.secondary">Email адрес</Typography>
                        <Typography fontWeight="bold">{selected.email}</Typography>
                      </MDBox>
                      <MDBox mb={2}>
                        <Typography variant="caption" color="text.secondary">Address</Typography>
                        <Typography fontWeight="bold">{selected.address}</Typography>
                      </MDBox>
                      <MDBox mb={2}>
                        <Typography variant="caption" color="text.secondary">Компания</Typography>
                        <Typography fontWeight="bold">{selected.company}</Typography>
                      </MDBox>
                    </>
                    <MDBox mb={3}>
                      <Typography variant="caption" color="text.secondary" mb={0.5}>
                        Дополнительная информация
                      </Typography>
                      <Typography color="text">{selected.notes}</Typography>
                    </MDBox>
                  </>
                )}
              </>
            )}
          </MDBox>
        </MDBox>
      </Card>
    {/* Диалоговое окно добавления контакта */}
    <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {activeCategory === 'supplier'
          ? 'Добавить поставщика'
          : activeCategory === 'customer'
          ? 'Добавить заказчика'
          : 'Добавить контакт'}
      </DialogTitle>
      <DialogContent dividers>
        <MDBox component="form" display="flex" flexDirection="column" gap={2} pt={1}>
          <TextField label="Фамилия" fullWidth />
          <TextField label="Имя" fullWidth />
          <TextField label="Кампания" fullWidth />
          <TextField label="Департамент" fullWidth />
          <TextField label="Email" fullWidth />
          <TextField label="Телефон" fullWidth />
          <TextField
            label="Дополнительная информация"
            fullWidth
            multiline
            rows={5}
          />
        </MDBox>
      </DialogContent>
      <DialogActions>
        <MDButton onClick={() => setIsAddDialogOpen(false)} color="secondary">Отмена</MDButton>
        <MDButton onClick={() => setIsAddDialogOpen(false)} color="info" variant="contained">Сохранить</MDButton>
      </DialogActions>
    </Dialog>
  </MDBox>
  );
}