package models

// SberSalutResponse - Корневая структура ответа для СберСалют API
type SberSalutResponse struct {
	Message          Message           `json:"message"`
	Action           *Action           `json:"action,omitempty"`
	SessionState     *SessionState     `json:"session_state,omitempty"`
	ApplicationState *ApplicationState `json:"application_state,omitempty"`
	Version          string            `json:"version"` // Должна быть "1.0"
}

type Message struct {
	Text   string        `json:"text"`
	Speech string        `json:"speech"`
	Items  []interface{} `json:"items,omitempty"` // Карточки и т.п.
}

type Action struct {
	Type    string                 `json:"type"`
	Payload map[string]interface{} `json:"payload,omitempty"`
}

// SessionState - Структура для session_state (если управляете)
type SessionState struct {
	// Ваши поля состояния сессии
}

// ApplicationState - Структура для application_state (если управляете)
type ApplicationState struct {
	// Ваши поля состояния приложения
}

//type Fact struct {
//	ID   int    `json:"ID"`
//	Name string `json:"name"`
//	Fact string `json:"fact"`
//}
