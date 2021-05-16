import React, { useEffect, useState } from 'react';

import BtnLoader from '../../../components/BtnLoader/BtnLoader';
import Request from '../../../api/requests';
import { setPageTitle } from '../../../utils';
import { toast } from 'react-toastify';

type VerifyProps = {
  token?: string,
  loading?: boolean
}

const Verify = (props:any):JSX.Element => {
  const [user, setUser] = useState({
    token: '',
    loading: false,
  })
  
  useEffect(() => {
    setPageTitle('Verify your account')
  }, [])
  
  const verify = async (e: any) => {
    e.preventDefault();
    
    if (user.token === '') {
      toast.error('Email or password cannot be empty')
      return
    } 

    setUser({ ...user, loading: true })
    await Request(
      'GET',
      'customer/verify/' + user.token, null).then((response: any) => {
      if (response.status === 200) {
          setUser({ ...user, loading: false })
          toast.success(response.message)
          window.location.href = '/auth/login'
      } else {
        setUser({ ...user, loading: false })
        toast.error(response.message)
      }
    }).catch((e => {
      setUser({ ...user, loading: false })
      console.error(e)
    }))
  }

  const resend = async (e: any) => {
    e.preventDefault();
    await Request(
      'GET',
      'customer/resend', {
        'email': props.email
      }).then((response: any) => {
      if (response.status === 200) {
        setUser({ ...user, loading: false })
        toast.success(response.message)
      } else {
        setUser({ ...user, loading: false })
        toast.error(response.message)
      }
    }).catch((e => {
      setUser({ ...user, loading: false })
      console.error(e)
    }))
  }

  return (
    <div className='user-auth-wrap'>
        <h2>Enter the verification code sent to your email</h2>
        <form>
          <div className='form-group'>
          <input
            type='password'
            className='form-control'
            placeholder='Enter verification code'
            onChange={(e) => {
              setUser({...user, token: e.target.value})
            }}
          />
          </div>
          <button
            type='submit'
          className='btn btn-primary auth-btn'
          onClick={(e)=>{verify(e)}}
          >
            {user.loading?<BtnLoader/>:'Save'}
          </button>
          <div className='line'></div>
          <div className=''>
          <p>Didn't receive and verification
            <span
              onClick={(e) => resend(e)}
            >
              <span>
                {user.loading?<BtnLoader/>:'Resend'}
              </span>
            </span>
          </p>
          </div>
        </form>
      </div>
    )
}

Verify.defaultProps = {
  token: '',
  loading: false
}
 
export default Verify