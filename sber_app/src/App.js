import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AssistantContext } from './assistant/assistant_context';
import { initializeAssistant } from './assistant/assistant';
import { AppRoutes } from './routes/AppRoutes';
import { useNavigate } from 'react-router-dom';

function App() {
  const assistantRef = useRef(null);
  const assistantStateRef = useRef();
  const navigate = useNavigate();
  const [assistantState, setAssistantState] = useState({
    isReady: false,
    error: null,
    data: null
  });

  // Инициализация ассистента
  useEffect(() => {
    const assistant = initializeAssistant(() => assistantStateRef.current);
    assistantRef.current = assistant;
    
    // Подписываемся на события ассистента
    assistant.on("data", (event) => {
      console.log('Received command:', event);
      dispatchAssistantAction(event.action);
    });

    assistant.on("command", console.log);

    assistant.on("error", (event) => {
      console.error('Assistant error:', event);
      setAssistantState(prev => ({ ...prev, error: event.message }));
    });

    return () => {
      assistant.off("command");
      assistant.off("error");
    };
  }, []);

  function dispatchAssistantAction(action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      console.log('action.type', action.type);
      switch (action.type) {
        case 'show_fact':
          console.log('show_fact');
          navigate(`/fact`);
          return;
        default:
          console.warn('Unknown action type:', action.type);
      }
    }
  }

  // Функция для перехода на страницу с фактом
  const showFact = useCallback(() => {
    navigate(`/fact`);
  }, [navigate]);

  // Функция для отправки данных ассистенту
  const sendData = useCallback((parameters = {}) => {
    if (!assistantRef.current) {
      console.error('Assistant is not initialized');
      return;
    }

    try {
      assistantRef.current.sendData({
        action: {
          parameters,
        },
      });
    } catch (error) {
      console.error('Error sending data to assistant:', error);
      setAssistantState(prev => ({ ...prev, error: error.message }));
    }
  }, []);

  return (
    <AssistantContext.Provider value={{
      assistant: assistantRef.current,
      sendData,
      showFact,
      state: assistantState,
    }}>
      <AppRoutes />
      </AssistantContext.Provider>
  );
}

export default App;

