// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";

export default function data() {
  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Название", accessor: "name", width: "60%", align: "left" },
      { Header: "Цена закупки", accessor: "price", align: "left" },
      { Header: "Наценка", accessor: "price_to_us", align: "left" },
      { Header: "Транспорт", accessor: "delivery", align: "left" },
      { Header: "Маржа", accessor: "budget", align: "left" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        name: <Project image={LogoAsana} name="Кальмар кольца в панировке 4-9 10*1 ЕАС Китай (27.11.23) 1/10/1" />,
        price: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            638
          </MDTypography>
        ),
        price_to_us: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            738
          </MDTypography>
        ),
        delivery: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            50
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="success" fontWeight="medium">
            150
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        )
      },
            {
        name: <Project image={logoAtlassian} name="Горбуша ПБГ 24 ТУ ЕАС Меридиан ООО 1/22/11" />,
        price: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            442
          </MDTypography>
        ),
        price_to_us: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            450
          </MDTypography>
        ),
        delivery: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            10
          </MDTypography>
        ),
        budget: (
          <MDTypography component="a" href="#" variant="button" color="success" fontWeight="medium">
            18
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        )
      },
    ]
  };
}
