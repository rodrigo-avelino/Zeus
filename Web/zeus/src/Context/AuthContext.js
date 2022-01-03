import React, { createContext, useState,useEffect } from "react";

import api from '../api'
import history from "../history";


const Context = createContext();

function AuthProvider({ children }){
    const [authenticated,setAuthenticated] = useState(false)
    const [loading,setLoading] = useState(true)


    
    useEffect(()=>{
        const token = localStorage.getItem('token')

        if(token){
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }
        setLoading(false)
    },[])
                            

    async function handleLogin(email, password){
        const {data:{ token , user}} = await api.post('/auth/authenticate',{
            email,
            password,
        })
        localStorage.setItem('token', JSON.stringify(token))
        localStorage.setItem('userid', JSON.stringify(user._id))
        api.defaults.headers.Authorization = `Bearer ${token}`
        setAuthenticated(true)
        history.push('/users');
        window.location.reload()
    }

     function handleLogout (){
        setAuthenticated(false)
        localStorage.removeItem('token')
        localStorage.removeItem('userid')
        api.defaults.headers.Authorization = undefined
        history.push('/login');
        window.location.reload()
        
    }

    if(loading){
        console.log("carregando")
        return (
            <h1>carregando</h1>
        )
    }



    return(
        <Context.Provider value={{ authenticated , handleLogin, handleLogout, loading}}>
            {children}
        </Context.Provider>
    )
}

export {Context, AuthProvider}