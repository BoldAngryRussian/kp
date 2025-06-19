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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth >
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
                    ? '#fffdf5'
                    : calculateType === 'transport'
                    ? '#f8fbff'
                    : calculateType === 'count'
                    ? '#f7fdf8'
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
                    <Box  borderRadius={2} borderColor="grey.300" bgcolor="white" px={2} py={1}>
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
        <MDButton color="info" variant="contained" onClick={handleApply}>Применить</MDButton>
        <MDButton onClick={onClose} color="secondary">Отмена</MDButton>
      </DialogActions>
    </Dialog>
  );
}