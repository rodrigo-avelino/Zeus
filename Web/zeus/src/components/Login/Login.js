import React, { useState } from "react";
import './Login.css'


function initialstate(){
    return {user:"",password:""}
}
export default function Login() {
    const [values,setValues] = useState(initialstate);

    function onChange (event){
        const {value, name} = event.target;

        setValues({
            ...values,
            [name]: value,
        });
    }
    return (
        <div className="pageContainer">
            <div className="loginPage">
                <h1>Login</h1>
                <form>
                    <div className="loginInputLabel">
                        <label>usuario</label>
                        <input id='user' type='text' name='user' onChange={onChange} value={values.user} />
                    </div>
                    <div className="loginInputLabel">
                        <label>senha</label>
                        <input id='password' type='password' name='password' onChange={onChange} value={values.password}/>
                    </div>
                    <div className="loginButton">
                    <button type='button'>singin</button>
                    </div>
                </form>
            </div>
        </div>
    );
  }