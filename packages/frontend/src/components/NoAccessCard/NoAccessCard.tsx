import React, { useCallback, useContext, useEffect, useState } from 'react';
import { VoiceContext } from 'contexts/VoiceContext';
import { Card } from 'components/Card';

export const NoAccessCard: React.FC = () => {
  const [attemptFailed, setAttemptFailed] = useState(false);
  const { setMediaStream } = useContext(VoiceContext);

  const askForPermissions = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(mediaStream);
    } catch {
      setAttemptFailed(true);
    }
  }, [setMediaStream])

  useEffect(() => {
    askForPermissions();
  }, [askForPermissions]);

  return (
    <Card>
      {!attemptFailed
        ? 'To use the application you must grant access to a microphone.'
        : 'You have declined a request for microphone privileges. If you change your mind - change website permissions.'
      }
    </Card>
  );
};