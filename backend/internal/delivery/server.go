package delivery

import (
	"WTFacts/cmd/docs"
	"WTFacts/internal/delivery/handlers"
	"WTFacts/internal/delivery/middleware"
	"WTFacts/internal/repository/fact"
	factserv "WTFacts/internal/service/fact"
	"WTFacts/pkg/log"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func Start(db *sqlx.DB, log *log.Logs) {
	r := gin.Default()
	r.ForwardedByClientIP = true
	docs.SwaggerInfo.BasePath = "/"
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	middlewareStruct := middleware.InitMiddleware(log)
	r.Use(middlewareStruct.CORSMiddleware())

	factRouter := r.Group("/facts")

	factRepo := fact.InitFactRepository(db)
	factService := factserv.InitFactService(factRepo, log)
	factHandler := handlers.InitFactHandler(factService)

	factRouter.GET("/random", factHandler.GetRandom)

	if err := r.Run("0.0.0.0:8080"); err != nil {
		panic(fmt.Sprintf("error running client: %v", err.Error()))
	}
}
