import React, { useEffect, useRef, useState } from 'react';
import { AssistantContext } from './assistant/assistant_context';
import { initializeAssistant } from './assistant/assistant';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  const assistantRef = useRef(null);
  const [assistantState, setAssistantState] = useState(null);

  // Инициализация ассистента
  useEffect(() => {
    const assistant = initializeAssistant(() => assistantState);
    assistantRef.current = assistant;

    // Обработчик входящих сообщений
    const handleData = (event) => {
      console.log('Received assistant event:', event);
      // Здесь можно обрабатывать общие события от ассистента
    };

    assistant.on('data', handleData);

    return () => {
      assistant.off('data', handleData);
    };
  }, []);

  // Функция для отправки данных ассистенту
  const sendData = (actionId, parameters = {}) => {
    if (assistantRef.current) {
      assistantRef.current.sendData({
        action: {
          action_id: actionId,
          parameters,
        },
      });
    }
  };

  return (
    <AssistantContext.Provider value={{
      assistant: assistantRef.current,
      sendData,
    }}>
      <AppRoutes />
    </AssistantContext.Provider>
  );
}

export default App;
