import { createContext, useContext, useState } from "react";

const StateContext = createContext<{
    user: { name?: string };
    token: string | null;
    setUser: Function;
    setToken: Function;
    notification: string;
    setNotification: Function;
}>({
    user: {},
    token: null,
    setUser: () => {},
    setToken: () => {},
    notification: "",
    setNotification: () => {},
});

export const ContextProvider = ({ children }: any) => {
    const [user, setUser] = useState({});
    const [notification, _setNotification] = useState("");
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const setNotification = (notification: string) => {
        _setNotification(notification);
        setTimeout(() => {
            _setNotification("");
        }, 2000);
    };

    const setToken = (token: string | null) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                notification,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
