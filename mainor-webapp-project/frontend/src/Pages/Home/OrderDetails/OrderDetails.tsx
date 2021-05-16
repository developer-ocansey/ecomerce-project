import './style.scss'

import React, { useEffect, useState } from 'react';
import {RouteComponentProps, useHistory, withRouter} from 'react-router-dom';
import { formatCurrency, getToken, setPageTitle } from '../../../utils';

import { Loading } from '../../../components/Loading/Loading';
import Request from '../../../api/requests';

interface Identifiable { orderId: string; }

const OrderDetails_ = ({ match }: RouteComponentProps<Identifiable>) => {
  const [loading, setLoading] = useState(false)
  const orderId = match.params.orderId
  const history = useHistory()
  const [ordersList, setOrdersList]:any = useState([])
  useEffect(() => {
    getOrders()
    setPageTitle('Order Details | '+orderId)
  }, [])
  
  const getOrders = () => {
    setLoading(true)
    Request(
      'GET',
      '/orders/view-details/'+orderId,
      null, { Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setOrdersList(response.data.order)
          setLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setLoading(false)
    })
  }

  const ProductList = () => {
    return <>
       {ordersList.map((data: any, index: number) => {
        return (
          <tr key={index}>
            <td>
              <img src={data.product.productImage[0].imageURL}alt='wc2' />
              <div className='tbl-prdt-d'>
                <p className='tbl-prdt-price'>{data.product.name}</p>
                <p className='tbl-order-id'>{data.product.merchantInfo.businessName}</p>
              </div>
            </td>
            <td>{formatCurrency(data.agreedPrice)}</td>
            <td>{data.quantity}</td>
            <td>{formatCurrency(data.quantity * data.agreedPrice)}</td>
        </tr>
        )
      })}
    </>
  }
  
  return (
    <div className='card'>
      <div className='card-head'>
        <div className='row'>
          <div className='col'>
            <h2>Order details</h2>
          </div>
          <div className='col'>
              <p className='back-text' onClick={() => history.goBack()}><img src='/img/back.svg' alt='back' />Go back to My Orders</p>
          </div>
        </div>
      </div>
      <div className='card-body card-body-full'>
        {ordersList[0] &&
          <div className='order-details'>
          {console.log(ordersList[0])}
            <p>Order ID: {ordersList[0].orderId}</p>
            <p>Total: {formatCurrency(JSON.parse(ordersList[0].meta).orderTotal)}</p>
            <p>Delivery Type: {JSON.parse(ordersList[0].meta).deliveryType === 'door2door'?'Deliver to address':'Warehouse pickup'}</p>
            <p>Carrier: {JSON.parse(ordersList[0].meta).logistics.name} </p>
            <p>Delivery Fee: {JSON.parse(ordersList[0].meta).deliveryType === 'door2door'?formatCurrency(ordersList[0].deliveryPrice):0}</p>
            <p>Delivery Address: {JSON.parse(ordersList[0].deliveryInformation).address} {JSON.parse(ordersList[0].deliveryInformation).city} {JSON.parse(ordersList[0].deliveryInformation).state}</p>
            <p>Receiver: {JSON.parse(ordersList[0].deliveryInformation).firstName} {JSON.parse(ordersList[0].deliveryInformation).lastName}, {JSON.parse(ordersList[0].deliveryInformation).phoneNumber}</p>
          </div>}
        {/* TODO Later indicate products which are insured and show price summary */}
        {loading ? <Loading /> :
          <>
            <table className='table'>
              <thead>
                <tr>
                  <th scope='col'>Item</th>
                  <th scope='col'>Unit Price</th>
                  <th scope='col'>Quantity</th>
                  <th scope='col'>Total</th>
                </tr>
              </thead>
              <tbody>
                <ProductList />
              </tbody>
            </table>
        </>}
      </div>
    </div>
  );
};

const OrderDetails = withRouter(OrderDetails_ as any)
export default OrderDetails
