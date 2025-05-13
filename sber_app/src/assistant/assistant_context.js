import { createContext } from 'react';

export const AssistantContext = createContext({
  assistant: null,
  sendData: () => {},
  state: {
    isReady: false,
    error: null
  }
});

export const AssistantProvider = AssistantContext.Provider;