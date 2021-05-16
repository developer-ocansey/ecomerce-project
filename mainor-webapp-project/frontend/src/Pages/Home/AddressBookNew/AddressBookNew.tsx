import React, { useEffect, useState } from 'react';
import Request, { RequestPublic } from '../../../api/requests';

import BtnLoader from '../../../components/BtnLoader/BtnLoader';
import { getToken } from '../../../utils/index';
import { setPageTitle } from '../../../utils';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const AddressBookNew = () => {
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [state_, setState_] = useState([])
    const [addressBook, setAddressBook] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        region:'no-region',
        state: '',
        city: '',
        address: '',
        default: false,
    })

    const createNewAddressBook = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        await Request(
          'POST',
            'create-address-book',
            addressBook,
            { Authorization: getToken() }).then((response: any) => {
          if (response.status === 201) {
            setLoading(false)
            toast.success('New address created')
            history.goBack()
          } else {
            setLoading(false)
            toast.error('Could not add new address to address book'+ response.message)
          }
        }).catch((e) => {
            setLoading(false)
            console.error(e)
            toast.error('Could not add new address to address book')
        })
    }

    const getState = () => {
        setLoading(true)
        RequestPublic(
          'GET',
          'https://bcd-ng.s3-eu-west-1.amazonaws.com/stateCities.json',
          null).then((response: any) => {
            if (response.status === 200) {
              setState_(response.data)
              setLoading(false)
          }
        }).catch((e: any) => {
          console.error(e)
          setLoading(false)
        })
        
    }

    useEffect(() => {
        getState()
        setPageTitle('New Delivery Address')
    }, [])
    
    return (
            <div className='card'>
                <div className='card-head'>
                    <div className='row'>
                        <div className='col'>
                        <h2>Add a New Address</h2>
                        </div>
                        <div className='col'>
                            <p className='back-text' onClick={() => history.goBack()} ><img src='/img/back.svg' alt='back' />Go back to Address Book</p>
                        </div>
                    </div>
                </div>
                <div className='card-body card-body-full'>
                    <form>
                        <div className='row'>
                            <div className='col'>
                            <div className='form-group'>
                                <label>First name</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='First name'
                                    onChange={(e) => {
                                        setAddressBook({
                                            ...addressBook,
                                            firstName: e.target.value
                                    })
                                    }}  
                                />
                            </div>
                            </div>
                            <div className='col'>
                            <div className='form-group'>
                                <label>Last name</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Last name'
                                    onChange={(e) => {
                                        setAddressBook({
                                            ...addressBook,
                                            lastName: e.target.value
                                        })
                                    }}
                                    />
                            </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                            <div className='form-group'>
                                <label>Phone number</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Phone number'
                                    onChange={(e) => {
                                        setAddressBook({
                                            ...addressBook,
                                            phoneNumber: e.target.value
                                        })
                                    }}
                                />
                            </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                            <div className='form-group'>
                                <label>Select State</label>
                                <select
                                    className='form-control'
                                    onChange={(e) => {
                                        setAddressBook({
                                            ...addressBook,
                                            state: e.target.value
                                        })
                                    }}
                                >
                                    {state_.map((data:any, index) => {
                                        return <option key={index} value={data.state}>{data.state}</option>
                                    })}
                                </select>
                            </div>
                            </div>
                            <div className='col'>
                            <div className='form-group'>
                                <label>City</label>
                                <select
                                    className='form-control'
                                    onChange={(e) => {
                                        setAddressBook({
                                            ...addressBook,
                                            city: e.target.value
                                        })
                                    }}
                                >
                                    {state_.filter((st: any) => st.state === addressBook.state).map((data: any, index: number) => {
                                       return data.lgas.map((lag: string, i: number) => {
                                            return <option  key={i} value={lag}>{lag}</option>
                                        })
                                    })}
                                </select>
                            </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                            <div className='form-group'>
                                <label>Address</label>
                                <textarea
                                    className='form-control'
                                    id='exampleFormControlTextarea1'
                                    rows={3}
                                    placeholder='Enter address'
                                    onChange={(e) => {
                                        setAddressBook({
                                            ...addressBook,
                                            address: e.target.value
                                        })
                                    }}
                                ></textarea>
                            </div>
                            </div>  
                        </div>
                        <div className='row'>
                            <div className='col'>
                            <div className='form-group form-check'>
                                    <input
                                        type='checkbox'
                                        className='form-check-input checkbox'
                                        id='exampleCheck1'
                                        onChange={(e) => {
                                            setAddressBook({
                                                ...addressBook,
                                                default: (e.target.value === '1') ? true : false
                                            }) 
                                        }}/>
                                <label className='form-check-label'>Set as Default Address</label>
                            </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                            <div className='form-group'>
                                <button
                                    type='submit'
                                    className='btn btn-primary auth-btn'
                                    onClick={(e) => !loading && createNewAddressBook(e)}>{loading?<BtnLoader/>:'Save'}</button>
                            </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>)
}
export { AddressBookNew } 