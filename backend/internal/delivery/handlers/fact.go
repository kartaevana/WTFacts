package handlers

import (
	"WTFacts/internal/service"
	"context"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type FactHandler struct {
	service service.FactServ
}

func InitFactHandler(service service.FactServ) *FactHandler { // Возвращаем указатель
	return &FactHandler{
		service: service,
	}
}

// @Summary Get random fact
// @Tags facts
// @Produce json
// @Success 200 {object} models.Fact "Random fact"
// @Failure 404 {object} map[string]string "No facts available"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /facts/random [get]
func (h *FactHandler) GetRandom(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second) // Используем контекст запроса
	defer cancel()

	fact, err := h.service.GetRandom(ctx)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, fact)
}
