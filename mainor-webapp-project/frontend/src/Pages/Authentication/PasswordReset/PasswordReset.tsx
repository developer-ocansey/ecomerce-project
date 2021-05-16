import React, { useEffect, useState } from 'react';

import BtnLoader from '../../../components/BtnLoader/BtnLoader';
import { Link } from 'react-router-dom';
import Request from '../../../api/requests';
import { setPageTitle } from '../../../utils';
import { toast } from 'react-toastify';

type PasswordResetProps = {
  confirmationCode?: string
  password?: string,
  isReset?: boolean,
  loading?: boolean
}

const PasswordReset = (): JSX.Element => {
  const [passwordReset, setPasswordReset] = useState({ confirmationCode: '', password: '', isReset: false, loading: false }) // propagate in other places ...

  useEffect(() => {
    setPageTitle('Reset Password')
  }, [])
  
  const resetPassword = async (e: any) => {
    e.preventDefault()

    setPasswordReset({ ...passwordReset, loading: true })

    await Request(
      'POST',
      'customer/reset-password/' + passwordReset.confirmationCode, {
        'password': passwordReset.password,
    }).then((response: any) => {
      if (response.status === 200) {
        setPasswordReset({ ...passwordReset, loading: false, isReset: true })
        toast.success(response.message)
      } else {
        setPasswordReset({ ...passwordReset, loading: false })
        toast.error(response.message)
      }
    }).catch((e => {
      setPasswordReset({ ...passwordReset, loading: false, isReset: false })
      console.error(e)
    }))
  }

    return (
      <>
        {passwordReset.isReset ? <>
          <h2 className='mt-4'>Your have set a new password successfully</h2>
          <Link to='/auth/login'><button type='button' className='btn btn-primary auth-btn mt-5'>Login now</button></Link>
        </> :
          <>
            <h2>Reset Password</h2>
            <form>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter verification code'
                  onChange={(e) => {
                    setPasswordReset({
                      ...passwordReset,
                      confirmationCode: e.target.value
                    })
                  }}
                />
              </div>
              <div className='form-group'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Enter New Password'
                  onChange={(e) => {
                    setPasswordReset({
                      ...passwordReset,
                      password: e.target.value
                    })
                  }}
                />
              </div>
              <button
                type='submit'
                className='btn btn-primary auth-btn'
                onClick={(e) => {
                  !passwordReset.loading && resetPassword(e)
                }}>
                {passwordReset.loading?<BtnLoader/>:'Save'}
            </button>
              <div className='line'></div>
              <div className='flex-center'>
                <p>Remember your password? <Link to='login'><span>Login</span></Link></p>
              </div>
            </form>
          </>}
      </>
    )
  }


PasswordReset.defaultProps = {
  confirmationCode: '',
  password: '',
  isReset: false,
  loading: false
}
 
export default PasswordReset