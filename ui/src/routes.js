// Material Dashboard 2 React layouts
import Billing from "layouts/billing";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up"
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
    key: "creating-kp",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/creating-kp",
    component: <KPCreationStartLayout />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Загрузка прайс-листов",
    key: "price-list",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/price-list",
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
  {
    type: "forbiden",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    protected: false,
  }
];

export default routes;
