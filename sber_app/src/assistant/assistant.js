import { createAssistant, createSmartappDebugger } from '@salutejs/client';

let assistantInstance = null;

export const initializeAssistant = (getState) => {
  if (assistantInstance) return assistantInstance;

  const settings = {
    getState,
    token: process.env.REACT_APP_TOKEN || '',
    initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP || 'приложение'}`,
    nativePanel: {
      defaultText: 'Поговорим',
      screenshotMode: false,
      tabIndex: -1,
    }
  };

  assistantInstance = process.env.NODE_ENV === 'development'
      ? createSmartappDebugger(settings)
      : createAssistant(settings);

  return assistantInstance;
};

export const getAssistantInstance = () => assistantInstance;