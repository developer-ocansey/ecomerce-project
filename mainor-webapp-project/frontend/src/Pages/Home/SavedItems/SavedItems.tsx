import './style.scss'

import React, { useEffect, useState } from 'react';
import { formatCurrency, getUser, setPageTitle } from '../../../utils';

import { Link } from 'react-router-dom';
import { Loading } from '../../../components/Loading/Loading';
import Request from '../../../api/requests';
import { getToken } from '../../../utils/index';

const SavedItems = () => {
  const [loading, setLoading] = useState(false);
  const [savedItems, setSavedItems] = useState([])
  useEffect(() => {
    getsaved()
    setPageTitle('Saved Items')
  }, [])

  const getsaved = () => {
    setLoading(true)
    Request(
      'GET',
      '/wishlist/all',
      null,{ Authorization: getToken() }).then((response: any) => {
      if (response.status === 200) {
        setSavedItems(response.data.data.rows)
        setPageTitle(`${response.data.data.rows.length} items saved`)
        setLoading(false)
      }
      }).catch((e: any) => {
        setLoading(false)
      console.error(e)
    })
  }
  
  const removeItem = (id: number) => {
    Request(
      'POST',
      '/wishlist/remove',
      { 'id': id }, { Authorization: getToken() }).then((response: any) => {
      if (response.status === 200) {
        getsaved()
      }
    }).catch((e: any) => {
      console.error(e)
    })
  }

  const SavedItems = () => {
    return <>
      {savedItems.map((data: any, index: number) => {
        const merchant = data.product.merchantInfo.businessName
        const product = data.product.name
        return (
          <tr key={index}>
            <td className="index-table">
              <img src={`${data.product.productImage[0] ? data.product.productImage[0].imageURL : '/img/no-image.png'}`} alt='cables'/>
              <div className='tbl-prdt-d'>
                <p className='tbl-prdt-price'>{product.length > 30 ?product.substring(0, 30)+'...':product}</p>
                <p className='tbl-order-id'>{merchant.length > 30 ?merchant.substring(0, 30)+'...':merchant}</p>
              </div>
            </td>
            <td>{formatCurrency(data.product.price)}</td>
            <td className='t-store-action'><Link to={`/product/${data.product.id}`}>View in store</Link></td>
            <td className='table-action'><span className="action-btn" onClick={()=>removeItem(data.id)} >Remove Item</span></td>
        </tr>
        )
      })}
    </>
  }
    return (
          <div className='card'>
            <div className='card-head'>
              <h2>Saved Items ({savedItems.length})</h2>
            </div>
            <div className='card-body'>
          {loading ? <Loading /> : 
          <>
          {savedItems.length < 1 ? 
          <div className='empty-chat'><p>You not saved products to your wishlist.</p></div>:
          <table className='table card-table2'>
            <tbody>
              <SavedItems />
            </tbody>
          </table>}
          </>
          }
            </div>
            </div>
    )
}
export { SavedItems } 