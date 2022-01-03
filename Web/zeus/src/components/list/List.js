import React from "react";

import './List.css'

function ComprasLista(props) {
    const arrayCompras = props.arrayCompras
    const listCompras = arrayCompras.map((compra,index) => 
        <li key = {index} className="ListComponent">{`${arrayCompras[index].createdAt.slice(8,10)}/${arrayCompras[index].createdAt.slice(5,7)}/${arrayCompras[index].createdAt.slice(0,4)}`}| Valor: {compra.title.split('|')[0]}R$ | Descrição: {compra.title.split('|')[1]}</li>
    );
    return(
        <div className="Lista">
            <ul>{listCompras}</ul>
        </div>
    )
}

export default ComprasLista