import {
    Redirect,
    Route,
    Switch,
    useRouteMatch
} from 'react-router-dom';

import ForgotPassword from './ForgotPassword/ForgotPassword';
import Login from './Login/Login';
import NotFound from '../404/404';
import React from 'react';
import Register from './Register/Register';

const Routes = () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
          <Route exact path={`${path}/login`}>
            <Login />
          </Route>
          <Route exact path={`${path}/register`}>
            <Register/>
          </Route>
          <Route exact path={`${path}/forgot-password`}>
            <ForgotPassword/>
          </Route>
          <Redirect from={`${path}`} to={`${path}/login`} exact />    
          <Route component={NotFound}/>  
        </Switch>
    )
  };
  
  export { Routes };
  