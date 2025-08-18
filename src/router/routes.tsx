import { createBrowserRouter } from "react-router-dom";
import Main from "./Main";
import Home from "../pages/Home/Home";
import Error from "../pages/ErrorPage/Error";
import Assessment from "../pages/Assessment/Assessment";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../components/Dashboard/Admin/Users";
import Question from "../components/Dashboard/Admin/Question";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import ProtectedAdminRoute from "./ProtectedAdminRoute";


const routes = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        errorElement: <Error/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/home',
                element: <Home/>
            },
            {
                path: '/assessment',
                element:<PrivateRoute><Assessment/></PrivateRoute>
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/register',
                element: <Register/>
            },
            {
                path: '/unauthorized',
                element: <Unauthorized/>
            }
        ]
    }, 
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
        errorElement: <Error/>,
        children: [
            {
                path: '',
                element: <Dashboard/>
            },
            {
                path: '/dashboard/users',
                element: <ProtectedAdminRoute allowedRoles={['admin']}><Users/></ProtectedAdminRoute>
            },
            {
                path: '/dashboard/questions',
                element: <ProtectedAdminRoute allowedRoles={['admin']}><Question/></ProtectedAdminRoute>
            }
        ]

    }
])

export default routes;