import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ServerContext } from './ServerContext';

type VoiceContextProps = {
  voiceAccessGranted: boolean;
  mediaStream: MediaStream | null;
  setMediaStream: (value: MediaStream) => void;
  startRecording: () => void;
  stopRecording: () => void;
};

export const VoiceContext = React.createContext<VoiceContextProps>({
  voiceAccessGranted: false,
  mediaStream: null,
  setMediaStream: () => {},
  startRecording: () => {},
  stopRecording: () => {},
});

export const VoiceContextProvider: React.FC = ({ children }) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const { sendMessage } = useContext(ServerContext);
  const voiceAccessGranted = !!mediaStream;

  const mediaRecorder = useMemo(() => {
    if (!mediaStream) {
      return null;
    }

    return new MediaRecorder(mediaStream);
  }, [mediaStream]);

  const handleRecordingFinished = useCallback((event: any) => {
    sendMessage(event.data);
  }, [sendMessage]);

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.addEventListener('dataavailable', handleRecordingFinished);
    }
  }, [handleRecordingFinished, mediaRecorder]);

  const startRecording = () => {
    if (!mediaStream || !mediaRecorder) {
      return;
    }

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (!mediaStream || !mediaRecorder) {
      return;
    }

    mediaRecorder.stop();
  };


  const providerValue = {
    voiceAccessGranted,
    mediaStream,
    setMediaStream,
    startRecording,
    stopRecording,
  };

  return (
    <VoiceContext.Provider value={providerValue}>
      {children}
    </VoiceContext.Provider>
  );
};