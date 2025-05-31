import { GridColumnMenuContainer, useGridApiContext } from '@mui/x-data-grid';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { MenuItem, TextField } from '@mui/material';
import { useState } from 'react';

function CustomColumnMenu(props) {
  const { hideMenu, currentColumn } = props;
  const apiRef = useGridApiContext();
  const [filterValue, setFilterValue] = useState('');

  const handleSortAsc = () => {
    apiRef.current.sortColumn(currentColumn.field, 'asc');
    hideMenu();
  };

  const handleSortDesc = () => {
    apiRef.current.sortColumn(currentColumn.field, 'desc');
    hideMenu();
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    apiRef.current.setFilterModel({
      items: [
        {
          columnField: currentColumn.field,
          operatorValue: 'contains',
          value,
        },
      ],
    });
  };

  return (
    <GridColumnMenuContainer {...props}>
      <MDBox px={1} py={1} minWidth="200px">
        <MenuItem onClick={handleSortAsc}>
          <MDTypography variant="button">Сортировать ↑</MDTypography>
        </MenuItem>
        <MenuItem onClick={handleSortDesc}>
          <MDTypography variant="button">Сортировать ↓</MDTypography>
        </MenuItem>
        <MenuItem disableRipple disableTouchRipple>
          <TextField
            size="small"
            fullWidth
            placeholder="Фильтр..."
            value={filterValue}
            onChange={handleFilterChange}
          />
        </MenuItem>
        <MenuItem onClick={hideMenu}>
          <MDTypography variant="button">Закрыть</MDTypography>
        </MenuItem>
      </MDBox>
    </GridColumnMenuContainer>
  );
}

export default CustomColumnMenu