/*
import React, { useState } from 'react';
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import FormLabel from '@mui/material/FormLabel';
import MDTypography from "components/MDTypography";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField
} from '@mui/material';

export default function KPGridEdit({ open, onClose, onApply }) {
  const [calculateType, setCalculateType] = useState('');
  const [markupType, setMarkupType] = useState('percent');
  const [inputValue, setInputValue] = useState('');
  const [elemsCheckedType, setElemsCheckedType] = useState('all');

const handleRadioCalculateChange = (event) => {
    setCalculateType(event.target.value);
};

const handleRadioChange = (event) => {
    setMarkupType(event.target.value);
};

const handleElemsRadioChange = (event) => {
    setElemsCheckedType(event.target.value);
  };

const handleInputChange = (event) => {
    // Допустим, принимаем только корректное число с точкой
    const val = event.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
        setInputValue(val);
    }
};

const handleApply = () => {
    // Формируем объект с данными
    const data = {
        calculate: calculateType,
        type: markupType,
        elems: elemsCheckedType,
        value: inputValue === '' ? null : parseFloat(inputValue),
    };
    if (onApply) {
        onApply(data);  // Передаем данные родителю
    }
    onClose(); // Закрываем диалог
};


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          backgroundColor: '#E0FFFF',
        },
      }}
    >
      <DialogContent>
        <FormControl sx={{ width: '100%' }}>
        <MDBox
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            width="100%"
            mt={0.5}
            mb={1}
        >
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={calculateType}
                onChange={handleRadioCalculateChange}
                sx={{
                        justifyContent: "space-between",
                        width: "100%",
                    }}
            >
            <FormControlLabel value="markup" control={<Radio />} label="Надбавка" />
            <FormControlLabel value="transport" control={<Radio />} label="Транспорт" />
            <FormControlLabel value="count" control={<Radio />} label="Количество" />
            <FormControlLabel value="weight" control={<Radio />} label="Вес" />
            </RadioGroup>
        </MDBox>
        </FormControl>
        <MDBox display="flex" justifyContent="space-between" width="100%">
            <FormControl >
                <MDTypography variant="subtitle2" fontWeight="medium" color="text" mb={1}>Расчет</MDTypography>
                <MDBox
                    border={1}
                    borderColor="grey.300"
                    borderRadius={2}
                    p={2}
                    mt={1}
                    bgcolor="white"
                >
                    <RadioGroup
                    value={markupType}
                    onChange={handleRadioChange}
                    name="markup-type"
                    >
                    <FormControlLabel value="percent" control={<Radio />} label="Процент" />
                    <FormControlLabel value="fixed" control={<Radio />} label="Фиксированно" />
                    </RadioGroup>
                </MDBox>
            </FormControl>
            <FormControl>
                <MDTypography variant="subtitle2" fontWeight="medium" color="text" mb={1}>Товары</MDTypography>
                <MDBox
                    border={1}
                    borderColor="grey.300"
                    borderRadius={2}
                    p={2}
                    mt={1}
                    bgcolor="white"
                >
                    <RadioGroup
                    value={elemsCheckedType}
                    onChange={handleElemsRadioChange}
                    name="elems-checked-type"
                    >
                    <FormControlLabel value="checked" control={<Radio />} label="Только выделенные" />
                    <FormControlLabel value="all" control={<Radio />} label="Все" />
                    </RadioGroup>
                </MDBox>
            </FormControl>
        </MDBox>     
          <MDBox >
            <FormControl fullWidth>
                <MDBox
                    borderColor="grey.300"
                    borderRadius={2}
                    py={3} px={0}
                    bgcolor="white"
                >
                        <TextField
                            value={inputValue}
                            onChange={handleInputChange}
                            variant="outlined"
                            type="number"
                            inputProps={{
                                step: "0.01",         // шаг — два знака после запятой
                                min: "0",             // минимальное значение (по желанию)
                                inputMode: "decimal", // на мобилках вызывает цифровую клавиатуру с точкой
                                pattern: "\\d+(\\.\\d{0,2})?" // ограничение на 2 знака после точки (валидируется вручную)
                            }}
                            placeholder="Введите значение"
                            fullWidth
                        />
                </MDBox>
            </FormControl>
  </MDBox>   
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
        <MDButton color="success" onClick={handleApply}>Применить</MDButton>
        <MDButton color="info" onClick={onClose}>Закрыть</MDButton>
      </DialogActions>
    </Dialog>
  );
}
  */


import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Box, Radio, RadioGroup, FormControlLabel, FormControl, TextField
} from '@mui/material';
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

export default function KPGridEdit({ open, onClose, onApply }) {
  const [calculateType, setCalculateType] = useState('markup');
  const [markupType, setMarkupType] = useState('percent');
  const [inputValue, setInputValue] = useState('');
  const [elemsCheckedType, setElemsCheckedType] = useState('all');

  const handleTabChange = (_, newValue) => setCalculateType(newValue);
  const handleMarkupChange = (e) => setMarkupType(e.target.value);
  const handleElemsChange = (e) => setElemsCheckedType(e.target.value);
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) setInputValue(val);
  };

  const handleApply = () => {
    onApply?.({
      calculate: calculateType,
      type: markupType,
      elems: elemsCheckedType,
      value: inputValue === '' ? null : parseFloat(inputValue),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 2, backgroundColor: '#E0FFFF' } }}>
      <DialogTitle>
        <MDTypography variant="h5" fontWeight="bold">Настройка расчёта</MDTypography>
      </DialogTitle>

      <DialogContent>
        <Tabs
            value={calculateType}
            onChange={handleTabChange}
            variant="fullWidth"
            TabIndicatorProps={{
                style: {
                backgroundColor: '#1976d2', // основной цвет индикатора
                height: 3,
                borderRadius: 3,
                },
            }}
            sx={{
                mb: 2,
                backgroundColor: '#E0FFFF', // чуть светлый фон для контраста
                borderRadius: 2,
                '& .MuiTab-root': {
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    color: '#7b809a',
                    textTransform: 'none',
                    minHeight: 'auto',
                    py: 1,
                },
                '& .Mui-selected': {
                    fontWeight: 700,
                    backgroundColor: 'white',
                    borderRadius: 2,
                },
                '& .Mui-selected .MuiTab-wrapper': {
                    color: '#1976d2', // 🎯 вот это работает
                },
            }}
            >
            <Tab label="Надбавка" value="markup" />
            <Tab label="Транспорт" value="transport" />
            <Tab label="Количество" value="count" />
            <Tab label="Вес" value="weight" />
        </Tabs>
    
            <>
            <MDBox
            display="flex"
            justifyContent="space-between"
            gap={2}
            mb={2}
            sx={{
                backgroundColor:
                calculateType === 'markup'
                    ? '#fff9e6'
                    : calculateType === 'transport'
                    ? '#e6f4ff'
                    : calculateType === 'count'
                    ? '#e8f5e9'
                    : '#E6E6FA', // для weight
                p: 2,
                borderRadius: 2,
                flexDirection: 'row',
            }}
            >
            {calculateType === 'markup' || calculateType === 'transport' ? (
                <FormControl component="fieldset" sx={{ flex: 1 }}>
                <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>Расчёт</MDTypography>
                <Box border={1} borderRadius={2} borderColor="grey.300" p={2} bgcolor="white">
                    <RadioGroup value={markupType} onChange={handleMarkupChange}>
                    <FormControlLabel
                        value="percent"
                        control={<Radio />}
                        label={calculateType === 'transport' ? 'За кг' : 'Процент'}
                    />
                    <FormControlLabel value="fixed" control={<Radio />} label="Фиксированно" />
                    </RadioGroup>
                </Box>
                </FormControl>
            ) : null}

            <FormControl component="fieldset" sx={{ flex: calculateType === 'weight' || calculateType === 'count' ? 1 : 1 }}>
                <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>Товары</MDTypography>
                <Box border={1} borderRadius={2} borderColor="grey.300" p={2} bgcolor="white">
                <RadioGroup value={elemsCheckedType} onChange={handleElemsChange}>
                    <FormControlLabel value="checked" control={<Radio />} label="Только выделенные" />
                    <FormControlLabel value="all" control={<Radio />} label="Все" />
                </RadioGroup>
                </Box>
            </FormControl>
            </MDBox>

                <MDBox>
                    <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>Значение</MDTypography>
                    <Box border={1} borderRadius={2} borderColor="grey.300" bgcolor="white" px={2} py={1}>
                        <TextField
                        value={inputValue}
                        onChange={handleInputChange}
                        variant="outlined"
                        type="number"
                        inputProps={{
                            step: "0.01",
                            min: "0",
                            inputMode: "decimal",
                            pattern: "\\d+(\\.\\d{0,2})?",
                        }}
                        placeholder="Введите значение"
                        fullWidth
                        />
                    </Box>
                </MDBox>
        </>

      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
        <MDButton color="success" onClick={handleApply}>Применить</MDButton>
        <MDButton color="info" onClick={onClose}>Закрыть</MDButton>
      </DialogActions>
    </Dialog>
  );
}