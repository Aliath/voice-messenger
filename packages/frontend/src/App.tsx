import React from 'react';
import 'ress';
import { ServerContextProvider } from 'contexts/ServerContext';
import { VoiceContextProvider } from 'contexts/VoiceContext';
import { CoreApplication } from './CoreApplication';
import 'assets/scss/index.scss';

const App: React.FC = () => {
  return (
    <ServerContextProvider>
      <VoiceContextProvider>
        <CoreApplication />
      </VoiceContextProvider>
    </ServerContextProvider>
  );
}

export default App;
