import {
  Route,
  Router,
  Switch
} from 'react-router-dom';

import Authentication from '../Pages/Authentication/Authentication';
import NotFound from '../Pages/404/404';
import Pages from '../Pages/Pages';
import React from 'react';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop' ;
import history from "./history";

const Routes = () => {
  // const history = useHistory();
  return (
    <Router history={history}>
      <ScrollToTop />
      <Switch>
        <Route path='/auth'>
          <Authentication />
        </Route>
        <Route path='/'>
          <Pages />
        </Route>
        <Route component={NotFound}/>  
      </Switch>
    </Router>
  )
};

export { Routes };
