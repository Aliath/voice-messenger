import React, { useContext, useEffect, useState } from 'react';
import { ServerContext } from 'contexts/ServerContext';
import { SignInCard } from 'components/SignInCard';
import { Loader } from 'components/Loader';
import { VoiceMessenger } from 'components/VoiceMessenger';
import { VoiceContext } from 'contexts/VoiceContext';
import { NoAccessCard } from 'components/NoAccessCard';

type HerokuState = 'connecting' | 'ready' | 'failure';

export const CoreApplication: React.FC = () => {
  const [herokuState, setHerokuState] = useState<HerokuState>('connecting');
  const { nickName, connected } = useContext(ServerContext);
  const { voiceAccessGranted } = useContext(VoiceContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SOCKET_URL}ping`).then((response) => {
      if (response.ok) {
        setHerokuState('ready');
      } else {
        setHerokuState('failure');
      }
    }, () => {
      setHerokuState('failure');
    });
  }, []);
  
  if (herokuState === 'connecting') {
    return <Loader text="Waking up heroku" />;
  } else if (herokuState === 'failure') {
    return <Loader text="Cannot connect to heroku server" />;
  } else if (!nickName) {
    return <SignInCard />;
  } else if (!voiceAccessGranted) {
    return <NoAccessCard />
  } else if (!connected) {
    return <Loader text="Connecting with websocket server" />
  }

  return <VoiceMessenger />;
};
