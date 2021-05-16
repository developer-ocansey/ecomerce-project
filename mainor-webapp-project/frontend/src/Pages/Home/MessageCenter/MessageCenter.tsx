import './style.scss'

import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { _truncate, getToken, setPageTitle } from "../../../utils";

import ChatLoading from '../../../components/ChatLoading/ChatLoading';
import { Loading } from '../../../components/Loading/Loading';
import Moment from 'moment'
import Request from '../../../api/requests';
import useSocket from '../../../components/UseSocket/UseSocket';

interface Identifiable { messageId: string; }

const MessageCenter_ = ({ match }: RouteComponentProps<Identifiable>) => {
  const msgId = Number(match.params.messageId)
  const [ chat, setChat ] = useState([]);
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [messageList, setMessageList] = useState([])
  const [message, setMessage] = useState('')
  const [activeMsg, setActiveMsg] = useState({
    id:0,
    product :{
      merchantInfo: {
        businessLogo:'',
        businessName: ''
      }
    }
   })
   const { messages, sendMessage } = useSocket(activeMsg.id);
  useEffect(() => {
    setPageTitle('Message Center')
    getChatMessages()
  }, [])

  useEffect(() => {
    setChat(chat.concat(messages))
  }, [messages])

  const getChatMessages = () => {
    setLoading(true)
    Request(
      'GET',
      '/customer/messages/list',
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setMessageList(response.data.data)
          setLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setLoading(false)
    })
  }

  const sendMsg = () => {
    if (message !== '') {
      sendMessage(message, activeMsg.id);
      setMessage(''); 
    }
   }

// change url on-click
  const MessageList = () => {
    return <>
      {messageList.map((data: any, index: number) => {
       const logo = data.product.merchantInfo.businessLogo === '' ||  data.product.merchantInfo.businessLogo === null? '/img/empty.svg':data.product.merchantInfo.businessLogo
        return (
          <div
            className={`msg-user-wrap unread-msg ${(data.id === activeMsg.id) && 'active'}`}
            key={index}
            onClick={() => window.location.href = `home/message-center/${data.id}`}
          >
          <div className='user-img'>
            <img src={logo} alt='profile'/>
          </div>
          <h2>{_truncate(data.product.merchantInfo.businessName, 18)} </h2>
            <p className='msg-preview'>
              <span
                className='msg-preview-date'>
                {Moment(data.createdAt).format('lll')}
              </span>
            </p> 
        </div>
        )
      })}
    </>
  }

  // read active read unread-msg
  useEffect(() => {
    if (msgId || activeMsg.id){
      getMessages(msgId || activeMsg.id)
    }
  }, [activeMsg.id, msgId])

  const getMessages = (id: number) => {
    setChatLoading(true)
    Request(
      'GET',
      `/messages/${id}`,
      null,{ Authorization: getToken() }).then((response: any) => {
        if (response.status === 200) {
          setActiveMsg(response.data.list)
          setChat(response.data.data)
          setChatLoading(false)
      }
    }).catch((e: any) => {
      console.error(e)
      setChatLoading(false)
    })
  }

  const AlwaysScrollToBottom = () => {
    const elementRef:any = useRef();
    useEffect(() => elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
    return <div ref={elementRef} />;
  };

  const Messages = () => {
    return <>
    {chat.map((data :any, index: number) => {
      return (
        <div
          className={`${data.sentBy === 'customer' ? 'sent-msg' : 'received-msg'}`}
          key={index}>
          {data.message}
          <AlwaysScrollToBottom />
        </div>
      )
    })}
  </>
  }

  const logo = activeMsg.product.merchantInfo.businessLogo === '' ||  activeMsg.product.merchantInfo.businessLogo === null? '/img/empty.svg':activeMsg.product.merchantInfo.businessLogo
  return (
          <div className='message-card'>
            {loading ? <Loading /> :<>{messageList.length > 0 ?<div className='row'>
              <div className='col-lg-4 nopadding'>
                <div className='msg-left'>
                  <div className='card-head'>
                    <h2>Messages</h2>
                  </div>
                  <div className='msg-list'>
                      <MessageList />
                  </div>
                </div>
              </div>
              <div className='col-lg-8 nopadding'>
                {activeMsg.id > 0 ? <div className='msg-right'>
                  <div className='card-head'>
                    <div className='user-img'>
                      <img src={logo} alt='userImage' />
                    </div>
                    <div className='msg-header'>
                      <h2>{activeMsg.product.merchantInfo.businessName}</h2>
                      <Link to="/cart" className='buy-product'>View cart</Link>
                    </div>
                  </div>
                  <div className='msg-body'>
                  {chatLoading?<ChatLoading />: <Messages />}
                  </div>
                  <div className='msg-bottom'>
                    <div className='row'>
                      <div className='col-lg-10 flex-center'>
                          <div className='form-group message-field'>
                            <textarea
                            className='form-control message-field'
                            id='exampleFormControlTextarea1'
                            rows={1}
                            onChange={(e)=>{
                              setMessage(e.target.value)
                            }} value={message}/>
                          </div>
                      </div>
                      <div 
                        className='col-lg-2 sendBtn'
                        onClick={() => sendMsg()}>
                      <img className='mt-1' height='35' src='/img/icons/msg-send-icon.svg' alt='sendIcon'/>
                      </div>
                    </div>
                  </div>
                </div>:<div className='empty-chat'><p>Select a merchant to chat with</p></div>}
              </div>
            </div>: <div className='empty-chat'><p>You have not started a conversation with any merchant</p>
            </div>}
            </>}
      </div>      
    )
}

const MessageCenter = withRouter(MessageCenter_ as any)
export default MessageCenter