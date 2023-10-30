import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [errors, setErrors] = useState<any | null>(null);

    const { setUser, setToken } = useStateContext();

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            email: emailRef.current && emailRef.current.value,
            password: passwordRef.current && passwordRef.current.value,
        };
        console.log(payload);
        // set current errors to null
        setErrors(null);
        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                console.log(data);
                setToken(data.token);
                setUser(data.user);
            })
            .catch((err) => {
                console.log(err);
                const response = err.response;
                // 422 catches when the backend doesn't validate user name and password
                if (response && response.status === 422) {
                    // conditionally set errors as they will be provided from the form if that is the case
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        // just rebuild the structure above setting the message
                        setErrors({
                            email: [response.data.message],
                        });
                    }
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form action="" onSubmit={onSubmit}>
                    <h1 className="title"> Login into your account</h1>
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    )}
                    <input ref={emailRef} type="email" placeholder="Email" />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />
                    <button className="btn btn-block">Login</button>
                    <p className="message">
                        Not Registered?
                        <Link to="/signup"> Create and Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
