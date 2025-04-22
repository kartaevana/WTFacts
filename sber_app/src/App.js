import React, { useRef, useState } from "react";
import './assets/style/style.css';
import { GenreContext } from "./hook/context";
import { createAssistant, createSmartappDebugger } from "@salutejs/client";
import { useSpatnavInitialization } from "@salutejs/spatial";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const [character, setCharacter] = useState('sber');
  const [genre, setGenre] = useState("human");
  const [modalState, setModalState] = useState(false);
  const [assistantGenre, setAssistantGenre] = useState("");
  const [menuState, setMenuState] = useState(false);
  const [stateModalQuiz, setStateModalQuiz] = useState(false);
  const [answ, setAnsw] = useState(null);
  const [next, setNext] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scale, setScale] = useState(Array(30).fill({status: false, id: null}));
  const [modalRes, setModalRes] = useState(false);

  useSpatnavInitialization();
  

  const initialize = (getState) => {
    if(process.env.NODE_ENV === 'development'){
      return createSmartappDebugger({
        token: process.env.REACT_APP_TOKEN ?? "",
        initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
        getState,
      });
    }
    else{
      return createAssistant({getState});
    }
  }


  const assistantStateRef = useRef();
  const assistantRef = useRef();

  // useEffect(() => {
  //   assistantRef.current = initialize(() => assistantStateRef.current);
  //   assistantRef.current.on("data", (action) => {
  //     handleAssistantDataEvent(action)
  //   });
  //   assistantRef.current.on("command", (event) => {
  //     dispatchAssistantAction(event?.command);
  //   })
  // }, [])

  const handleAssistantDataEventSmartAppData = (event) => {
    console.log('AssistantWrapper.handleAssistantEventSmartAppData: event:', event);

    if (event.sub !== undefined) {
      // this.emit('event-sub', event.sub);
      // /*await*/ this._App.handleAssistantSub(event.sub);
    }

    const action = event.action;
    dispatchAssistantAction(action);
  }

  const handleAssistantDataEvent = (event) => {
    switch (event?.type) {
      case "character":
        // notify(event.type);
        setCharacter(event.character?.id)
        break;
      case "sdk_answer":
        // notify(event.type);
        handleAssistantDataEventSmartAppData(event);
        break;

      case "smart_app_data":
        // notify(event.type);
        handleAssistantDataEventSmartAppData(event);
        break

      default:
        break
    }
  }

  function dispatchAssistantAction(action){
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'learn_quotes':
          return  learn_Quotes(action);
        case 'close_modal_window':
          return closeModalWindow(action);
        case 'choose_theme':
          return chooseTheme(action);
        case 'return_menu':
          return returnMenu(action);
        case 'attemptToQuiz':
          return attemptToQuiz();
        // case 'closeModalForQuiz':
        //   return closeModalQuiz();
        case 'Answer':
          return checkAnsw(action);
        case 'Next':
          return NextQuest(action);
        case 'MenuAfterGame':
          return MenuAfterGame(action);
        case 'ScaleQuote':
          return ScaleQuote(action);
        case 'CloseModalQuote':
          return closeModalQuote();
        case 'showRes':
          return showRes();
        default:
          throw new Error();
      }
    }
  }

  function showRes(){
    setModalRes(true);
  }

  function closeModalQuote(){
    const afterPhrase = scale.map((o, index) => {
      return {...o, status: false, id: index}
    })
    setScale(afterPhrase);
  }

  function ScaleQuote(action){
    const id = parseInt(action.id, 10);
    const afterPhrase = scale.map((o, index) => {
      if(id - 1 === index){
        return {...o, status: true, id: index}
      }
      else{
        return {...o, status: false, id: index}
      }
    })
    setScale(afterPhrase);
  }

  function MenuAfterGame(action){
    setMenu(true);
  }

  function NextQuest(action){
    setNext(true);
  }

  function checkAnsw(action){
    switch(action.id){
      case "1":
        setAnsw(1);
        break;
      case "2":
        setAnsw(2);
        break;
      case "3":
        setAnsw(3);
        break;
      case "4":
        setAnsw(4);
        break;
      default:
        return console.log("hello");
    }
  }

  function closeModalQuiz(){
    setStateModalQuiz(false);
  }

  function attemptToQuiz(){
    setStateModalQuiz(true);
  }

  function returnMenu(action){
    setMenuState(true);
  }

  function chooseTheme(action){
    if(action.id === '1' || action.id === 'Человек' || action.id === 'человек'){
      const res = scale.map((o, index) => {
          return {...o, status: false, id: index};
      });
      setScale(res);
      setAssistantGenre("human");
    }
    else if(action.id === '2' || action.id === 'Жизнь' || action.id === 'жизнь'){
      const res = scale.map((o, index) => {
          return {...o, status: false, id: index};
      });
      setScale(res);
      setAssistantGenre("peace");
    }
    else if(action.id === '3' || action.id === 'Мотивация' || action.id === 'мотивация'){
      const res = scale.map((o, index) => {
          return {...o, status: false, id: index};
      });
      setScale(res);
      setAssistantGenre("motivation");
    }
  }

  function learn_Quotes(action) {
    setModalState(true);
  }

  function closeModalWindow(action){
    setModalState(false);
    setStateModalQuiz(false);    
  }

  function assistant_global(n, state) {
    console.log(n, state)
    assistantRef.current.sendData({
      action: {
        action_id: state,
        parameters: {
          number: n
        }
      }
    })
  }

  return (
    <GenreContext.Provider value={{
      genre,
      setGenre
    }}>
      <AppRoutes/>
    </GenreContext.Provider>
  );
}

export default App;
