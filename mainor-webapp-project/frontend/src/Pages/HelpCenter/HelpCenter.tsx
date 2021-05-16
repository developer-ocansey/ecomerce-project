import 'react-simple-hook-modal/dist/styles.css';
import './style.scss'

import {
    Modal,
    ModalTransition,
    useModal,
} from 'react-simple-hook-modal';
import React, { useEffect, useState } from 'react';

import { BannerArea } from '../../components/BannerArea/BannerArea';
import { Link } from 'react-router-dom';
import Request from '../../api/requests'
import { setPageTitle } from '../../utils';

const HelpCenter = () => {
    const { isModalOpen, openModal, closeModal } = useModal();
    
    const [loading, setLoading] = useState(false);
    const [helpContents, SetHelpContents] = useState([{
        name:'',
        FAQs: [{
            question: '',
            answer: ''
        }]
    }])

    const [helpContent, SetHelpContent] = useState({
        question: '',
        answer: ''
    })
    
    const getHelpContents = () => {
        setLoading(true)
        Request(
          'GET', '/faq-categories/all',null,null).then((response: any) => {
          if (response.status === 200) {
            SetHelpContents(response.data)
            setPageTitle('Help Center')
            setLoading(false)
          }
          }).catch((e: any) => {
            setLoading(false)
            console.error(e)
        })
    }
    
    useEffect(() => {
        getHelpContents()
    }, [])
    
    const Category = ()=>{
        return <>
            {helpContents.map((data: any, index) => {
                return (
                    <div className='col-lg-4' key={index}>
                    <div className='faq-wrap'>
                    <h3>{data.name}</h3>
                    {data.FAQs.slice(0,3).map((data: any, index: number)=>{
                        return <p key={index} className='links' onClick={() => { SetHelpContent(data); openModal() }}>{data.question}</p>
                    })}
                    <p className='faq-action'><Link className='hvr-icon-wobble-horizontal' to='#'>View all <img src='img/icon-go.png' alt='icon_go'/></Link></p>
                    </div>
                </div>
                )
            })
        }        <Modal
        id="any-unique-identifier"
        isOpen={isModalOpen}
        transition={ModalTransition.BOTTOM_UP}
            >
                 <button type="button" className="close" onClick={closeModal}>
                        <span aria-hidden="true"><img width="15" src="/img/icons/close.svg" alt='close' /></span>
                    </button>
                <h2>{helpContent.question}</h2>
                <br />
               <p className='help-content'>{helpContent.answer}</p> 
            </Modal>
        </>
    }

    return <>
        <BannerArea props={{title: 'Help Center', header: 'Frequently Asked Question'}}/>
            <section id='help-center'>
                <div className='container'>
                    <div className='row'>
                    <div className='col'>
                        <h2>Suggested Questions</h2>
                    </div>
                    </div>
                    <div className='row mt-5'>
                        <Category />
                    </div>
                </div>
        </section>
        </>
}
export { HelpCenter } 