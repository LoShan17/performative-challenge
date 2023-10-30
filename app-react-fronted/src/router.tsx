import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Stocks from "./views/Stocks";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import StockForm from "./views/StockForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/stocks" />,
            },
            {
                path: "/stocks",
                element: <Stocks />,
            },
            {
                path: "/stocks/new",
                element: <StockForm key="stockCreate" />,
            },
            {
                path: "/stocks/:id",
                element: <StockForm key="stockUpdate" />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
