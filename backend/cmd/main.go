package main

import (
	"WTFacts/internal/delivery"
	"WTFacts/pkg/config"
	"WTFacts/pkg/database"
	"WTFacts/pkg/log" // Убедитесь, что импорт правильный, если он не WTFacts/pkg/log
)

func main() {
	log := log.InitLogger()

	config.InitConfig()
	log.Info("Config initialized")

	db := database.GetDB()
	log.Info("Database initialized")

	delivery.Start(db, log)
}
