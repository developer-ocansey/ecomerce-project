import './BcdNg.scss';
import './BcdNg.scss';
import 'react-toastify/dist/ReactToastify.css';

import {
  ModalProvider
} from 'react-simple-hook-modal';
import React from 'react';
import { Routes } from './routes/index';
import { ToastContainer } from 'react-toastify'

function BcdNg() {
  return (
    <ModalProvider>
      <Routes />
      <ToastContainer />
    </ModalProvider>
  );
}

export default BcdNg

// TODO bad practice remove everything relating to bootstraps and jquery as trying to manipulate DOM outside react is bad practice...
// on api level application is less secured also add email to password verification / confirmation
// encode user details in local storage and decode when using it.