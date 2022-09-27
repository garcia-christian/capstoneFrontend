import React, { Fragment, useState } from "react";
import {toast} from "react-toastify"


import AuthService from "../services/auth.service";

import "./css/loginstyle.css"
import logo from './images/blue.png'
import side from './images/sidepic.png'
 




const Login = ({setAuth}) => {

    const [inputs,setInputs] = useState({
        email:"",
        password:""
    })
    
    
    const {email, password, name} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value  })
    }
    
    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = {email,password}

                const response = await fetch(`http://localhost:5000/auth/login`,{
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                })

                const parseRes = await response.json()
                console.log(parseRes.access); 
                if(parseRes.access){
                    localStorage.setItem("token",parseRes.access)
                    setAuth(true)
                    toast.success("Logged in successfully")
                }else{
                    setAuth(false)
                    toast.error(parseRes)
                }

             
            
        } catch (error) {
            console.error(error.message)
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
                                                <input type="email" name="email" class="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={e => onChange(e)}   />
                                                    <label for="floatingInput">Email address</label>
                                            </div>

                                            <div class="form-floating mb-3">
                                                <input type="password" name="password"   class="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={e => onChange(e)} />
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