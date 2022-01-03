import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Context } from './Context/AuthContext';

import LoginPage from './pages/Login'
import UsersPage from './pages/Users';

function CustomRoute ({ isPrivate, ...rest }){
  const {authenticated, loading} = useContext(Context);

  if (loading){
    return (
    <h1>Carregando...</h1>
    )
  }


  if (isPrivate && !authenticated){
    return <Redirect to="/login" />
  }
  return <Route {...rest} />
}

export default function Routes() {
  return (
    <Switch>
      <CustomRoute exact path="/login" component={LoginPage} />
      <CustomRoute isPrivate exact path="/users" component={UsersPage} />
    </Switch>
  );
}