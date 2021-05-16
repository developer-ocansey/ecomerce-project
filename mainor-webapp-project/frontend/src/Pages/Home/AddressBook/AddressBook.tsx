import React, { useEffect, useState } from 'react';
import { getUser, setPageTitle } from '../../../utils';

import { Link } from 'react-router-dom'
import { Loading } from '../../../components/Loading/Loading';
import Request from '../../../api/requests';
import { getToken } from '../../../utils/index';

const AddressBook = () => {
  const [addressBook, setAddressBook] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setPageTitle('Delivery address book')
    
    setLoading(true)
    Request(
      'GET',
      '/address-book',
      null,{ Authorization: getToken() }).then((response: any) => {
      if (response.status === 200) {
        setAddressBook(response.data)
        setLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setLoading(false)
    })
  }, [])
  
  const Addresses = () => {
    return <>
      {addressBook.map((data:any, index) => {
        return (
          <tr key={index} >
          <td>
            <p>{data.firstName} {data.lastName}</p>
            {data.address}, {data.region} {data.city}, Lagos
          </td>
            <td>{data.phoneNumber}</td>
          <td className='table-action'>
            <p> Remove Item </p>
            <p>Set as default</p>
          </td>
        </tr>
        )
      })}
    </>
  }
    return (
        <div className='card'>
          <div className='card-head'>
            <h2>Addresses <span><Link to='new-address'>Add New Address</Link></span></h2>
          </div>
          <div className='card-body'>
          {loading ? <Loading /> : 
          <>
           {addressBook.length < 1 ? 
            <div className='empty-chat'><p>Your address book is empty.</p></div>:
            <table className='table card-table2'>
            <tbody>
              <Addresses />
            </tbody>
          </table>}
          </>}
          </div>
        </div>
    )
}
export { AddressBook } 