import React, { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import ScrollableContent from 'react-custom-scrollbars';
import { VoiceContext } from 'contexts/VoiceContext';
import { Card } from 'components/Card';
import { VoiceMessage } from 'components/VoiceMessage';
import { ReactComponent as MicrophoneIcon } from 'assets/icons/microphone-icon.svg';
import './VoiceMessenger.scss';
import { ServerContext } from 'contexts/ServerContext';
import { OnlineUsersCard } from 'components/OnlineUsersCard';
import { Loader } from 'components/Loader';

export const VoiceMessenger: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const scrollContentRef = useRef(null);
  const { startRecording, stopRecording } = useContext(VoiceContext);
  const { messages } = useContext(ServerContext);

  const onRecord = () => {
    const nextValue = !isRecording;
    
    if (nextValue) {
      startRecording();
    } else {
      stopRecording();
    }

    setIsRecording(nextValue);
  };

  useEffect(() => {
    if (scrollContentRef.current) {
      (scrollContentRef.current! as any).scrollToBottom();
    }
  }, [messages, scrollContentRef]);

  return (
    <div className="voice-messenger-container">
      <OnlineUsersCard />
      <Card className="voice-messenger">
        <ScrollableContent ref={scrollContentRef} className="voice-messenger__scroll-wrapper">
          {messages.length === 0 ? (
            <div className="voice-messenger__loader-wrapper">
              <Loader />
            </div>
          ) : (
            <div className="voice-messenger__content">
              {messages.map((message) => <VoiceMessage key={message.sentAt} message={message} />)}
            </div>
          )}
        </ScrollableContent>
        <div className="voice-messenger__bottom">
          <button type="button" className="voice-messenger__record" onClick={onRecord}>
            <div className={clsx('voice-messenger__icon-wrapper', isRecording && 'voice-messenger__icon-wrapper--recording')}>
              <MicrophoneIcon className="voice-messenger__microphone-icon" />
              <div className="voice-messenger__recording-icon" />
            </div>
          </button>
        </div>
      </Card>
    </div>
  )
};
