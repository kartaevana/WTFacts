// src/App.js (ФИНАЛЬНЫЙ НАДЕЖНЫЙ ВАРИАНТ)

// Импортируем необходимые хуки из React
import React, { useEffect, useRef, useState, useCallback } from 'react';
// Импортируем хук для навигации из react-router-dom
import { useNavigate } from 'react-router-dom';

// Импортируем контекст ассистента и функцию инициализации
// Убедитесь, что пути к этим файлам верны в вашем проекте
import { AssistantContext } from './assistant/assistant_context'; // Путь к вашему файлу контекста
import { initializeAssistant } from './assistant/assistant';     // Путь к вашему файлу с initializeAssistant

// Импортируем маршруты вашего приложения
// Убедитесь, что путь к этому файлу верен
import { AppRoutes } from './routes/AppRoutes';

// Основной функциональный компонент приложения
function App() {
  // Реф для хранения экземпляра ассистента. useRef не вызывает ре-рендер при изменении .current
  const assistantRef = useRef(null);
  // Хук для программной навигации по маршрутам
  const navigate = useNavigate();

  // Состояние приложения, которое может быть интересно ассистенту/бэкенду
  // Храним здесь готовность ассистента, ошибки И ПОСЛЕДНИЙ ПОЛУЧЕННЫЙ ФАКТ
  const [assistantState, setAssistantState] = useState({
    isReady: false, // Готов ли ассистент к работе
    lastFact: null, // <-- Храним здесь последний полученный факт (из action.payload)
    error: null,    // Состояние ошибки
    listening: false // Слушает ли ассистент (если нужно)
  });

  // --- Коллбэки для взаимодействия с приложением ---

  // Функция для перехода на страницу с фактом
  // Используем useCallback, чтобы функция не пересоздавалась при каждом ре-рендере
  const showFact = useCallback(() => {
    console.log('Navigating to /fact');
    navigate('/fact');
  }, [navigate]); // Зависимость: navigate (стабилен)

  // Функция для отправки данных (команд) ассистенту
  // Принимает actionPayload, который будет отправлен через sendData
  const sendData = useCallback((actionPayload) => {
    if (!assistantRef.current) {
      console.error('Assistant is not initialized');
      // Можно обновить состояние ошибки, если sendData вызвана до инициализации
      // setAssistantState(prev => ({ ...prev, error: 'Assistant not initialized for sendData' }));
      return;
    }

    console.log('Sending data to assistant with action payload:', actionPayload);
    try {
      // Отправляем данные через экземпляр ассистента
      // actionPayload должен быть объектом, который ожидает ваш бэкенд/сценарий
      // Например: { type: 'GET_NEXT_FACT' } или { parameters: { command: '...' } }
      assistantRef.current.sendData({
        action: actionPayload // Отправляем actionPayload как поле action
        // Если бэкенд ожидает параметры, то sendData({ parameters: actionPayload })
      });
    } catch (error) {
      console.error('Error sending data:', error);
      setAssistantState(prev => ({ ...prev, error: error.message })); // Обновляем состояние ошибки при ошибке отправки
    }
  }, []); // Зависимости: нет, т.к. assistantRef.current стабилен после инициализации

  // Функция-диспетчер для обработки действий (action) от ассистента/бэкенда
  const handleAssistantAction = useCallback((action) => {
    console.log('handleAssistantAction received:', action);
    if (!action) return;

    console.log('Processing action type:', action.type);
    try {
      switch (action.type) {
        case 'show_fact':
          console.log('Action: show_fact - calling showFact() and saving fact data');
          // *** Сохраняем данные факта из action.payload в состоянии App ***
          if (action.payload) {
            setAssistantState(prev => ({
              ...prev,
              lastFact: { // Убедитесь, что структура payload соответствует тому, что вы ожидаете (name, text)
                name: action.payload.factName || action.payload.name, // Поддержка разных имен полей payload
                text: action.payload.factText || action.payload.fact
              }
            }));
            console.log('Fact data saved:', action.payload);
          } else {
            console.warn('Action show_fact received without payload.');
            setAssistantState(prev => ({ ...prev, lastFact: null })); // Очищаем факт, если payload нет
          }
          showFact(); // Вызываем коллбэк для перехода на страницу факта
          break;
        case 'navigation': // Пример обработки навигации по другому action type
          console.log('Action: navigation to', action.payload?.path);
          if (action.payload && action.payload.path) {
            navigate(action.payload.path);
          } else {
            console.warn('Navigation action without path in payload:', action);
          }
          break;
        default:
          console.warn('Unknown action type received from assistant:', action.type, action);
          // Возможно, очистить состояние ошибки, если предыдущая команда была с ошибкой
          // setAssistantState(prev => ({ ...prev, error: null }));
      }
    } catch (e) {
      console.error('Error executing assistant action:', e);
      // Обработайте ошибку выполнения действия
      // setAssistantState(prev => ({ ...prev, error: 'Error processing assistant action: ' + e.message }));
    }
  }, [navigate, showFact]); // Зависимости: navigate, showFact

  // Функция, которую ассистент будет вызывать, чтобы получить текущее состояние приложения
  // Используем useCallback, чтобы иметь стабильную ссылку
  // Зависит от assistantState, чтобы передавать актуальное состояние
  const getAssistantState = useCallback(() => {
    // Консоль лог показывает, что эта функция вызывается
    console.log('Assistant requested state. Current state:', assistantState);
    // Возвращаем объект с состоянием, которое может понять бэкенд или платформа
    // Включаем текущую страницу и последний факт в состояние для бэкенда/сценария
    return {
      current_page: window.location.pathname,
      // Убедитесь, что lastFact не null перед передачей, если бэкенд ожидает определенную структуру
      last_fact_data: assistantState.lastFact ? { ...assistantState.lastFact } : null,
      // Добавьте другие части состояния, если нужно
      is_ready: assistantState.isReady
    };
  }, [assistantState]); // <-- Зависимость от assistantState

  // --- Инициализация ассистента и подписка на события ---

  // Эффект, который выполняется при монтировании и при изменении зависимостей
  useEffect(() => {
    let assistant; // Переменная для экземпляра ассистента

    // *** ВАЖНАЯ ПРОВЕРКА: Инициализируем ассистента только в браузере ***
    if (typeof window !== 'undefined') {
      console.log('Initializing Assistant...');
      try { // <-- Добавили try/catch вокруг инициализации
        // Вызываем функцию initializeAssistant, передавая ей НАШУ функцию getState
        assistant = initializeAssistant(getAssistantState);

        assistantRef.current = assistant;
        console.log('Assistant instance set in ref:', assistantRef.current);

        // --- Определяем обработчики событий ---
        // Выносим их отдельно, чтобы использовать стабильные ссылки при подписке/отписке

        const dataHandler = (event) => {
          console.log('Assistant event "data":', event);
          // Обрабатываем действия от бэкенда/сценария
          if (event.action) {
            handleAssistantAction(event.action); // Используем handleAssistantAction из зависимостей
          }
          // Обрабатываем текстовые/голосовые ответы без явного action (если нужно показать текст)
          if (event.message && event.message.text) {
            console.log('Assistant message text:', event.message.text);
            // TODO: Добавьте логику для отображения текста ассистента на экране
            // Например, обновить отдельное состояние типа `assistantText`
            // setAssistantState(prev => ({ ...prev, currentAssistantText: event.message.text }));
          } else if (!event.action) {
            // Если пришло data без action и без message, это может быть служебное событие
            console.log('Assistant event "data" received without action or message field.', event);
          }
        };

        const startHandler = () => {
          console.log('Assistant event "start": Assistant is ready.');
          setAssistantState(prev => ({ ...prev, isReady: true, error: null })); // Обновляем состояние готовности и очищаем ошибку
        };

        const errorHandler = (event) => {
          console.error('Assistant event "error":', event);
          // Обновляем состояние ошибки, используя event.message или другую инфу из event
          const errorMessage = event.message || event.description || 'Unknown assistant error';
          setAssistantState(prev => ({ ...prev, error: 'Assistant error: ' + errorMessage }));
        };

        const listeningHandler = ({ status }) => {
          console.log('Assistant event "typing" (listening status):', status);
          setAssistantState(prev => ({ ...prev, listening: status === 'typing' })); // Обновляем состояние слушания
        };


        // --- Подписываемся на события ---
        console.log('Subscribing to Assistant events...');
        // Убедимся, что assistantRef.current существует перед подпиской
        if (assistantRef.current) {
          assistantRef.current.on("data", dataHandler);
          assistantRef.current.on("start", startHandler);
          assistantRef.current.on("error", errorHandler);
          assistantRef.current.on("typing", listeningHandler); // Подписка на событие typing
          console.log('Assistant events subscribed.');
        } else {
          console.error('Assistant instance is null after initialization attempt. Cannot subscribe.');
          setAssistantState(prev => ({ ...prev, error: prev.error || 'Failed to create assistant instance.' }));
        }


        // --- Функция очистки эффекта ---
        return () => {
          console.log('Cleaning up Assistant listeners...');
          // Важно: assistantRef.current в функции очистки - это экземпляр из ПРЕДЫДУЩЕГО запуска эффекта
          // или финальный экземпляр при размонтировании.
          const currentAssistantInstance = assistantRef.current; // Сохраняем ссылку

          if (currentAssistantInstance) {
            // !!! ПРАВИЛЬНАЯ ОЧИСТКА: используем .off() или .removeListener() !!!
            // !!! Используем те же самые ссылки на функции-обработчики И экземпляр, на который подписывались !!!
            try {
              console.log('Unsubscribing from Assistant events...');
              currentAssistantInstance.off("data", dataHandler);
              currentAssistantInstance.off("start", startHandler);
              currentAssistantInstance.off("error", errorHandler);
              currentAssistantInstance.off("typing", listeningHandler);
              console.log('Assistant listeners unsubscribed.');

              // Возможно, полный метод уничтожения ассистента, если он есть и нужен
              // currentAssistantInstance.destroy(); // Пример
              // console.log('Assistant instance destroyed.');
            } catch (cleanupError) {
              console.error('Error during Assistant cleanup (unsubscribing):', cleanupError);
              //setAssistantState(prev => ({ ...prev, error: 'Cleanup error: ' + cleanupError.message })); // Осторожно с обновлением стейта в cleanup
            }
          } else {
            console.log('No Assistant instance to clean up.');
          }

          // Не нужно обнулять assistantRef.current = null; здесь, если destroy() не используется
          // Это может помешать другим частям кода, которые используют реф в момент размонтирования.
          // Ref автоматически очищается при размонтировании компонента React.
          // if (assistantRef.current === currentAssistantInstance) {
          //    assistantRef.current = null; // Можно обнулить, только если уверены, что это тот же самый инстанс и он не нужен
          // }

          console.log('Assistant cleanup function finished.');
        };

      } catch (initializationError) { // <-- Конец catch блока инициализации
        console.error('FATAL ERROR during assistant initialization:', initializationError);
        setAssistantState(prev => ({ ...prev, error: initializationError.message + ". Check console for details." }));
        assistantRef.current = null; // Убедимся, что реф null при ошибке
        // Возвращаем пустую функцию очистки, чтобы не было ошибок при размонтировании
        return () => { console.log('Assistant cleanup skipped due to init error.'); };
      }

    } else { // Код выполняется не в браузере (SSR)
      console.warn('Assistant initialization skipped: not in a browser environment.');
      assistantRef.current = null; // Убедимся, что реф null
      // Возвращаем пустую функцию очистки
      return () => { console.log('Assistant cleanup skipped (not in browser).'); };
    }

    // Зависимости useEffect: handleAssistantAction и getAssistantState
    // Они используются внутри эффекта и обернуты в useCallback
    // navigate, assistantRef и другие стейты не нужны.
    // Обработчики dataHandler, startHandler и т.д. определены внутри эффекта,
    // они видят актуальные handleAssistantAction, setAssistantState, getAssistantState через замыкание,
    // потому что эти коллбэки/стейты включены в зависимости useEffect (или их коллбэки).
  }, [handleAssistantAction, getAssistantState]); // <<<< Зависимости useEffect

  // --- Рендер компонента ---

  return (
      // Предоставляем ассистента и коллбэки через контекст
      // Это позволяет дочерним компонентам взаимодействовать с ассистентом
      <AssistantContext.Provider value={{
        assistant: assistantRef.current, // Сам экземпляр ассистента (может быть null до инициализации или при ошибке)
        sendData,                       // Функция для отправки команд ассистенту
        showFact,                       // Функция для навигации на страницу факта
        currentFact: assistantState.lastFact, // <-- Передаем последний факт через контекст
        state: assistantState          // Передаем общее состояние ассистента (isReady, error, listening)
        // Если нужно, можно добавить другие функции или данные в контекст
      }}>
        {/* Контейнер для стилей микрофона (если listening меняет класс) */}
        <div className={`app-container ${assistantState.listening ? 'listening' : ''}`}>
          {/* Условный рендеринг в зависимости от готовности ассистента */}
          {assistantState.isReady ? (
              <AppRoutes /> // Рендерим маршруты, когда ассистент готов
          ) : (
              // Экран загрузки или ошибки инициализации
              <div className="loading-overlay">
                <div className="loading-content">
                  <h2>{assistantState.error ? 'Ошибка инициализации' : 'Подключение к ассистенту...'}</h2>
                  {!assistantState.error && <p>Пожалуйста, подождите...</p>}
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