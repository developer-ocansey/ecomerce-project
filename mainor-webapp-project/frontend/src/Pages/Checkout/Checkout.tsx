import './style.scss'

import { Link, useHistory } from 'react-router-dom';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { UUID, formatCurrency, getToken, getUser, replaceJSX, setPageTitle } from '../../utils/index';

import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import Loader from 'react-loader-spinner';
import Moment from 'moment';
import Request from '../../api/requests';
import config from '../../config/index.json'
import { toast } from 'react-toastify';
import useRave from './useFlutterwave';

const D2D = 'door2door';
const PICKUP = 'pickup';

// Declare a type.
interface globalWindow extends NodeJS.Global {
  FlutterwaveCheckout:any; // define types
}

declare const global: globalWindow;

const Checkout= () => {
  const history = useHistory();
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [delivery, setDelivery] = useState({ data: [] })
  const [insurance, setInsurance] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [selectedDelivery, setSelectedDelivery] = useState({
    id: '',
    name: '',
    logo: '',
    price: 0
  })
  const [deliveryType, setDeliveryType] = useState('')
  const [pickup, setPickup] = useState({
    name: '',
    contactName: '',
    fullAddress: '',
    contactNumber: '',
    deliveryTime: 0,
    pickupTime: 0
  })
  useRave()
  const uuid = UUID()
  const [addressBook, setAddressBook] = useState([{
    firstName: '',
    lastName: '',
    phoneNumber: '',
    state: '',
    city: '',
    address: '',
    default: false,
    loading:false
  }])
  const [choosenAddress, setChosenAddress] = useState(0)
  const [tonnage, setTonnage] = useState(0)
  const [deliveryPrice, setDeliveryPrice] = useState(0)
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState({
    count: 0,
    rows: [{
      quantity: 0,
      product: {
        id:0,
        name: '',
        price: 0,
        unit: '',
        merchantInfo: {
          id: 0,
          businessName:''
        },
        productImage: [
          {
            imageURL:''
          }
        ]
      },
      insure: false,
      negotiatedPrice: 0
    }],
  })

  const getAddresses = () => {
    setPaymentLoading(true)
    Request(
      'GET',
      '/address-book',
      null,{ Authorization: getToken() }).then((response: any) => {
      if (response.status === 200) {
        setAddressBook(response.data)
        setPaymentLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setPaymentLoading(false)
    })
  }

  const getDeliveryFee = () => {
    setPaymentLoading(true)
    Request(
      'GET',
      '/config/delivery',
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setDelivery(JSON.parse(response.data.config.value))
          setPaymentLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setPaymentLoading(false)
    })
  }

  const getInsurance = () => {
    setPaymentLoading(true)
    Request(
      'GET',
      '/config/insurance',
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setInsurance(parseFloat(response.data.config.value))
          setPaymentLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setPaymentLoading(false)
    })
  }

  const getCart = () => {
    setPaymentLoading(true)
    Request(
      'GET',
      '/cart/all',
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setCartItems(response.data.data)
          setPaymentLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setPaymentLoading(false)
    })
  }

  const getPickup = () => {
    setPaymentLoading(true)
    Request(
      'GET',
      '/pickup-details',
      null,{ Authorization: getToken() }).then((response: any) => {
      if (response.status === 200) {
        setPickup(response.data.data)
        setPaymentLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setPaymentLoading(false)
    })
  }

  useEffect(() => {
    getAddresses()
    getCart()
    getPickup()
    getDeliveryFee()
    getInsurance()
    setPageTitle('Checkout')
  }, [])

  useEffect(() => {
    setSubTotal(cartTotal)
  }, [cartTotal])
    

  const CartItems = () => {
    return <>
      {cartItems.rows.map((data, index) => {
        return (
          <tr key={index}>
          <td>
            <img src={data.product.productImage[0].imageURL} alt='...'/>
            <div className='tbl-prdt-d'>
              <p className='tbl-prdt-name'>{data.product.name}</p>
                <p className='tbl-seller'>{data.quantity} {data.product.unit}</p>
            </div>
            </td>
            <td>{formatCurrency((data.negotiatedPrice || data.product.price) * data.quantity)}</td>
        </tr>
        )
      })}
    </>
  }

  useEffect(() => {
    const total = cartItems.rows.reduce((totalCart, data) => totalCart + (data.negotiatedPrice || data.product.price )* data.quantity, 0)
    const insuranceTotal = cartItems.rows.filter((data:any)=>data.insure === true).reduce((total, data) => total + (data.quantity * data.product.price * insurance), 0)

    setCartTotal(total+insuranceTotal)
    setSubTotal(total+insuranceTotal)
  }, [cartItems, insurance])

  const Insurance = () => {
    const insuredProducts = cartItems.rows.filter((data:any)=>data.insure === true)
        return (
          <tr>
          <td>
            <img src='img/insurance.png' alt='...'/>
            <div className='tbl-prdt-d'>
              <p className='tbl-prdt-name'>Insurance</p>
                <p className='tbl-seller'>{insuredProducts.length} product{insuredProducts.length > 1 && 's' }</p>
            </div>
            </td>
            <td>{formatCurrency(insuredProducts.reduce((total, data) => total + (data.quantity * data.product.price * insurance), 0))}</td>
        </tr>)
  }

// use environment variables for flutterwave.    
  const makePayment = () => {
    if (deliveryType === '') {
      toast.error('Please select one delivery mode')
      return
    }
    if (deliveryType === D2D && selectedDelivery.id === '') {
      toast.error('You have chosen door to door delivery mode. Please select your preferred delivery partner')
      return
    }
      const userAuth = JSON.parse(getUser())
      global.FlutterwaveCheckout({
        public_key: config.raveKey,
        tx_ref: uuid,
        amount: subTotal+(deliveryType === D2D? deliveryPrice:0),
        currency: "NGN",
        country: "NG",
        payment_options: "card, mobilemoneyghana, ussd",
        customer: {
          email: `${userAuth.user.email}`,
          phone_number: addressBook[choosenAddress] ? addressBook[choosenAddress].phoneNumber : userAuth.user.phoneNumber,
          name: `${addressBook[choosenAddress] ? addressBook[choosenAddress].firstName : userAuth.user.firstName } ${addressBook[choosenAddress] ? addressBook[choosenAddress].lastName : userAuth.user.lastName}`,
        },
        callback: function (data: any) {
          if (data.status === "successful") {
            createOrder()
          }
        },
        onclose: function() {
         alert('You cancelled this operation')
        },
        customizations: {
          title: "bcd.ng",
          description: "Payments for products",
          logo: "https://bcd-ng.s3-eu-west-1.amazonaws.com/pay.png",
        },
      });
    }
  
  const createOrder = async () => {
    const orders = cartItems.rows.map((data: any, i: number) => {
      setPaymentLoading(true)
      return Request(
        'POST',
        'orders/create', {
        'cartId': data.id,
        'orderId': uuid,
        'productId': data.productId,
        'merchantId': data.product.merchantInfo.id,
        'agreedPrice': data.negotiatedPrice || data.product.price,
        'quantity': data.quantity,
        'deliveryInformation': JSON.stringify(addressBook[choosenAddress]),
        'deliveryPartnerId': 1,
        'insured': data.insure,
        'deliveryPrice': deliveryPrice,
        'paymentStatus': 'paid',
        'paymentMethod': 'online-payment',
        'orderType': 'normal',
        'orderStatusId': 1,
        'meta': JSON.stringify({
          insurance: data.insure ? data.product.price * insurance : 0,
          logistics: selectedDelivery,
          orderTotal: subTotal + (deliveryType === D2D ? deliveryPrice : 0),
          deliveryType: deliveryType
        })
      },{ Authorization: getToken() }).then((response: any) => {
        console.log(response)
      }).catch((e => {
        setPaymentLoading(false)
          console.error(e)
      }))
    })
    Promise.all(orders).then(() => {
      setPaymentLoading(false)
      toast.success('Your order has been received')
      window.location.href = '/home/order-details/'+uuid
    })
  }

  const getDeliveryPrice = (partner: string, weight: number) => {
    setDeliveryPrice(0)
    setPaymentLoading(true)
    Request(
      'GET',
      `/logistics/${partner}/${weight}/${addressBook[choosenAddress].state}`,
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
        setTonnage(weight)
        setDeliveryPrice(response.data.data[0].price)
        setPaymentLoading(false)
        } else {
          toast.warning('Prices not available at the moment') 
      }
    }).catch((e: any) => {
      console.error(e)
      toast.warning('Prices not available at the moment')
      setPaymentLoading(false)
    })
  }

  const changeDeliveryType = (type: string) => {
    setDeliveryType(type)
    if (type === D2D) {
      setSubTotal(cartTotal)
      return
    }
    setSubTotal(cartTotal)
    setSelectedDelivery({
      id: '',
      name: '',
      logo: '',
      price: 0
    })
  }

  const Delivery =() => {
    return <>
      {delivery.data.map((data: any, index: number) => {
      return (
        <div key={index} className={data.id === selectedDelivery.id ? 'delivery-active' : 'delivery'} onClick={() => { changeDeliveryType(D2D); setSelectedDelivery(data) }}>
          <img src={data.logo} alt='...' />
          <h6>₦ {data.range}</h6>
          {data.id === selectedDelivery.id && <div>
            <p>Truck tonnage</p>
            <div className='tonnage-container'>
              {data.meta.map((d: any, i: number) => {
                return <div key={i} className={`tonnage ${tonnage === d.weight ? 'tonnage-active' : ''}`} onClick={() => { getDeliveryPrice(data.id, d.weight) }}>{d.weight}</div>
              })}
            </div>
          </div>}
        </div>
      )
    })}
      </>
  }
  return <>
      <Breadcrumbs crumbs={[{'name': 'Home', 'link': '/'},{'name': 'Checkout', 'link': '/checkout'}]}/>
      <section id='single-product'>
        <div className='container'>
          
          <div className='row'>
            <div className='col-lg-8'>
              <div className='shop-card'>
                <div className='card-head cd-head'>
                <h2>Checkout</h2>
                {paymentLoading && <Loader type="Oval" color="#0070E0" height={30} width={30} radius={1}/>}
                </div>
                {addressBook[choosenAddress] ? <div className='checkout-info-block'> 
                    <h3>Address Details <span className='change-address btn-text' data-toggle='modal' data-target='#change-address'>Change address</span></h3>
                    <h4>{addressBook[choosenAddress].firstName} {addressBook[choosenAddress].lastName}</h4>
                <p>{addressBook[choosenAddress].address} {addressBook[choosenAddress].state} {addressBook[choosenAddress].city} Nigeria</p>
                  <p>{addressBook[choosenAddress].phoneNumber}</p>
                </div>: <div className='checkout-info-block'> <span>You have not added any delivery address.</span> <span className='change-address btn-text'  onClick={()=>{history.push('/home/new-address')}}>Add</span> </div>}
                <div className='checkout-info-block'>
                  <h3>Delivery Options</h3>
                  <h6 className='del-info'><img src='/img/icons/information.svg' alt='...'/>Please note that items from different markets are shipped separately</h6>
                  <form>
                  {addressBook[choosenAddress] && <div className='form-check'>
                    <input className='form-check-input' type='radio' name='exampleRadios' id='exampleRadios10' value='delivery' onChange={() => { changeDeliveryType(D2D) }} checked={deliveryType === D2D} />
                    <label className='form-check-label'>
                      <h2>Door Delivery</h2>
                      <p>Your Items will be delivered between <span>{Moment().add(3, 'days').format('LL')} and {Moment().add(5, 'days').format('LL')}</span></p>
                      <div className='line'></div>
                      <div className='logi-partners'>
                        <h5>Recommended Logistics Partners</h5>
                        <p>Please select your preferred logistics partner. Shipping fee is <span>NON-REFUNDABLE</span> in case or return</p>
                          <Delivery/>
                      </div>
                    </label>
                  </div>}
                    <div className='form-check'>
                    <input className='form-check-input' type='radio' name='exampleRadios' id='exampleRadios11' value='pickup' onChange={() => { changeDeliveryType(PICKUP)}}  checked={deliveryType === PICKUP}/>
                      <label className='form-check-label'>
                        <h2>Pickup Station</h2>
                        <p>Your items will be ready for Pickup on <span>{Moment().add(pickup.pickupTime, 'days').format('LL')}</span></p>
                        <div className='line'></div>
                        <div className='pickup-dtls'>
                          <h5>Pickup Address</h5>
                          <h6>{pickup.name}</h6>
                          <p>{pickup.contactName}</p>
                          <p>{replaceJSX(pickup.fullAddress, 'contact us', <a href="mailto:info@bcd.ng?Subject=Pickup address for my order" target="_blank" rel="noopener noreferrer">contact us</a>)}</p>
                        <p>{pickup.contactNumber}</p>
                        </div>
                      </label>
                    </div>
                  <button
                    type='button'
                    className='btn btn-warning checkout-btn'
                    onClick={()=>{makePayment()}}
                  >Pay now</button>
                  </form>
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <div className='shop-card'>
                <div className='card-head'>
                  <div className='row'>
                    <div className='col'>
                      <h2>Your Order</h2>
                    </div>
                    <div className='col'>
                      <p><Link to='/cart'>Modify Order</Link></p>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='order-sumary'>
                    <table className='table table-borderless'>
                      <tbody>
                        <CartItems/>
                      <Insurance />
                      </tbody>
                    </table>
                    <div className='line'></div>
                    <h2>Subtotal <span>{formatCurrency(subTotal)}</span></h2>
                  {deliveryType === D2D && <h2>Shipping <span>{formatCurrency(deliveryPrice)} x 1 </span></h2>}
                    <div className='line'></div>
                  <h3>Total <span>{formatCurrency(subTotal+(deliveryType === D2D? deliveryPrice:0))}</span></h3>
                  <button
                    className='btn btn-warning checkout-btn'
                    onClick={()=>{makePayment()}}>Pay now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='modal fade address-modal' id='change-address' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>Address Book</h5>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'><img width='15' src='/img/icons/close.svg' alt='...'/></span>
              </button>
            </div>
            <div className='modal-body'>
              <div className='mbody-title'>
                <h3>Choose Preferred Delivery Address <span><span className='new-address' data-dismiss='modal' onClick={()=>{history.push('/home/new-address')}}>New Address</span></span></h3>
              </div>
            <form>
              {addressBook.map((data, index) => {
                return (
                  <div className='form-check' key={index}>
                    <input className='form-check-input'  checked={index ===choosenAddress} type='radio' id={`${index}`} value={`${index}`}
                      onChange={() => {
                     setChosenAddress(index)
                    }} />
                    <label className='form-check-label'>
                      <h2>{data.firstName} {data.lastName}</h2>
                      <p>{data.address}, {data.state} {data.city}, Lagos</p>
                      <p>{data.phoneNumber}</p>
                      {data.default && <p className='def-add'>Default Address</p>}
                    </label>
                  </div>
                )
              })}
              </form>
            </div>
          </div>
        </div>
    </div>
  </>;
};

export { Checkout };


// Handle empty state.