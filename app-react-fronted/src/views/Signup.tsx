import { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

function Signup() {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmationRef = useRef<HTMLInputElement>(null);

    const [errors, setErrors] = useState(null);

    const { setUser, setToken } = useStateContext();

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            name: nameRef.current && nameRef.current.value,
            email: emailRef.current && emailRef.current.value,
            password: passwordRef.current && passwordRef.current.value,
            password_confirmation:
                passwordConfirmationRef.current &&
                passwordConfirmationRef.current.value,
        };
        console.log(payload);
        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                console.log(data);
                setToken(data.token);
                setUser(data.user);
            })
            .catch((err) => {
                console.log(err);
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form action="" onSubmit={onSubmit}>
                    <h1 className="title"> Sign Up for free</h1>
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    <input ref={nameRef} type="name" placeholder="Full Name" />
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email Address"
                    />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                    />
                    <input
                        ref={passwordConfirmationRef}
                        type="password"
                        placeholder="Password Confirmation"
                    />
                    <button className="btn btn-block">Sign Up</button>
                    <p className="message">
                        Already Registered?
                        <Link to="/login"> Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
