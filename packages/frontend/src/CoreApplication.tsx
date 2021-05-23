import React, { useContext } from 'react';
import { ServerContext } from 'contexts/ServerContext';
import { SignInCard } from 'components/SignInCard';
import { Loader } from 'components/Loader';
import { VoiceMessenger } from 'components/VoiceMessenger';
import { VoiceContext } from 'contexts/VoiceContext';
import { NoAccessCard } from 'components/NoAccessCard';

export const CoreApplication: React.FC = () => {
  const { nickName, connected } = useContext(ServerContext);
  const { voiceAccessGranted } = useContext(VoiceContext);
  
  if (!nickName) {
    return <SignInCard />;
  } else if (!voiceAccessGranted) {
    return <NoAccessCard />
  } else if (!connected) {
    return <Loader />
  }

  return <VoiceMessenger />;
};
