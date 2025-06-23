import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import { useState, useEffect } from "react";

function OrdersOverview({ data }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (Array.isArray(data)) {
      const transformed = data.map(item => ({
        color: `${(
          item.userAction === "CREATE" ? "primary" : 
          item.userAction === "CLOSED" ? "success" : 
          item.userAction === "STATUS_CHANGED" ? "warning" : 
          "info"
        )}`, 
        icon: "history", // или item.icon
        title: `${(
          item.userAction === "CREATE" ? "СОЗДАНО" :
            item.userAction === "DATA_CHANGE" ? "ИЗМЕНЕНО" :
              item.userAction === "STATUS_CHANGED" ? "ИЗМЕНЕН СТАТУС" :
                item.userAction === "CLOSED" ? "ОПЛАЧЕНО" :
                  item.userAction
        )}`,
        dateTime: `${(item.date)} (${(item.firstName)} ${(item.secondName[0])}.${(item.thirdName[0])}.)`,
      }));
      setHistory(transformed);
    }
  }, [data]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          История изменений
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {Array.isArray(history) && history.length > 0 ? (
          history.map((item, index) => (
            <TimelineItem
              key={index}
              color={item.color || "info"}
              icon={item.icon || "notifications"}
              title={item.title}
              dateTime={item.dateTime}
              lastItem={index === history.length - 1}
            />
          ))
        ) : (
          <MDTypography variant="body2" color="text">
            История отсутствует.
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
