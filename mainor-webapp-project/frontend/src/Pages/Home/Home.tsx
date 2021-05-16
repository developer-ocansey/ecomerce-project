import './style.scss'

import React, { FunctionComponent, useEffect, useState } from 'react';
import { getUser, isActive, logout } from '../../utils/index';

import { ChangePassword } from '../../components/ChangePassword/ChangePassword';
import { Link } from 'react-router-dom';
import { Routes } from './Routes';

type UserProps = {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  token: string,
}

type HomeProps = {
  isAuthenticated?: boolean,
  user?: UserProps,
}

const Home: FunctionComponent<HomeProps> = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      token: '',
    },
  })

  useEffect(() => {
    const auth = getUser()
    if (auth) {
      const userAuth = JSON.parse(auth)
      setAuth({
        isAuthenticated: true,
        user: {
          firstName: userAuth.user.firstName,
          lastName: userAuth.user.lastName,
          email: userAuth.user.email,
          phone: userAuth.user.phone,
          token: userAuth.token
        } ,
      })
    } else {
        window.location.href = '/auth/login'
    }
  }, [])
  const getInitial = (name: string) => {
    return name.substring(0, 1);
}
  return (<>
      <section id='my-account-section'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-4'>
              <div className='card'>
                <div className='card-head'>
                  <div className='user-wrap'>
                  <div className='user-img'>
                    <div className="user-profile">{getInitial(auth.user.firstName)}{getInitial(auth.user.lastName)}</div>
                      {/* <img src='/img/erhun.jpg' alt='profilePicture' /> */}
                    </div>
                    <h2>{auth.user.firstName} {auth.user.lastName}</h2>
                    <p className='user-email'>{auth.user.email}</p>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='account-menu'>
                    <ul className='navbar-nav'>
                    <li className={`nav-item ${isActive('/home/my-account')}`}><Link className='nav-link' to='/home/my-account'><img className='menu-icon' src='/img/icons/user-black.png' alt='menuIcon' />My Account</Link></li>
                      <li className={`nav-item ${isActive('/home/my-orders')}`}><Link className='nav-link' to='/home/my-orders'><img className='menu-icon' src='/img/icons/order.png' alt='myOrder' />My Orders</Link></li>
                      <li className={`nav-item ${isActive('/home/saved')}`}><Link className='nav-link' to='/home/saved'><img className='menu-icon' src='/img/icons/fav.png' alt='savedItems' />Saved Items</Link></li>
                      <li className={`nav-item ${isActive('/home/message-center')}`}><Link className='nav-link' to='/home/message-center'><img className='menu-icon' src='/img/icons/message.svg' alt='messageCenter' />Message Center</Link></li>
                      <div className='line'></div>
                      <li className={`nav-item ${isActive('/home/address-book')} ${isActive('/home/new-address')}`} ><Link className='nav-link' to='/home/address-book'> My Address Book</Link></li>
                      {/* <li className={`nav-item ${isActive('/home/subscription')}`}><Link className='nav-link' to='subscription'> Subscriptions</Link></li> */}
                      <li className={`nav-item ${isActive('/home/change-password')}`}><Link className='nav-link' to='#' data-toggle='modal' data-target='#change-password'> Change Password</Link></li>
                      <li className='nav-item'><span className='nav-link' onClick={() => {logout()}}> Logout</span></li>
                    </ul>
                  </div>
                </div>
              </div>
          </div>
          <div className='col-lg-8'>
            <Routes />
          </div>
        </div>
        <ChangePassword />
      </div>
       </section>
    </>)
};

Home.defaultProps = {
  isAuthenticated: false,
  user: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    token: ''
  },
}

export { Home };
