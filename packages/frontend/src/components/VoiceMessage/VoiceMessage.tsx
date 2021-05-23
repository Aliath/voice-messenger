import React, { useContext, useMemo } from 'react';
import clsx from 'clsx';
import { usePopperTooltip } from 'react-popper-tooltip';
import { VoiceMessagePlayer } from 'components/VoiceMessagePlayer';
import { Message } from 'types/Message';
import { ServerContext } from 'contexts/ServerContext';
import './VoiceMessage.scss';

type VoiceMessageProps = {
  message: Message;
}

export const VoiceMessage: React.FC<VoiceMessageProps> = ({ message }) => {
  const { nickName } = useContext(ServerContext);
  const { author } = message;
  const owned = author === nickName;
  const audioBlob = useMemo(
    () => new Blob([message.message], { 'type' : 'audio/ogg; codecs=opus' }),
    [message.message]
  );

  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  return (
    <div className={clsx('voice-message', owned && 'voice-message--owned')}>
      <div ref={setTriggerRef} className="voice-message__author">
        {author[0]}
      </div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: 'voice-message-tooltip' })}
        >
          {author}
        </div>
      )}
      <VoiceMessagePlayer className="voice-message__player" audioBlob={audioBlob} />
    </div>
  );
};
