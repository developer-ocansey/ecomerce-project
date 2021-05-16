import './style.scss'

import React, { FunctionComponent, useEffect, useState } from 'react';
import { formatCurrency, getToken, setPageTitle } from '../../utils/index';

import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import CartLoading from '../../components/CartLoading/CartLoading';
import { Link } from 'react-router-dom';
import RecentProduct from '../../components/RecentProduct/RecentProduct';
import Request from '../../api/requests';
import { getUser } from '../../utils';

type cart = {
  count: number,
  rows: any,
}

type CartProps = {
  globalState?: any,
}

const Cart:FunctionComponent<CartProps> = (params) => {
  const [cartCount, setCartCount] = params.globalState('count')
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [insurance, setInsurance] = useState(0)
  const [cartItems, setCartItems] = useState({
    rows: [{
      id: 0,
      quantity: 0,
      product: {
        name: '',
        price: 0,
        merchantInfo: {
          businessName: ''
        },
        mo: 0,
        productImage: [
          {
            imageURL: ''
          }
        ]
      },
      insure: false,
      negotiatedPrice: 0,
    }],
  })
  useEffect(() => {
    if(getUser()){
      getCart()
      getInsurance()
    }
  }, [])

  const getCart = (loading: boolean = true) => {
    setLoading(loading)
    Request(
      'GET',
      '/cart/all',
      null,{ Authorization: getToken() }).then((response: any) => { // handle error
      if (response.status === 200) {
        setCartItems(response.data.data)
        setPageTitle(`${response.data.data.rows.length} items in cart`)
        setLoading(false)
      }
      }).catch((e: any) => {
        setLoading(false)
      console.error(e)
    })
  }
  
  const getInsurance = () => {
    Request(
      'GET',
      '/config/insurance',
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setInsurance(parseFloat(response.data.config.value))
      }
    }).catch((e: any) => {
      console.error(e)
    })
  }

  const removeItem = (id: number) => {
    Request(
      'POST',
      '/cart/remove',
      { 'id': id }, { Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setCartCount(cartCount - 1)
        getCart(false)
      }
    }).catch((e: any) => {
      console.error(e)
    })
  }

  const updateQuantity = (id: number, qty: number) => {
    Request(
      'POST',
      '/cart/update/'+id,
      { 'quantity': qty }, { Authorization: getToken() }).then((response: any) => {
      if (response.status === 200) {
        getCart(false)
      }
    }).catch((e: any) => {
      console.error(e)
    })
  }

  const updateInsurance = (id: number, insure: boolean) => {
    Request(
      'POST',
      '/cart/update/'+id,
      { 'insure': insure }, { Authorization: getToken() }).then((response: any) => {
      if (response.status === 200) {
        getCart(false)
      }
    }).catch((e: any) => {
      console.error(e)
    })
  }

  const CartItems = () => {
    let total:number = 0
    return <>
      {cartItems.rows.map((data, index) => {
        total = total + (data.negotiatedPrice || data.product.price) * data.quantity
        return (
          <tr key={index}>
            <td>
              <img src={data.product.productImage[0].imageURL} alt='...'/>
              <div className='tbl-prdt-d'>
                <p className='tbl-prdt-name'>{data.product.name}</p>
                <p className='tbl-seller'>Seller: {data.product.merchantInfo.businessName}</p>
              </div>
            </td>
            <td>
              <div className='product-quantity'>
              <div className='input-group'>
                <div className='button minus'>
                  <button type='button' className='btn btn-primary btn-number' onClick={()=>{updateQuantity(data.id, data.quantity <= data.product.mo ? data.product.mo : data.quantity - 1)}}>
                    <i className='ti-minus'></i>
                  </button>
                </div>
                <input type='text' className='input-number' data-min={data.product.mo} data-max='1000' value={data.quantity} onChange={(e) => { updateQuantity(data.id, Number(e.target.value)) }} />
                <div className='button plus'>
                  <button type='button' className='btn btn-primary btn-number' onClick={()=>{updateQuantity(data.id, data.quantity + 1)}}>
                    <i className='ti-plus'></i>
                  </button>
                </div>
              </div>
              </div>
            </td>
            <td className=''>{formatCurrency(data.negotiatedPrice || data.product.price)}</td>
            <td className=''>{formatCurrency(data.product.price * data.quantity * insurance)} | <span onClick={()=>{updateInsurance(data.id, !data.insure)} }className={data.insure ? 'insure-action-rm' : 'insure-action'}>{data.insure?'Remove':'Buy Insurance'}</span></td>
            <td className=''>{formatCurrency(data.product.price * data.quantity)}</td>
            <td><span className='btn-text' onClick={(e)=>{removeItem(data.id)}}>Remove item</span></td>
        </tr>
        )
      })}
      { setCartTotal(total)}
    </>
  }

  return <>
  <Breadcrumbs crumbs={[{'name': 'home', 'link': '/'},{'name': 'Cart', 'link': '/cart'}]}/>
  <section id='cart-summary'>
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <div className='cart-info'>
            <h4>Cart Total:</h4>
              <h2>{formatCurrency(cartTotal)}</h2>
          </div>
          <p><img src='/img/icons/information.svg' alt='information'/>Shipping fee will be calculated on the checkout page.</p>
        </div>
        <div className='col flex-end'>
          <Link to='/'><button className='btn btn-light continue-btn'>Continue Shopping</button></Link>
          <Link to={cartTotal>0?'/checkout':'/cart'}><button className='btn btn-warning checkout-btn' disabled={cartTotal > 0?false:true}>Proceed to Checkout</button></Link>
        </div>
      </div>
    </div>
  </section>


  <section id='single-product'>
    <div className='container'>
      
      <div className='row'>
        <div className='col-lg-12'>
          <div className='shop-card'>
            <div className='card-head'>
              <h2>Cart ({cartTotal > 0 ? cartItems.rows.length: 0} Items)</h2>
            </div>
            <div className='table-responsive'>
                {loading ? <CartLoading /> :
                  <table className='table cart-table'>
                  <thead>
                    <tr>
                      <th scope='col'>Item</th>
                      <th scope='col'>Quantity</th>
                      <th scope='col'>Unit Price</th>
                      <th scope='col'>Insurance</th>
                      <th scope='col'>Subtotal</th>
                      <th scope='col'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                   {(getUser() && cartItems.rows.length !== 0) && <CartItems /> }
                  </tbody>
                  </table>}
                  {cartTotal < 1 && <p className='empty-cart'>Your cart is empty</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
    <RecentProduct />
</>;
};

export { Cart };
