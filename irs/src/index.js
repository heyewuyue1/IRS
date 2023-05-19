import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NextUIProvider } from '@nextui-org/react'
import {SpeechProvider} from '@speechly/react-client'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SpeechProvider
    appId='8370cc1f-9a1a-4e3b-be37-3a38a859fbb0'
    debug
    logSegments>
    <NextUIProvider>
      <App />
    </NextUIProvider>
    </SpeechProvider>
  </React.StrictMode>
);
