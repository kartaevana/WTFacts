package main

import (
	"WTFacts/internal/delivery"
	"WTFacts/pkg/config"
	"WTFacts/pkg/database"
	"WTFacts/pkg/log"
)

func main() {
	log, loggerInfoFile, loggerErrorFile := log.InitLogger()

	defer loggerInfoFile.Close()
	defer loggerErrorFile.Close()

	config.InitConfig()
	log.Info("Config initialized")

	db := database.GetDB()
	log.Info("Database initialized")

	delivery.Start(db, log)
}
