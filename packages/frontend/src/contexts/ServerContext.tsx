import React, { useCallback, useEffect, useState } from 'react';
import socketIO, { Socket } from 'socket.io-client';
import { Message } from 'types/Message';

type ServerContextProps = {
  nickName: string;
  connected: boolean;
  setNickName: (value: string) => void;
  messages: Message[];
  onlineUsers: string[];
  sendMessage: (voiceMessage: Blob) => void;
};

export const ServerContext = React.createContext<ServerContextProps>({
  nickName: '',
  connected: false,
  setNickName: () => {},
  messages: [],
  sendMessage: () => {},
  onlineUsers: [],
});

export const ServerContextProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickName, setNickName] = useState(localStorage.getItem('voicemessenger-nick') || '');
  const [connected, setConnected] = useState(false);
  const [connection, setConnection] = useState<null | Socket>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const sendMessage = useCallback(async (blob: Blob) => {
    if (!connection || !connected) {
      return;
    } 

    connection.emit('voiceMessage', blob);
  }, [connected, connection]);

  const providerValue = {
    nickName,
    connected,
    setNickName,
    messages,
    sendMessage,
    onlineUsers,
  };

  useEffect(() => {
    if (!nickName) {
      return () => {}
    }

    const connection = socketIO(process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080', {
      timeout: 60 * 1000,
    });
    setConnection(connection);

    connection.on('connect', () => {
      connection.emit('auth/request', nickName);
    });

    connection.on('auth/request::ok', () => {
      setConnected(true);
    });

    connection.on('update::onlineUsers', (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    connection.on('update::messages', (messages) => {
      setMessages((previousState) => {
        return [...previousState, ...messages];
      });
    });

    return () => {
      connection.close();
      setConnection(null);
      setConnected(false);
    };
  }, [nickName])

  return (
    <ServerContext.Provider value={providerValue}>
      {children}
    </ServerContext.Provider>
  );
};