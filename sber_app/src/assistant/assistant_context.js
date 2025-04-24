import { createContext } from 'react';

export const AssistantContext = createContext({
  assistant: null,
  sendData: () => {},
});