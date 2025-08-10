import { createBrowserRouter } from "react-router-dom";
import Main from "./Main";
import Home from "../pages/Home/Home";
import Error from "../pages/ErrorPage/Error";
import Assessment from "../pages/Assessment/Assessment";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PrivateRoute from "./PrivateRoute";


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
            }
        ]
    }
])

export default routes;