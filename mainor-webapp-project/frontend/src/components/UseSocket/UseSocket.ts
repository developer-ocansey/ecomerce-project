import { useEffect, useRef, useState } from "react";

import { getToken } from "../../utils";
import { iourl } from "../../api/requests";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = iourl;

// conversationId === messageListId
const useSocket = (conversationId: number) => {
  const [messages, setMessages]: any = useState([]);
  const socketRef: any = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { conversationId },
    });
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message: string) => {
      setMessages(message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [conversationId]);

  const sendMessage = (message: string, conversationId:number) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      message: message,
      senderId: socketRef.current.id,
      sentBy: 'customer',
      authorization: getToken(),
      conversationId: conversationId,
    });
  };

  return { messages, sendMessage };
};

export default useSocket;
