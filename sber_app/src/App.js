import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AssistantContext } from './assistant/assistant_context';
import { initializeAssistant } from './assistant/assistant';
import { AppRoutes } from './routes/AppRoutes';
import { useNavigate } from 'react-router-dom';

function App() {
  const assistantRef = useRef(null);
  const navigate = useNavigate();
  const [assistantState, setAssistantState] = useState({
    isReady: false,
    error: null,
    listening: false
  });

  // Функция для перехода на страницу с фактом
  const showFact = useCallback(() => {
    navigate('/fact');
  }, [navigate]);

  // Функция для отправки данных ассистенту
  const sendData = useCallback((action) => {
    if (!assistantRef.current) {
      console.error('Assistant is not initialized');
      return;
    }

    try {
      assistantRef.current.sendData({
        action: {
          type: action.type,
          payload: action.payload
        }
      });
    } catch (error) {
      console.error('Error sending data:', error);
      setAssistantState(prev => ({ ...prev, error: error.message }));
    }
  }, []);

  // Обработчик команд от ассистента
  const handleAssistantAction = useCallback((action) => {
    if (!action) return;

    switch (action.type) {
      case 'show_fact':
        showFact();
        break;
      case 'navigation':
        navigate(action.payload.path);
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  }, [navigate, showFact]);

  // Инициализация ассистента
  useEffect(() => {
    const getState = () => ({
      current_page: window.location.pathname,
      // item_selector: {
      //   items: []
      // }
    });

    try {
      const assistant = initializeAssistant(getState);
      assistantRef.current = assistant;

      // Обработчик входящих данных
      const dataHandler = (event) => {
        console.log('Assistant command:', event);
        if (event.action) {
          handleAssistantAction(event.action);
        }
      };

      // Обработчик старта ассистента
      const startHandler = () => {
        console.log('Assistant ready');
        setAssistantState(prev => ({ ...prev, isReady: true }));
      };

      // Обработчик состояния микрофона
      const listeningHandler = ({ status }) => {
        setAssistantState(prev => ({ ...prev, listening: status === 'typing' }));
      };

      assistant.on('data', dataHandler);
      assistant.on('start', startHandler);
      assistant.on('typing', listeningHandler);

      return () => {
        // Вместо assistant.off() просто удаляем ссылки на обработчики
        // В текущей версии API явного метода отписки нет
        assistantRef.current = null;
      };
    } catch (error) {
      console.error('Initialization failed:', error);
      setAssistantState(prev => ({ ...prev, error: error.message }));
    }
  }, [handleAssistantAction]);

  return (
      <AssistantContext.Provider value={{
        assistant: assistantRef.current,
        sendData,
        showFact,
        state: assistantState
      }}>
        <div className={`app-container ${assistantState.listening ? 'listening' : ''}`}>
          {assistantState.isReady ? (
              <AppRoutes />
          ) : (
              <div className="loading-overlay">
                <div className="loading-content">
                  <h2>Инициализация ассистента</h2>
                  {assistantState.error && (
                      <p className="error-message">{assistantState.error}</p>
                  )}
                </div>
              </div>
          )}
        </div>
      </AssistantContext.Provider>
  );
}

export default App;