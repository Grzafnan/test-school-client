import { createBrowserRouter } from "react-router-dom";
import Main from "./Main";
import Home from "../pages/Home";
import Error from "../components/ErrorPage/Error";
import Assessment from "../components/Assessment/Assesment";


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
                element: <Assessment/>
            }
        ]
    }
])

export default routes;