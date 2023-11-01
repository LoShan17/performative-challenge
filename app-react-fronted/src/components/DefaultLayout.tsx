import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { MouseEvent, useEffect } from "react";
import axiosClient from "../axios-client";

function DefaultLayout() {
    const { user, token, setUser, setToken, notification } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogOut = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => setUser(data));
    }, []);

    // An <Outlet> should be used in parent route elements to render their child route elements.
    // This allows nested UI to show up when child routes are rendered.

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">DashBoard</Link>
                <Link to="/stocks">Stocks</Link>
            </aside>
            <div className="content">
                <header>
                    <div>Stock Screener</div>
                    <div>
                        {user.name}
                        <a href="#" onClick={onLogOut} className="btn-logout">
                            Log Out
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
            {notification && (
                <div className="notification"> {notification}</div>
            )}
        </div>
    );
}

export default DefaultLayout;
