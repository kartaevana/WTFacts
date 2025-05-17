package handlers // В вашем пакете handlers

import (
	"context"
	"log" // Используем стандартный log для простоты
	"net/http"
	"time" // Для контекста с таймаутом

	"WTFacts/internal/models"  // <-- Убедитесь, что путь к вашим моделям верный
	"WTFacts/internal/service" // <-- Импортируем ваш сервисный пакет

	"github.com/gin-gonic/gin" // Используем Gin, так как у вас сервер на нем
)

// SberSalutHandler - Структура хэндлера для запросов от СберСалют
type SberSalutHandler struct {
	FactService service.FactServ
}

// InitSberSalutHandler - Конструктор для SberSalutHandler
func InitSberSalutHandler(factService service.FactServ /*, appLogger *WTFacts/pkg/log.Logs */) *SberSalutHandler {
	if factService == nil {
		log.Fatal("FactService cannot be nil for the SberSalut handler")
	}
	return &SberSalutHandler{FactService: factService}
}

// HandleRequest - Метод обработки запросов от СберСалют
func (h *SberSalutHandler) HandleRequest(c *gin.Context) {
	c.Header("Content-Type", "application/json; charset=utf-8")

	// Входящий запрос от Салют - это POST JSON.
	// В будущем можно парсить входящий запрос (например, чтобы узнать интент или действие с кнопки),
	// но для минимальной реализации просто всегда получаем случайный факт.
	// var ssReq models.SberSalutRequest // Определите эту структуру в models/sbersalut.go
	// if err := c.ShouldBindJSON(&ssReq); err != nil {
	// 	log.Printf("Handler: Error decoding incoming SberSalut request: %v", err)
	// 	errorResp := models.SberSalutResponse{ Message: models.Message{Text: "Ошибка парсинга запроса."}, Version: "1.0" }
	// 	c.JSON(http.StatusBadRequest, errorResp)
	// 	return
	// }
	// log.Printf("Handler: Received SberSalut request: %+v", ssReq)

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second) // Таймаут на запрос к сервису/БД
	defer cancel()

	log.Println("Handler: Calling FactService.GetRandom")
	fact, err := h.FactService.GetRandom(ctx)
	if err != nil {
		log.Printf("Handler: Error getting fact from service: %v", err)
		errorResp := models.SberSalutResponse{ // Используем структуры ответа Салют из models
			Message: models.Message{
				Speech: "Извините, не удалось получить факт из базы.",
				Text:   "Извините, не удалось получить факт из базы.",
			},
			Version: "1.0", // Важно
		}
		c.JSON(http.StatusOK, errorResp)
		return
	}

	log.Printf("Handler: Successfully got fact from service: %+v", fact)

	sberSalutResponse := models.SberSalutResponse{
		Message: models.Message{
			Speech: "Вот факт: " + fact.Fact,
			Text:   "Вот факт: " + fact.Fact,
		},
		Action: &models.Action{
			Type: "show_fact",
			Payload: map[string]interface{}{
				"factId":   fact.ID,
				"factText": fact.Fact,
				"factName": fact.Name,
			},
		},
		Version: "1.0",
	}

	log.Printf("Handler: Prepared SberSalut response with Action for fact ID: %d", fact.ID)
	c.JSON(http.StatusOK, sberSalutResponse)
	log.Println("Handler: SberSalut response sent successfully.")
}
