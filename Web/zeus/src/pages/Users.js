import React, { useEffect, useState, useContext } from 'react';
import api from '../api';

import { Context } from '../Context/AuthContext';
import  ComprasLista  from '../components/list/List'

import '../components/User/User.css'
import logo from '../assets/pngwing.com.png' 


function UserPage() {
  const { handleLogout } = useContext(Context)
  const userId = localStorage.getItem('userid')
  const [user,setUser] = useState('')
  const [arrayCompras,setArrayCompras] = useState([])
  let somatorio = 0
  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/cachorros/user/${JSON.parse(userId)}`);
      setUser(data.userCachorros[0].user.name);
      setArrayCompras(data.userCachorros[0].compras);
    })();
  },[userId]);
  for(let i=0;i<arrayCompras.length;i++){
    somatorio+= parseFloat(arrayCompras[i].title.split('|')[0])
  }
  return(
    <div className="Body">
      <div className="Header">
        <div className="SubHeader">
          <img className="LogoHeader" src={logo} alt="logo"/>
          <h3>Bem vindo, {user}</h3>
        </div>
        <button type="button" onClick={()=>{handleLogout()}} > logout</button>
      </div>
      <div className="Table">
        <h2>Resumo de gastos</h2>
        <h4>valor total gasto: {somatorio}R$</h4>
        <p>lista de compras:</p>
        <ComprasLista arrayCompras={arrayCompras} />
      </div>
    </div>
  );
}

export default UserPage