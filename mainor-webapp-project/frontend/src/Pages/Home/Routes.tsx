import {
    Redirect,
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import { Account } from './Account/Account';
import { AddressBook } from './AddressBook/AddressBook';
import { AddressBookNew } from './AddressBookNew/AddressBookNew';
import { ChangePassword } from '../../components/ChangePassword/ChangePassword';
import MessageCenter from './MessageCenter/MessageCenter';
import NotFound from '../404/404';
import OrderDetails from './OrderDetails/OrderDetails';
import { Orders } from './Orders/Orders';
import React from 'react';
import { SavedItems } from './SavedItems/SavedItems';

const Routes = () => {
  let { path } = useRouteMatch();
  return (
      <Switch>
        <Route exact path={`${path}/my-account`}>
          <Account />
        </Route>
        <Route exact path={`${path}/address-book`}>
          <AddressBook/>
        </Route>
        <Route exact path={`${path}/new-address`}>
          <AddressBookNew/>
        </Route>
        <Route exact path={`${path}/change-password`}>
          <ChangePassword/>
        </Route>
        <Route exact path={`${path}/message-center`}>
          <MessageCenter/>
        </Route>
        <Route exact path={`${path}/message-center/:messageId`}>
          <MessageCenter/>
        </Route>
        <Route exact path={`${path}/my-orders`}>
          <Orders/>
        </Route>
        {/* During implementation add id to route... */}
        <Route exact path={`${path}/order-details/:orderId`}>  
          <OrderDetails/>
        </Route>
        <Route exact path={`${path}/saved`}>
          <SavedItems/>
        </Route>
        <Redirect from={`${path}`} to={`${path}/my-account`} exact />  
        <Route component={NotFound}/>  
      </Switch>
    )
  };
  
export { Routes };