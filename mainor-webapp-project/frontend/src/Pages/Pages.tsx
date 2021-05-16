import React, { useRef } from 'react';

import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import LoadingBar from 'react-top-loading-bar'
import { Provider } from '../components/CartContext/CartContext';
import Routes from './Routes';
import { createGlobalState } from 'react-hooks-global-state';

const { useGlobalState } = createGlobalState({ count: 0 });

const Pages = () => {
  const ref = useRef(null)
  return <Provider>
            <Header globalState={useGlobalState}/>
                <LoadingBar color='#F68B1E' ref={ref} />
                <Routes globalState={useGlobalState}/>
            <Footer/>
          </Provider>;
};

export default Pages;