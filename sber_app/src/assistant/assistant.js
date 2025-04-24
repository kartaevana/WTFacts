import { createAssistant, createSmartappDebugger } from '@salutejs/client';

export const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN || '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP || 'приложение'}`,
      getState,
      nativePanel: {
        defaultText: 'Расскажи что-то интересное',
        screenshotMode: false,
        tabIndex: -1,
    }
    });
  }
  return createAssistant({ getState });
};