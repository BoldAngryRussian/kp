// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Billing from "layouts/billing";
import SignIn from "layouts/authentication/sign-in";
import Dictionaries from "layouts/dictionaries"
import UserProfile from "layouts/user_profile";
import KpExecuting from "layouts/kp_executing";

// @mui icons
import Icon from "@mui/material/Icon";
import KPCreationStartLayout from "layouts/kp-creation/kp-creation-start-layout";

const routes = [
  {
    type: "collapse",
    name: "Формирование КП",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Формирование КП 2",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <KPCreationStartLayout />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Загрузка прайс-листов",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
    protected: true,
  },  
    {
    type: "collapse",
    name: "Учет КП",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <KpExecuting />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Справочники",
    key: "dictionaries",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "dictionaries",
    component: <Dictionaries />,
    protected: true,
  },

  {
    type: "collapse",
    name: "Профиль",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <UserProfile />,
    protected: true,
  },
  {
    type: "divider",
    protected: false,
  },  
  {
    type: "collapse",
    name: "Выход",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    protected: false,
  },
  /*
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    protected: true,
  },
  */
];

export default routes;
