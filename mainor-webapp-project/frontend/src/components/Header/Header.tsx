import './Header.scss'

import React, { FunctionComponent, useEffect, useState } from 'react';
import { getToken, getUser, logout } from '../../utils';

import CategoryDropDown from './CategoryDropDown/CategoryDropDown';
import { Link } from 'react-router-dom';
import  MarketDropDown  from './MarketDropDown/MarketDropDown'
import Request from '../../api/requests';
import SearchWidget from '../SearchWidget/SearchWidget';

type HeaderProps = {
  globalState?: any,
  isAuthenticated?: boolean,
  firstName?: string,
}

const Header: FunctionComponent<HeaderProps> = (params: any) => {
  const [showSearch, setShowSearch] = useState(false)
  const [cartCount, setCartCount] = params.globalState('count')
  const [user, setUser] = useState({
    isAuthenticated: false,
    firstName: ''
  })

  useEffect(() => {
    const auth = getUser()
    if (auth) {
      setUser({
        isAuthenticated: true,
        firstName: JSON.parse(auth).user.firstName
      })
    }
  }, [])

  useEffect(() => {
    if (getUser() !== "") {
      getCart() 
    }
  }, [])
  
  const getCart = () => {
    Request(
      'GET',
      '/cart/all',
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
        setCartCount(response.data.data.rows.length)
      }
    }).catch((e: any) => {
      console.error(e)
    })
  }
  
  const handleSearch = () => {
    setShowSearch(!showSearch)
  }
  return (
    <>
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
    <div className='container'>
      <Link className='navbar-brand' to='/'><img src='/img/logo-white.png' alt='logo'/></Link>
      <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav ml-auto mr-auto'>
          <li className='nav-item dropdown'>
            <div className='nav-link' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              Markets <span><img src='/img/icons/chevron-down-white.svg' alt='shop'/></span>
            </div>
            <div className='dropdown-menu' aria-labelledby='navbarDropdown'>
                <MarketDropDown props={{count: 5}}/>
            </div>
          </li>
          <li className='nav-item dropdown'>
            <div className='nav-link' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              Categories <span><img src='/img/icons/chevron-down-white.svg' alt='categories'/></span>
            </div>
            <div className='dropdown-menu' aria-labelledby='navbarDropdown'>
                <CategoryDropDown props={{count: 5}}/>
            </div>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='https://merchant.bcd.ng' target="_blank" rel="noopener noreferrer">Become a Seller</a>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/help-center'>Support</Link>
              </li>
          {/* <li className='nav-item drift-open-chat'>
            <Link className='nav-link' to='/help-center'>Contact Us</Link>
          </li> */}
        </ul>
          <ul className='navbar-nav'>
            {user.isAuthenticated ?
              (<li className='nav-item dropdown'>
                <div className='nav-link' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  <img className='menu-icon' src='/img/icons/user.svg' alt='profile'/>Hi {user.firstName} <span><img src='/img/icons/chevron-down-white.svg' alt='drop-down'/></span>
                </div>
                <div className='dropdown-menu' aria-labelledby='navbarDropdown'>
                  <Link className='dropdown-item' to='/home/my-account'><img className='menu-icon' src='/img/icons/user-black.png' alt='menu'/>My Account</Link>
                  <Link className='dropdown-item' to='/home/my-orders'><img className='menu-icon' src='/img/icons/order.png' alt='orders'/>My Orders</Link>
                  <Link className='dropdown-item' to='/home/message-center'><img className='menu-icon' src='/img/icons/message.svg' alt='message'/>Message Center</Link>
                  <Link className='dropdown-item' to='/home/saved'><img className='menu-icon' src='/img/icons/fav.png' alt='saved'/>Saved Items</Link>
                  <div className='dropdown-item logout' onClick={() => { logout() }}>Logout</div>
                </div>
              </li>
              ) :
              (<li className='nav-item'>
                <Link className='nav-link' to='/auth/login'><img className='menu-icon' src='/img/icons/user.svg' alt="user-icon" />Login</Link>
              </li>
              )
            }
            <li className='nav-item'>
                <Link className='nav-link' to='/cart'><img className='menu-icon' src='/img/icons/cart.svg' alt='cart' />
                  <span className='cart-badge'>{typeof cartCount === 'number' && cartCount}</span>
                <span>Cart</span>
                </Link>
          </li>
          <li className='nav-item'>
              <span
                  className='nav-link search-form-tigger'
                  onClick={()=>handleSearch()}>
                <img className='menu-icon' src='/img/icons/search.svg' alt='menu-icon' />
                Search
              </span>
          </li>
        </ul>
      </div>
    </div>
      </nav>
      {showSearch && <SearchWidget show={handleSearch}/>}
      </>
  );
};

Header.defaultProps = {
  isAuthenticated: false,
  firstName: '',
}


export { Header };


// TODO create local cart...