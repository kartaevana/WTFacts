package config

import (
	"fmt"
	"github.com/spf13/viper"
	// os и filepath больше не нужны
)

const (
	DBName     = "DB_NAME"
	DBUser     = "DB_USER"
	DBPassword = "DB_PASSWORD"
	DBHost     = "DB_HOST"
	DBPort     = "DB_PORT"

	// ... (остальные константы) ...
)

func InitConfig() {
	viper.SetConfigName(".env") // Ищем файл с именем ".env"
	viper.SetConfigType("env")  // В формате env

	// --- ДОБАВЬТЕ ЭТУ СТРОКУ ---
	// Указываем Viper'у искать файл в текущем рабочем каталоге (который в контейнере /app)
	viper.AddConfigPath(".")
	// --- КОНЕЦ ДОБАВЛЕНИЯ ---

	viper.AutomaticEnv() // Считываем переменные окружения, которые переопределяют значения из .env

	err := viper.ReadInConfig() // Пытаемся прочитать файл конфигурации
	if err != nil {
		// Если файл не найден (или другая ошибка), паникуем с деталями
		panic(fmt.Sprintf("Failed to init config. Error:%v", err.Error()))
	}
}
