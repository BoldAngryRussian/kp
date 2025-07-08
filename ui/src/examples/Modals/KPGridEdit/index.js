import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Box, Radio, RadioGroup, FormControlLabel, FormControl,
  MenuItem, Select
} from '@mui/material';
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { temperatureMap } from 'utils/kp_consts';

export default function KPGridEdit({ open, onClose, onApply }) {
  const [calculateType, setCalculateType] = useState('markup');
  const [markupType, setMarkupType] = useState('percent');
  const [inputValue, setInputValue] = useState('');
  const [elemsCheckedType, setElemsCheckedType] = useState('all');
  const [temperatureValue, setTemperatureValue] = useState('');

  const handleTabChange = (_, newValue) => setCalculateType(newValue);
  const handleMarkupChange = (e) => setMarkupType(e.target.value);
  const handleElemsChange = (e) => setElemsCheckedType(e.target.value);
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) setInputValue(val);
  };
  const handleTemperatureChange = (event) => setTemperatureValue(event.target.value);

  const handleApply = () => {
    onApply?.({
      calculate: calculateType,
      type: markupType,
      elems: elemsCheckedType,
      value: calculateType === 'temperature_mode' ? (temperatureValue === '' ? null : temperatureValue) : (inputValue === '' ? null : parseFloat(inputValue)),
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { height: '550px', width: '800px' } }}
    >
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
            //backgroundColor: '#E0FFFF', // чуть светлый фон для контраста
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
          <Tab label="Температурный режим" value="temperature_mode" />
          <Tab label="Количество" value="count" />
          <Tab label="Вес единицы товара" value="weight" />
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
                  ? '#fffdf5'
                  : calculateType === 'transport'
                    ? '#f8fbff'
                    : calculateType === 'count'
                      ? '#f7fdf8'
                      : calculateType === 'temperature_mode'
                        ? '#fdf3f3'
                        : '#F7F7FD', // для weight
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
            <Box borderRadius={2} borderColor="grey.300" bgcolor="white" px={2} py={1}>
              {calculateType !== 'temperature_mode' ? (
                <MDInput
                  value={inputValue}
                  onChange={handleInputChange}
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
              ) : (
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={temperatureValue}
                    onChange={handleTemperatureChange}
                    displayEmpty
                    renderValue={(selected) => (
                      selected ? selected : <MDTypography sx={{ opacity: 0.5 }}>Выберите режим</MDTypography>
                    )}
                    sx={{
                      height: '43px',
                      borderRadius: 1,
                      backgroundColor: 'white',
                      px: 1.5,
                      py: 0.75,
                      fontSize: '0.875rem',
                      color: temperatureValue ? 'inherit' : '#999',
                    }}
                  >
                    <MenuItem value="" disabled>Выберите режим</MenuItem>
                    {Object.entries(temperatureMap).map(([code, label]) => (
                      <MenuItem key={code} value={label}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </MDBox>
        </>

      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
        <MDButton color="info" variant="contained" onClick={handleApply}>Применить</MDButton>
        <MDButton onClick={onClose} color="secondary">Отмена</MDButton>
      </DialogActions>
    </Dialog>
  );
}