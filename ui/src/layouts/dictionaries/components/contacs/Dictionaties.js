import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GridLoader } from "react-spinners";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Card,
  Divider,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddIcon from "@mui/icons-material/Add";
import { authFetch } from 'utils/authFetch'

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


const categories = [
  { id: "supplier", label: "Поставщики", color: "#6366f1" },
  { id: "customer", label: "Заказчики", color: "#f87171" },
];

export default function ContactApp() {
  let loadingTimeout = null;
  const [selected, setSelected] = useState();
  const [activeCategory, setActiveCategory] = useState("supplier");
  const [searchText, setSearchText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add form state for new contact
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [thirdName, setThirdName] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [address, setAddress] = useState('');

  // Edit form state for updating contact
  const [firstName2Update, setFirstName2Update] = useState('');
  const [secondName2Update, setSecondName2Update] = useState('');
  const [thirdName2Update, setThirdName2Update] = useState('');
  const [company2Update, setCompany2Update] = useState('');
  const [email2Update, setEmail2Update] = useState('');
  const [phone2Update, setPhone2Update] = useState('');
  const [details2Update, setDetails2Update] = useState('');
  const [addres2Update, setAddres2Update] = useState('')

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    handleSupplierClick();
  }, []);

  useEffect(() => {
    if (selected) {
      setFirstName2Update(selected.name.split(' ')[1] || '');
      setSecondName2Update(selected.name.split(' ')[0]);
      setThirdName2Update(selected.name.split(' ')[2] || '');
      setCompany2Update(selected.company);
      setEmail2Update(selected.email);
      setPhone2Update(selected.phone);
      setDetails2Update(selected.notes);
      setAddres2Update(selected.address)
    }
  }, [selected]);

  // Update contact function
  const updateContact = async (updContact, category) => {
    const endpoint = category === 'supplier'
      ? `/api/v1/supplier/update`
      : `/api/v1/customer/update`;
    const response = await authFetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updContact),
    });
    if (!response.ok) {
      throw new Error('Ошибка при обновлении');
    }
    return response.json();
  };

  const transformToGridRows = (data) =>
    data.map(s => ({
      id: s.id,
      name: s.company,
    }));


  const handleSaveNewContact = () => {
    const newContact = {
      firstName,
      secondName,
      thirdName,
      company,
      department,
      email,
      phone,
      details,
    };

    setIsSaving(true);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

    Promise.all([
      saveNewContact(newContact, activeCategory),
      minDelay
    ])
      .then(() => {
        setIsAddDialogOpen(false);
        if (activeCategory === 'supplier') {
          handleSupplierClick();
        } else {
          handleCustomerClick();
        }

        setFirstName('')
        setSecondName('')
        setThirdName('')
        setCompany('')
        setDepartment('')
        setEmail('')
        setPhone('')
        setDetails('')
        setAddress('')

      })
      .catch((err) => {
        console.error('Ошибка при сохранении', err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const saveNewContact = async (newContact, category) => {
    const endpoint = category === 'supplier'
      ? '/api/v1/supplier/save'
      : '/api/v1/customer/save';

    const response = await authFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContact),
    });

    if (!response.ok) {
      throw new Error('Ошибка при сохранении');
    }

    return response.json();
  };


  const handleDeleteContact = () => {
    if (!selected) return;

    setIsDeleting(true);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

    Promise.all([
      deleteContactById(selected.id, activeCategory),
      minDelay
    ])
      .then(() => {
        setDeleted(true);
        setSelected(undefined);
        setConfirmDeleteOpen(false); // Закрываем модалку сразу
        if (activeCategory === 'supplier') {
          handleSupplierClick();
        } else {
          handleCustomerClick();
        }
      })
      .catch((err) => {
        console.error("Ошибка при удалении", err);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const deleteContactById = (id, category) => {
    const endpoint = category === "supplier" ? `/api/v1/supplier/${id}/delete` : `/api/v1/customer/${id}/delete`;
    return authFetch(endpoint, {
      method: 'DELETE',
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Ошибка при удалении');
      }
    });
  };


  // Получение деталей контакта по id и категории
  const fetchContactDetails = (id, category, setSelected, setLoading) => {
    loadingTimeout = setTimeout(() => setLoading(true), 300);
    const endpoint = category === "supplier" ? `/api/v1/supplier/${id}` : `/api/v1/customer/${id}`;
    authFetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка загрузки деталей");
        }
        return res.json();
      })
      .then((data) => {
        clearTimeout(loadingTimeout);
        const o = {
          ...data,
          notes: data.details,
          name: `${data.secondName} ${data.firstName} ${data.thirdName}`
        }
        setSelected(o);
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(loadingTimeout);
        console.error('Ошибка при получении данных', err);
        setLoading(false);
      });
  };


  const handleSupplierClick = () => {
    loadingTimeout = setTimeout(() => setLoading(true), 300);
    authFetch('/api/v1/supplier/all')
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка ответа от сервера");
        }
        return res.json();
      })
      .then((data) => {
        clearTimeout(loadingTimeout);
        setSuppliers(transformToGridRows(data)); // или любой твой useState
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(loadingTimeout);
        console.error('Ошибка при загрузке поставщиков', err);
        setLoading(false);
      });
  };

  const handleCustomerClick = () => {
    loadingTimeout = setTimeout(() => setLoading(true), 300);
    authFetch('/api/v1/customer/all')
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка ответа от сервера");
        }
        return res.json();
      })
      .then((data) => {
        clearTimeout(loadingTimeout);
        setCustomers(transformToGridRows(data)); // или любой твой useState
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(loadingTimeout);
        console.error('Ошибка при загрузке поставщиков', err);
        setLoading(false);
      });
  };

  const filteredList =
    activeCategory === "supplier"
      ? suppliers.filter(s => s.name.toLowerCase().includes(searchText.toLowerCase()))
      : customers.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));

  // Функция для сохранения изменений контакта (редактирование)
  const handleSaveEditContact = async () => {
    setIsSaving(true);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      await Promise.all([
        updateContact(
          {
            id: selected.id,
            firstName: firstName2Update,
            secondName: secondName2Update,
            thirdName: thirdName2Update,
            company: company2Update,
            email: email2Update,
            phone: phone2Update,
            details: details2Update,
            address: addres2Update
          },
          activeCategory
        ),
        minDelay
      ]);
      setIsEditMode(false);
      fetchContactDetails(selected.id, activeCategory, setSelected, setLoading);
    } catch (err) {
      console.error('Ошибка при обновлении', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MDBox width="100%" display="flex" flexDirection="column" gap={2}>
      <Card id="dictionaries" sx={{ width: "100%", height: 'calc(100vh - 90px)' }}>
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
                    onClick={() => {
                      setActiveCategory(category.id);
                      setSelected(undefined);
                      setIsEditMode(false);
                      setDeleted(false);
                      if (category.id === 'supplier') {
                        handleSupplierClick();
                      } else if (category.id === 'customer') {
                        handleCustomerClick();
                      }
                    }}
                  >
                    {category.id === 'supplier' ? (
                      <LocalShippingIcon sx={{ fontSize: 18, color: '#4169E1', mr: 1 }} />
                    ) : category.id === 'customer' ? (
                      <MonetizationOnIcon sx={{ fontSize: 18, color: '#FFD700', mr: 1 }} />
                    ) : (
                      <FolderOpenIcon sx={{ fontSize: 18, color: category.color, mr: 1 }} />
                    )}
                    <MDTypography
                      variant="body1"
                      fontWeight="medium"
                      color="text"
                      sx={{
                        fontSize: "1rem"
                      }}
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
            <MDBox
              width="42.86%"
              p={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
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
                    backgroundColor:
                      activeCategory === 'supplier'
                        ? '#E0FFFF'
                        : activeCategory === 'customer'
                          ? '#fffde7'
                          : 'transparent',
                  }
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderWidth: 2,
                  }
                }}
              />
              <MDBox sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {loading ? (
                  <MDBox display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                    <GridLoader color="#1976d2" size={24} margin={2} />
                  </MDBox>
                ) : (
                  <DataGrid
                    rows={filteredList}
                    columns={columns}
                    hideFooter
                    disableColumnMenu
                    autoHeight={false}
                    rowHeight={32}
                    disableSelectionOnClick
                    onRowClick={(params) => {
                      setDeleted(false);
                      setIsEditMode(false);
                      fetchContactDetails(params.row.id, activeCategory, setSelected, setLoading);
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
                )}
              </MDBox>
            </MDBox>
          </ThemeProvider>

          {/* Разделитель */}
          <Divider orientation="vertical" sx={{ borderColor: '#cfd8dc', borderWidth: '3px', height: '90%', alignSelf: 'center' }} />

          {/* Правая колонка */}
          <MDBox width="42.86%" p={3} sx={{ height: '100%', overflow: 'auto', wordBreak: 'break-word', whiteSpace: 'normal' }}>
            {deleted || !selected ? (
              <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4086/4086679.png"
                  alt="Select Contact"
                  width={180}
                  style={{
                    filter: "grayscale(100%)",
                    opacity: 0.3,
                  }}
                />
                <MDTypography variant="h6" mt={2} sx={{ color: 'text.disabled' }}>
                  Пожалуйста, выберите контакт
                </MDTypography>
              </MDBox>
            ) : (
              <>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h3" fontWeight="bold" color="text" mb={1}>
                    {activeCategory === 'supplier'
                      ? 'Информация о поставщике'
                      : activeCategory === 'customer'
                        ? 'Информация о заказчике'
                        : 'Информация о контакте'}
                  </MDTypography>
                  {!isEditMode && (
                    <MDBox>
                      <IconButton size="small" onClick={() => setIsEditDialogOpen(true)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setConfirmDeleteOpen(true)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </MDBox>
                  )}
                </MDBox>
                <Divider flexItem sx={{ borderColor: '#cfd8dc', borderWidth: '3px' }} />
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
            <TextField label="Фамилия" fullWidth value={secondName} onChange={(e) => setSecondName(e.target.value)} />
            <TextField label="Имя" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <TextField label="Отчество" fullWidth value={thirdName} onChange={(e) => setThirdName(e.target.value)} />
            <TextField label="Кампания" fullWidth value={company} onChange={(e) => setCompany(e.target.value)} />
            <TextField label="Адрес" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} />
            <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Телефон" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField
              label="Дополнительная информация"
              fullWidth
              multiline
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleSaveNewContact} color="info" variant="contained" disabled={isSaving}>
            {isSaving && <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />}
            Сохранить
          </MDButton>
          <MDButton onClick={() => setIsAddDialogOpen(false)} color="secondary">Отмена</MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить этот контакт?</Typography>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleDeleteContact} color="error" disabled={isDeleting}>
            {isDeleting && <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />}
            Удалить
          </MDButton>
          <MDButton onClick={() => setConfirmDeleteOpen(false)} color="secondary">
            Отмена
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isEditDialogOpen}
        onClose={() => !isSaving && setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Редактировать контакт</DialogTitle>
        <DialogContent dividers>
          <MDBox component="form" display="flex" flexDirection="column" gap={2}>
            <TextField label="Фамилия" fullWidth value={secondName2Update} onChange={(e) => setSecondName2Update(e.target.value)} disabled={isSaving} />
            <TextField label="Имя" fullWidth value={firstName2Update} onChange={(e) => setFirstName2Update(e.target.value)} disabled={isSaving} />
            <TextField label="Отчество" fullWidth value={thirdName2Update} onChange={(e) => setThirdName2Update(e.target.value)} disabled={isSaving} />
            <TextField label="Кампания" fullWidth value={company2Update} onChange={(e) => setCompany2Update(e.target.value)} disabled={isSaving} />
            <TextField label="Email" fullWidth value={email2Update} onChange={(e) => setEmail2Update(e.target.value)} disabled={isSaving} />
            <TextField label="Адрес" fullWidth value={addres2Update} onChange={(e) => setAddres2Update(e.target.value)} disabled={isSaving} />
            <TextField label="Телефон" fullWidth value={phone2Update} onChange={(e) => setPhone2Update(e.target.value)} disabled={isSaving} />
            <TextField
              label="Дополнительная информация"
              fullWidth
              value={details2Update}
              onChange={(e) => setDetails2Update(e.target.value)}
              multiline
              rows={5}
              disabled={isSaving}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton
            color="info"
            variant="contained"
            onClick={async () => {
              await handleSaveEditContact();
              setIsEditDialogOpen(false); // Закрываем только после успешного сохранения
            }}
            disabled={isSaving}
          >
            {isSaving && <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />}
            Обновить
          </MDButton>
          <MDButton
            color="secondary"
            onClick={() => setIsEditDialogOpen(false)}
            disabled={isSaving}
          >
            Отмена
          </MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}