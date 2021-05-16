import React, { useEffect, useState } from 'react';
import { getToken, getUser, setPageTitle } from '../../../utils';

import BtnLoader from '../../../components/BtnLoader/BtnLoader';
import Request from '../../../api/requests';
import { toast } from 'react-toastify';

const Account = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    loading: false,
    changed: true,
  })
  
  useEffect(() => {
    const auth = JSON.parse(getUser()) // move this function to utility
    setPageTitle('My Account')
    setUser({
      ...user,
      firstName: `${auth.user.firstName}`,
      lastName: `${auth.user.lastName}`,
      phoneNumber: `${auth.user.phone}`,
      email: `${auth.user.email}`,
    })
  }, []) // Fix warning...

  const updateAccount = (e: any) => {
    e.preventDefault()
    setUser({
      ...user,
      loading: true
    })
    Request(
      'PUT',
      'customer/profile', {
      'firstName': user.firstName,
      'lastName': user.lastName,
      'phone': user.phoneNumber,
      'email': user.email,
    },{ Authorization: getToken() }).then((response: any) => {
      if (response.status === 200) {
        
        const auth = JSON.parse(getUser())
        auth.user = response.data.info
        localStorage.setItem('bcdNgAuth', JSON.stringify(auth));

        setUser({
          ...user,
          loading: false
        })
        toast.success('Account updated')
      } else {
        setUser({
          ...user,
          loading: false
        })
        toast.error('Failed to update account')
      }
    }).catch((e => {
      setUser({
        ...user,
        loading: false
      })
      toast.error('Failed to update account')
      console.error(e)
    }))
  }
  return (
    <>
      <div className="card">
        <div className="card-head">
          <h2>Personal Information</h2>
        </div>
        <div className="card-body">
          <form>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>First name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    value={user.firstName}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        firstName: e.target.value,
                        changed: false
                      })
                    }}
                  />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    value={user.lastName}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        lastName: e.target.value,
                        changed: false
                      })
                    }}
                  />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        email: e.target.value,
                        changed: false
                      })
                    }}
                  />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Phone number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone number"
                    value={user.phoneNumber}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        phoneNumber: e.target.value,
                        changed: false
                      })
                    }}
                  />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary auth-btn"
                    onClick={(e) => {
                      updateAccount(e)
                    }}
                    disabled={user.changed}
                  >{user.loading ?<BtnLoader/>:'Save'}</button>
              </div>
            </div>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export { Account };