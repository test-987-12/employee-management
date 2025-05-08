import { createBrowserRouter, } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import PasswordReset from "../Pages/PasswordReset/PasswordReset";
import Dashboard from "../Layout/Dashboard";
import AddAsset from "../Pages/Dashboard/AddAsset/AddAsset";
import EditAsset from "../Pages/Dashboard/EditAsset/EditAsset";
import MyEmployeeList from "../Pages/Dashboard/MyEmployeeList/MyEmployeeList";
import HrHome from "../Pages/Dashboard/HrHome/HrHome";
import AssetList from "../Pages/Dashboard/AssetList/AssetList";
import AddEmployee from "../Pages/Dashboard/AddEmployee/AddEmployee";
import RequestAssets from "../Pages/Dashboard/RequestAssets/RequestAssets";
import MyRequestAssets from "../Pages/Dashboard/MyRequestAssets/MyRequestAssets";
import MyAssets from "../Pages/Dashboard/MyAssets/MyAssets";
import MyTeam from "../Pages/Dashboard/MyTeam/MyTeam";
import Profile from "../Pages/Profile/Profile";
import EmployeeHome from "../Pages/Dashboard/EmployeeHome/EmployeeHome";
import Payment from "../Pages/Dashboard/Payment/Payment";
import AllRequests from "../Pages/Dashboard/AllRequest/AllRequests";

import IncreaseLimit from "../Pages/IncreaseLimit/IncreaseLimit";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import AuthPage from "../Pages/Auth/AuthPage";
import PrivateRoute from "./PrivateRoute/PrivateRoutes";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },

      {
        path: '/auth',
        element: <AuthPage />
      },
      {
        path: "/payment",
        element: <Payment></Payment>
      },
      {
        path: "/reset-password",
        element: <PasswordReset></PasswordReset>
      },

    ]
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    children: [
      {
        path: 'home',
        element: <HrHome></HrHome>
      },
      {
        path: 'assetList',
        element: <AssetList></AssetList>
      },
      {
        path: 'addAsset',
        element: <AddAsset></AddAsset>
      },
      {
        path: 'editAsset/:id',
        element: <EditAsset></EditAsset>
      },
      {
        path: 'request',
        element: <AllRequests></AllRequests>
      },

      {
        path: 'myEmployeeList',
        element: <MyEmployeeList></MyEmployeeList>
      },
      {
        path: 'addEmployee',
        element: <AddEmployee></AddEmployee>
      },


      {
        path: "employeeHome",
        element: <EmployeeHome></EmployeeHome>
      },
      {
        path: "requestAssets",
        element: <RequestAssets></RequestAssets>
      },
      {
        path: "myAssets",
        element: <MyAssets></MyAssets>
      },
      {
        path: "myRequestedAssets",
        element: <MyRequestAssets></MyRequestAssets>
      },

      {
        path: "myTeam",
        element: <MyTeam></MyTeam>
      },
      {
        path: "profile",
        element: <Profile></Profile>
      },
      {
        path: "increaseLimit",
        element: <IncreaseLimit></IncreaseLimit>
      }

    ]
  }

]);