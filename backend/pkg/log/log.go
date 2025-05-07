package log

import (
	"github.com/rs/zerolog"
	"os"
	"time"
)

type Logs struct {
	infoLogger  *zerolog.Logger
	errorLogger *zerolog.Logger
}

func (l *Logs) Info(s string) {
	l.infoLogger.Info().Msg(s)
}

func (l *Logs) Error(s string) {
	l.errorLogger.Error().Msg(s)
}

func UnitFormatter() {
	zerolog.TimestampFunc = func() time.Time {
		format := "2006-01-02 15:04:05"
		timeString := time.Now().Format(format)
		timeFormatted, _ := time.Parse(format, timeString)
		return timeFormatted
	}
}

func InitLogger() *Logs { // Теперь функция возвращает только *Logs, так как файловые дескрипторы не нужны снаружи
	UnitFormatter()

	// Используем os.Stdout для информационных логов
	infoLogger := zerolog.New(os.Stdout).With().Timestamp().Caller().Logger()

	// Используем os.Stderr для логов ошибок
	errorLogger := zerolog.New(os.Stderr).With().Timestamp().Caller().Logger()

	log := &Logs{
		infoLogger:  &infoLogger,
		errorLogger: &errorLogger,
	}

	// Больше нет необходимости возвращать файловые дескрипторы,
	// так как мы не открываем файлы, которые нужно закрывать.
	return log
}
