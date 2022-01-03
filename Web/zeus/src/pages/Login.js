import React,{ useContext,useState } from "react";

import { Context } from "../Context/AuthContext";
import '../components/Login/Login.css'
import logo from '../assets/pngwing.com.png' 


function initialstate(){
    return {user:"",password:""}
}





function LoginPage (){
    const [values,setValues] = useState(initialstate);

    function onChange (event){
        const {value, name} = event.target;

        setValues({
            ...values,
            [name]: value,
        });
    }


    const { handleLogin } = useContext(Context)
    


    return(
        <div className="pageContainer">
            <div className="loginPage">
                <div>
                    <img className="Logo" src={logo} alt="logo"/>
                </div>
                <h1>Login</h1>
                <form>
                    <div className="loginInputLabel">
                        <label>Email</label>
                        <input id='user' type='text' name='user'  placeholder="Email" onChange={onChange} value={values.user} />
                    </div>
                    <div className="loginInputLabel">
                        <label>Senha</label>
                        <input id='password' type='password' name='password' placeholder="Senha" onChange={onChange} value={values.password}/>
                    </div>
                    <div className="loginButton">
                    <button type='button' onClick={()=>{handleLogin(values.user,values.password)}}>Logar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default LoginPage









