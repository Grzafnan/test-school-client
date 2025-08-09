import { createBrowserRouter } from "react-router-dom";
import Main from "./Main";
import Home from "../pages/Home";


const routes = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/home',
                element: <Home/>
            },
        ]
    }
])

export default routes;