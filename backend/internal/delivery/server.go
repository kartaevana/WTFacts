package delivery

import (
	"WTFacts/cmd/docs"
	"WTFacts/internal/delivery/handlers" // Импортируем пакет с хэндлерами
	"WTFacts/internal/delivery/middleware"
	factRepoImpl "WTFacts/internal/repository/fact" // Имплементация репозитория
	factServiceImpl "WTFacts/internal/service/fact" // Имплементация сервиса
	"WTFacts/pkg/log"                               // Ваш пакет логгера
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx" // Для работы с БД
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"os" // Для чтения переменной окружения SBER_SALUT_ENDPOINT_PATH
)

func Start(db *sqlx.DB, appLogger *log.Logs) {
	r := gin.Default()
	r.ForwardedByClientIP = true
	docs.SwaggerInfo.BasePath = "/"
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	middlewareStruct := middleware.InitMiddleware(appLogger) // Инициализация middleware
	r.Use(middlewareStruct.CORSMiddleware())                 // Использование CORS middleware
	factRepo := factRepoImpl.InitFactRepository(db)

	// Инициализация сервиса фактов (передаем репозиторий и ваш логгер)
	factService := factServiceImpl.InitFactService(factRepo, appLogger) // appLogger - ваш логгер из pkg/log

	// Инициализация СТАНДАРТНОГО хэндлера для ручки /facts/random (если она нужна ДРУГИМ клиентам, кроме Салюта)
	factApiHandler := handlers.InitFactHandler(factService)
	factRouter := r.Group("/facts")
	factRouter.GET("/random", factApiHandler.GetRandom) // Регистрируем вашу ручку /facts/random GET

	// --- Инициализация и регистрация НОВОГО хэндлера для СберСалют ---
	// Создаем экземпляр нового SberSalut хэндлера, передавая сервис фактов
	// Передайте сюда ваш логгер, если он нужен в SberSalutHandler
	sberSalutHandler := handlers.InitSberSalutHandler(factService /*, appLogger */)

	// Получаем путь Endpoint URL для Салют из переменной окружения (или задайте явно)
	sberSalutEndpointPath := os.Getenv("SBER_SALUT_ENDPOINT_PATH")
	if sberSalutEndpointPath == "" {
		sberSalutEndpointPath = "/sber_salut"                                                    // Путь по умолчанию
		fmt.Printf("SBER_SALUT_ENDPOINT_PATH not set, using default: %s", sberSalutEndpointPath) // Используем ваш логгер
	}

	// Регистрируем НОВЫЙ хэндлер для SberSalut на его Endpoint URL
	// Салют отправляет POST запросы на этот URL
	fmt.Printf("Registering SberSalut handler on path: %s", sberSalutEndpointPath) // Используем ваш логгер
	// Gin.WrapH не нужен, т.к. наш HandleRequest уже принимает *gin.Context
	r.POST(sberSalutEndpointPath, sberSalutHandler.HandleRequest) // Наш метод HandleRequest в SberSalutHandler уже принимает *gin.Context

	// --- Запуск HTTP сервера ---
	listenPort := os.Getenv("PORT")
	if listenPort == "" {
		listenPort = "8080" // Порт по умолчанию
	}
	listenAddress := ":" + listenPort

	fmt.Printf("Starting HTTP server on %s", listenAddress) // Используем ваш логгер
	if err := r.Run(listenAddress); err != nil {            // Запускаем Gin роутер
		fmt.Errorf("FATAL: Failed to start HTTP server: %v", err) // Используем ваш логгер
	}
}
