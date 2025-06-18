// @mui material components
import Card from "@mui/material/Card";
import Fade from '@mui/material/Fade';
import MDSnackbar from "components/MDSnackbar";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import MDProgress from "components/MDProgress";
import WholeSale from 'assets/images/wholesale.png'
import KPPriceLoadingSupplierFinder from 'examples/Cards/FileDropCard2/components/KPCreationSupplierFinder'
import PriceListSupplierInformation from 'examples/Cards/FileDropCard2/components/PriceListSupplierDetailInfo'

import { GridLoader } from "react-spinners";

// React
import { useState, useCallback, useRef, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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

function PriceListLoader() {
  const [selectedSupplierIdFinal, setSelectedSupplierIdFinal] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [summaryRows, setSummaryRows] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [initialErrors, setInitialErrors] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false)
  const fileInputRef = useRef(null);

  const currentErrors = summaryRows.filter(item => !item.isCorrect).length;
  const correctPercentage = initialErrors > 0
    ? ((initialErrors - currentErrors) / initialErrors) * 100
    : 100;

  const uploadFile = useCallback((file) => {
    const formData = new FormData();
    formData.append("file", file);
    setShowSpinner(true);
    fetch("/api/v1/prices/recognize", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        setTimeout(() => setShowSpinner(false), 1000);

        let data = [];
        data = await res.json(); // ожидаем [{ name, price }, ...]
        // Преобразуем в формат таблицы с уникальным id и isCorrect
        const rows = Array.isArray(data)
          ? data.map((item, index) => ({
            id: `${item.name}-${index}`,
            label: item.name,
            value: `${(item.price / 100).toFixed(2)}`,
            isCorrect: item.isCorrect,
          }))
          : [];

        setSummaryRows(rows); // Записываем данные в таблицу
        setInitialErrors(rows.filter(item => !item.isCorrect).length);
        setUploadMessage(`Файл "${file.name}" успешно распознан`);
        setTimeout(() => setUploadMessage(""), 2000);
      })
      .catch((err) => {
        console.error("Ошибка загрузки", err);
        setUploadErrorMessage(`Файл "${file.name}" ошибка загрузки!`);
        setTimeout(() => setUploadErrorMessage(""), 2000);
      });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // сброс значения
      fileInputRef.current.click();
    }
  };

  const onEditSupplierClick = () => {
    setSelectedSupplierId(null)
    setSelectedSupplierIdFinal(null);   // сбрасываем текущий выбранный
    setModalOpen(true);                 // открываем модалку с выбором
  };

  const canBeSaved = summaryRows.length > 0 && summaryRows.every(row => row.isCorrect === true);


  // columns объявляем внутри компонента, чтобы иметь доступ к setSummaryRows
  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.1, hide: true },
    {
      field: 'actions',
      headerName: '',
      width: 36, // fixed small width
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.row.isCorrect) {
          return (
            <IconButton
              onClick={() => {
                setSummaryRows((prev) =>
                  prev.map((row) => {
                    if (row.id === params.row.id) {
                      return {
                        ...params.row, // ← Используем данные из params.row, включая последние изменения
                        isCorrect: true,
                      };
                    }
                    return row;
                  })
                );
              }}
              sx={{
                color: '#0000FF',
                width: 24,
                height: 24,
                borderRadius: '50%',
                transition: '0.3s ease',
                padding: 0,
                '&:hover': {
                  backgroundColor: '#B0E0E6',
                }
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 16, color: "#FF0000" }} />
            </IconButton>
          );
        }
        return null;
      }
    },
    { field: 'label', headerName: 'Название', flex: 0.8, editable: true },
    { field: 'value', headerName: 'Цена, ₽', flex: 0.1, editable: true },
  ];

  return (
    <>
      <MDBox width="100%" display="flex" flexDirection="column" gap={2}>
        <Card id="delete-account" sx={{ width: "100%" }}>
          <MDBox display="flex" flexDirection="row" width="100%">
            {/* Блок загрузки файла */}
            <MDBox p={3} width="100%" flex={2}>
              <MDBox
                p={6}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={({ palette, borders }) => ({
                  border: `${borders.borderWidth[1]} dashed #666`,
                  borderRadius: borders.borderRadius.lg,
                  backgroundColor: isDragging ? palette.grey[200] : "#f8f9fa",
                  transition: "background-color 0.2s ease-in-out",
                  cursor: "pointer",
                  textAlign: "center",
                })}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <MDBox display="flex" alignItems="center" justifyContent="center" mt={1}>
                  <MDTypography variant="body2" color="text" mr={1} fontSize="1rem">
                    Перетащите файл или
                  </MDTypography>
                  <MDButton
                    variant="text"
                    color="secondary"
                    size="small"
                    onClick={handleButtonClick}
                    sx={{
                      fontSize: "1rem",
                      textTransform: "none",
                      border: "1px solid #999",
                      backgroundColor: "#f0f0f0",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    загрузите с вашего устройства
                  </MDButton>
                </MDBox>
                <MDTypography variant="caption" color="text" mt={1} fontSize="0.7rem">
                  поддерживается формат .xlsx
                </MDTypography>
              </MDBox>
            </MDBox>

            {/* Блок с информацией о поставщике или картинкой */}
            {selectedSupplierIdFinal ? (
              <MDBox
                width="100%"
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <PriceListSupplierInformation supplierId={selectedSupplierIdFinal} onEditSupplierClick={onEditSupplierClick} />
              </MDBox>

            ) : (
              <MDBox
                width="100%"
                flex={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={1}
              >
                <img
                  src={WholeSale}
                  alt="Грузовик"
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  onClick={() => setModalOpen(true)}
                  style={{
                    width: 100,
                    height: 100,
                    marginBottom: 8,
                    filter: "grayscale(50%)",
                    opacity: 0.3,
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer"
                  }}
                />
                <MDTypography variant="body2" color="text" mr={1} fontSize="1rem">
                  Выберите поставщика
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </Card>
        {showSpinner && (
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={20}>
            <GridLoader color="#1976d2" size={24} margin={2} />
          </MDBox>
        )}
        {!showSpinner && summaryRows.length > 0 && (
          <Fade in timeout={400}>
            <Card sx={{ width: "100%" }}>
              <MDBox display="flex" width="100%">
                {/* Блок с кнопками */}
                <MDBox
                  m={2}
                  p={2}
                  flex={2}
                  sx={{
                    backgroundColor: '#e3f2fd',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2,
                  }}
                >
                  <Tooltip title="Сохранить">
                    <IconButton disabled={selectedSupplierIdFinal == null}>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                </MDBox>
                {/* Прогресс-бар перед таблицей */}
                <MDBox
                  flex={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MDBox
                    sx={{
                      width: '90%',
                      height: 10,
                      textAlign: 'center',
                    }}
                  >
                    <MDTypography display="block" variant="caption" fontWeight="medium" color="text">
                      {Math.round(correctPercentage)}%
                    </MDTypography>
                    {correctPercentage < 100 ? (
                      <MDProgress value={correctPercentage} color="success" variant="gradient" label={false} />
                    ) : (
                      <MDProgress
                        value={100}
                        color="success"
                        variant="gradient"
                        label={false}
                        sx={{
                          animation: 'blink 1s infinite',
                        }}
                      />
                    )}
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox p={3} bt={3}>
                <div style={{ width: '100%' }}>
                  <ThemeProvider theme={customTheme}>
                    <DataGrid
                      rows={summaryRows}
                      columns={columns}
                      disableColumnMenu
                      autoHeight
                      disableSelectionOnClick
                      rowHeight={24}
                      pageSizeOptions={[20, 50, 100]}
                      pagination // ← ОБЯЗАТЕЛЬНО
                      columnVisibilityModel={{
                        id: false,
                      }}
                      getRowClassName={(params) => params.row.isCorrect === false ? 'row-error' : ''}
                      getRowId={(row) => row.id}
                      onCellEditCommit={(params) => {
                        setSummaryRows((prevRows) =>
                          prevRows.map((row) =>
                            row.id === params.id
                              ? { ...row, [params.field]: params.value, edited: true }
                              : row
                          )
                        );
                      }}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 25,
                            page: 0,
                          },
                        },
                      }}
                      sx={{
                        '& .MuiDataGrid-columnHeader:nth-of-type(2)': {
                          maxWidth: '36px !important',
                          minWidth: '36px !important',
                        },
                        '& .MuiDataGrid-cell:nth-of-type(2)': {
                          maxWidth: '36px !important',
                          minWidth: '36px !important',
                        },
                        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                          outline: 'none',
                        },
                        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                          outline: 'none',
                        },
                        '& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within': {
                          outline: 'none',
                        },
                      }}
                    />
                    <style>
                      {`
                    .row-error {
                      background-color: #ffe6e6;
                    }
                    @keyframes blink {
                      0%   { opacity: 1; }
                      50%  { opacity: 0.4; }
                      100% { opacity: 1; }
                    }
                    .hover-border:hover {
                      border-color: #B0E0E6;
                    }
                 `}
                    </style>
                  </ThemeProvider>
                </div>
              </MDBox>
            </Card>
          </Fade>
        )}
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          fullWidth
          maxWidth={false} // Отключаем ограничение MUI
          PaperProps={{
            sx: {
              width: '40vw',    // ширина окна
              height: '60vh',   // высота окна
            },
          }}
        >
          <DialogContent
            disableScrollLock
            disabled={loadingSuppliers} // ← передаётся как prop
            sx={{
              p: 0,
              height: '100%',
              overflow: 'hidden', // 🔒 запрещаем скролл здесь
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <KPPriceLoadingSupplierFinder onLoadingChange={setLoadingSuppliers} setSelectedSupplierId={setSelectedSupplierId} />
          </DialogContent>
          <DialogActions>
            <MDButton
              onClick={() => {
                setSelectedSupplierIdFinal(selectedSupplierId)
                setModalOpen(false)
              }}
              color="info"
              variant="contained"
              disabled={selectedSupplierId == null}
            >
              Добавить поставщика
            </MDButton>
            <MDButton
              onClick={() => {
                setModalOpen(false)
              }}
              color="secondary"
            >
              Отмена
            </MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>
      <MDSnackbar
        color="success"
        icon="check"
        title="Успешно"
        content={uploadMessage}
        open={uploadMessage != ""}
        onClose={() => setUploadMessage("")}
        close
        bgWhite
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
      />
      <MDSnackbar
        color="error"
        icon="error"
        title="Ошибка выполнения запроса"
        content={uploadErrorMessage}
        open={uploadErrorMessage != ""}
        onClose={() => setUploadErrorMessage("")}
        close
        bgWhite
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
      />
    </>
  );

}

export default PriceListLoader;
