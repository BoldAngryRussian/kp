// @mui material components
import Card from "@mui/material/Card";
import Fade from '@mui/material/Fade';
import MDSnackbar from "components/MDSnackbar";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import MDProgress from "components/MDProgress";

import { GridLoader } from "react-spinners";

// React
import { useState, useCallback, useRef, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { DataGrid } from '@mui/x-data-grid';

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
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [summaryRows, setSummaryRows] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [initialErrors, setInitialErrors] = useState(0);
  const fileInputRef = useRef(null);

  const currentErrors = summaryRows.filter(item => !item.isCorrect).length;
  const correctPercentage = initialErrors > 0
    ? ((initialErrors - currentErrors) / initialErrors) * 100
    : 100;

  const uploadFile = useCallback((file) => {
    const formData = new FormData();
    formData.append("file", file);
    setShowSpinner(true);
    fetch("/api/v1/prices/upload", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        setTimeout(() => setShowSpinner(false), 1000);

        let data = [];
        try {
          data = await res.json(); // ожидаем [{ name, price }, ...]
        } catch (e) {
          console.warn("Ответ без тела");
        }

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
        setUploadMessage(`Файл "${file.name}" успешно загружен`);
        setTimeout(() => setUploadMessage(""), 2000);
      })
      .then((data) => {
        setUploadMessage(`Файл "${file.name}" успешно загружен`);
      })
      .catch((err) => {
        console.error("Ошибка загрузки", err);
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
    fileInputRef.current.click();
  };

  const hasUnsavedChanges =
    summaryRows.length > 0 &&
    summaryRows.every(row => row.isCorrect === true);


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
          <MDBox px={2} display="flex" justifyContent="space-between" alignItems="center">
            {/* Скрытый input для выбора файла */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </MDBox>
          <MDBox p={2} width="100%" height="100%">
            <MDBox
              p={4}
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
        </Card>
        {showSpinner && (
          <MDBox display="flex" justifyContent="center" alignItems="center" mt={20}>
            <GridLoader color="#1976d2" size={24} margin={2} />
          </MDBox>
        )}
        {!showSpinner && summaryRows.length > 0 && (
          <Fade in timeout={400}>
            <Card sx={{ width: "100%" }}>
              {/* Прогресс-бар перед таблицей */}
              <MDBox px={3} pt={2} display="flex" justifyContent="center">
                {/* Прогресс-бар, который всегда реагирует на summaryRows */}
                <MDBox
                  sx={{
                    width: '40%',
                    height: 10,
                    mb: 2,
                    mx: 'auto', // центрирует по горизонтали
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
                 `}
                    </style>
                  </ThemeProvider>
                </div>
              </MDBox>
            </Card>
          </Fade>
        )}
        {hasUnsavedChanges && (
          <MDBox
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1300,
            }}
          >
            <Fab
              color="success"
              aria-label="save"
              onClick={() => {
                // Здесь можешь вызвать API или обработчик сохранения
              }}
            >
              <SaveIcon sx={{ width: 36, height: 36, color: "#00FF00" }} />
            </Fab>
          </MDBox>
        )}
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
    </>
  );

}

export default PriceListLoader;
