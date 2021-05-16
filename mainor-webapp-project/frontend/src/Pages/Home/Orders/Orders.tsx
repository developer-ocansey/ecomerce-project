import './style.scss'

import React, { useEffect, useState } from 'react';
import { getToken, setPageTitle } from '../../../utils';

import { Link } from 'react-router-dom';
import { Loading } from '../../../components/Loading/Loading';
import Moment from 'moment'
import Request from '../../../api/requests';
import { formatCurrency } from '../../../utils/index';

const Orders = () => {
  const [loading, setLoading] = useState(false)
  const [ordersList, setOrdersList] = useState([])
  useEffect(() => {
    getOrders()
    setPageTitle('My Orders')
  }, [])
  
  const getOrders = () => {
    setLoading(true)
    Request(
      'GET',
      '/customer/orders',
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setOrdersList(response.data.data.rows)
          setLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setLoading(false)
    })
  }

  const OrdersList = () => {
    return <>
       {ordersList.map((data: any, index: number) => {
         return (
           <tr key={index}>
            <td>
              <div className='tbl-prdt-d'>
                <p className='tbl-order-id'><Link className= 'tbl-order-name' to={`order-details/${data.orderId}`}>{data.orderId}</Link></p>
              </div>
            </td>
            <td>{data.orderStatus.status}</td>
            <td>{formatCurrency(JSON.parse(data.meta).orderTotal)}</td>
            <td>{Moment(data.createdAt).format('ll')}</td>
          </tr>
        )
      })}
    </>
  }
  return (
          <div className='card'>
            <div className='card-head'>
              <h2>All Orders({ordersList.length})</h2>
            </div>
      <div className='card-body'>
        {loading ? <Loading />
          : <>
          {ordersList.length < 1 ? 
          <div className='empty-chat'><p>You don't have any orders yet.</p></div>:
            <table className='table'>
              <thead>
                <tr>
                  <th scope='col'>Order</th>
                  <th scope='col'>Status</th>
                  <th scope='col'>Price</th>
                  <th scope='col'>Date</th>
                </tr>
              </thead>
              <tbody>
                <OrdersList />
              </tbody>
            </table>
          }
          </>}
            </div>
          </div>
  );
};

export { Orders };
