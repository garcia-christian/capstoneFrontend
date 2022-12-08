import React, { Fragment, useState, useRef } from "react";
import { useContext } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { urlApi } from "../context/urlAPI";



import "./css/loginstyle.css"
import logo from './images/blue.png'
import side from './images/sidepic.png'





const Login = ({ setAuth }) => {
    const { BASEURL } = useContext(urlApi);
    const refEmail = useRef(null);
    const refPassword = useRef(null);
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })


    const { email, password, name } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { email, password }

            const response = await fetch(BASEURL + `/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            const parseRes = await response.json()
            console.log(parseRes.access);
            if (parseRes.access) {
                localStorage.setItem("token", parseRes.access)
                setAuth(true)
                toast.success("Logged in successfully", {
                    position: "top-center"
                })
            } else {
                if (inputs.email == "") {
                    toast.error("Input Email")
                    refEmail.current.focus();
                } else if (inputs.password == "") {
                    toast.error("Input Password")
                    refPassword.current.focus();
                } else {
                    setAuth(false)
                    toast.error(parseRes)
                    if (parseRes == 'Invalid Password') {
                        refPassword.current.focus();

                    }
                }

            }



        } catch (error) {
            console.error(error.message)
            toast.error("No Connection to Server")
        }

    }

    return (
        <Fragment>

            <div>
                <div class="container-fluid ps-md-0">
                    <div class="row g-0">
                        <div class="d-none d-md-flex col-md-6 col-lg-6 bg-image align-items-center py-5">
                            <img src={side} class="side" alt="logo" />

                        </div>

                        <div class="col-md-8 col-lg-6">

                            <div class="login d-flex align-items-center py-5">
                                <div class="container">
                                    <div class="row">

                                        <div class="col-md-9 col-lg-8 mx-auto">
                                            <img src={logo} class="logo" alt="logo" />



                                            <form onSubmit={onSubmitForm}>


                                                <div class="form-floating mb-3">
                                                    <input ref={refEmail} type="email" name="email" class="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={e => onChange(e)} />
                                                    <label for="floatingInput">Email address</label>
                                                </div>

                                                <div class="form-floating mb-3">
                                                    <input ref={refPassword} type="password" name="password" class="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={e => onChange(e)} />
                                                    <label for="floatingPassword">Password</label>
                                                </div>

                                                <div class="form-check mb-3">
                                                    <input class="form-check-input" type="checkbox" value="" id="rememberPasswordCheck" />
                                                    <label class="form-check-label" for="rememberPasswordCheck">
                                                        Remember password
                                                    </label>
                                                </div>

                                                <div class="d-grid">
                                                    <button class="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2" type="submit">Sign in</button>
                                                    <div class="">
                                                        <p class="small mb-5 pb-lg-2"><a class="text-muted" href="#!">Forgot password?</a></p>
                                                    </div>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>

    )
}

export default Login;