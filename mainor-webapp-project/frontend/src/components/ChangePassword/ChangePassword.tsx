import React, { useState } from 'react';

import Request from '../../api/requests';
import { getToken } from '../../utils';
import { logout } from '../../utils/index';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [password, setPassword] = useState({
        oldPassword: '',
        password: '',
        validatePassword:'',
    })
    
    const change = async (e: any) => {
        e.preventDefault();
        if (!password.oldPassword || !password.password || !password.validatePassword) {
            return toast.error("All fields must be filled to change your password")
        }
        if (password.password !== password.validatePassword) {
            return toast.error('New password does not match')
        }
        await Request(
            'POST',
            'customer/change-password', {
            'oldPassword': password.oldPassword,
            'newPassword': password.validatePassword
            },{ Authorization: getToken() }).then((response: any) => {
            if (response.data.status === true) {
                logout()
                window.location.href = '/auth/login'
                return toast.success('Password updated, Login to continue')
            } else {
                toast.error(response.data.message)
            }
            }).catch((e => {
            console.error(e)
        }))
    }

    return (
        <div className='modal fade' id='change-password' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                    <h5 className='modal-title' id='exampleModalLabel'>Change Password</h5>
                    <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                        <span aria-hidden='true'><img width='15' src='/img/icons/close.svg' alt='close' /></span>
                    </button>
                    </div>
                    <div className='modal-body'>
                    <form>
                        <div className='form-group'>
                                <input type='password' className='form-control' id='' placeholder='Enter Current Password' onChange={(e)=>{setPassword({...password, oldPassword: e.target.value})}} />
                        </div>
                        <div className='form-group'>
                            <input type='password' className='form-control' id='' placeholder='Enter New Password' onChange={(e)=>{setPassword({...password, password: e.target.value})}}/>
                        </div>
                        <div className='form-group'>
                            <input type='password' className='form-control' id='' placeholder='Confirm New Password' onChange={(e)=>{setPassword({...password, validatePassword: e.target.value})}}/>
                        </div>
                        <button className='btn btn-primary auth-btn'  onClick={ (e)=>  change(e) }>Save</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export { ChangePassword } 