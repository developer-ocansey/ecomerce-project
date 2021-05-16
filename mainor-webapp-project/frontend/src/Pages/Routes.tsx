import React, { FunctionComponent } from 'react';
import {
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';

import { About } from './About/About';
import { BulkPurchases } from './BulkPurchases/BulkPurchases';
import { Cart } from './Cart/Cart';
import { Checkout } from './Checkout/Checkout';
import { DeliveryTimeline } from './DeliveryTimeline/DeliveryPlease';
import { HelpCenter } from './HelpCenter/HelpCenter';
import { Home } from './Home/Home';
import { HowToShop } from './HowToShop/HowToShop';
import Index from './Index/Index';
import { Insurance } from './Insurance/Insurance.';
import { Logistics } from './BecomeAPartner/Logistics';
import { Merchant } from './Merchant/Merchant';
import NotFound from './404/404';
import { PrivacyPolicy } from './PrivacyPolicy/PrivacyPolicy';
import Product from './Product/Product';
import { ReturnPolicy } from './ReturnPolicy/ReturnPolicy';
import { Search } from './Search/Search';
import { Seller } from './BecomeAPartner/Selller';
import Shop from './Shop/Shop';
import { TermsOfService } from './TermsOfService/TermsOfService';
import { TradeFinancing } from './TradeFinancing/TradeFinancing';

type RoutesProps = {
    globalState?: any,
}
  
const Routes: FunctionComponent<RoutesProps>  = (params: any) => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`/`}>
                <Index />
            </Route>
            <Route exact path={`${path}category/:id`}>
                <Shop/>
            </Route>
            <Route exact path={`${path}market/:market`}>
                <Shop/>
            </Route>
            <Route exact path={`${path}merchant/store/:mid`}>
                <Merchant/>
            </Route>
            <Route exact path={`${path}search/:searchParam`}>
                <Shop/>
            </Route>
            <Route exact path={`${path}sub-category/:id/:subCategoryId`}>
                <Shop/>
            </Route>
            <Route exact path={`${path}shop`}>
                <Shop/>
            </Route>
            <Route path={`${path}home`}>
                <Home/>
            </Route>
            <Route exact path={`${path}about`}>
                <About/>
            </Route>
            <Route path={`${path}become-a-partner/logistics`}>
                <Logistics/>
            </Route>
            <Route path={`${path}become-a-partner/seller`}>
                <Seller/>
            </Route>
            <Route path={`${path}delivery-timelines`}>
                <DeliveryTimeline />
            </Route>
            <Route exact path={`${path}cart`}>
                <Cart globalState={params.globalState}/>
            </Route>
            <Route exact path={`${path}checkout`}>
                <Checkout/>
            </Route>
            <Route exact path={`${path}help-center`}>
                <HelpCenter/>
            </Route>
            <Route exact path={`${path}how-to-shop`}>
                <HowToShop/>
            </Route>
            <Route exact path={`${path}privacy-policy`}>
                <PrivacyPolicy/>
            </Route>
            <Route exact path={`${path}return-policy`}>
                <ReturnPolicy/>
            </Route>
            <Route exact path={`${path}search`}>
                <Search/>
            </Route>
            <Route exact path={`${path}terms-of-service`}>
                <TermsOfService/>
            </Route>
            <Route exact path={`${path}trade-financing`}>
                <TradeFinancing />
            </Route>
            <Route exact path={`${path}bulk-purchases`}>
                <BulkPurchases />
            </Route>
            <Route path={`${path}insurance`}>
                <Insurance/>
            </Route>
            <Route exact path={`${path}product/:id`}>
                <Product globalState={params.globalState}/>
            </Route>
            <Route component={NotFound}/>    
        </Switch>
    )
  };
  
  export default Routes;