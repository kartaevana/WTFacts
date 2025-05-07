FROM golang:latest

WORKDIR /app

# 1. Копируем зависимости из родительской директории
COPY backend/go.mod backend/go.sum ./

# 2. Устанавливаем зависимости
RUN go mod download

# 3. Копируем исходный код
COPY backend/cmd ./cmd
COPY backend/internal ./internal
COPY backend/pkg ./pkg
COPY backend/deploy/.env /app/.env

# 4. Собираем приложение
RUN go build -o app cmd/main.go && \
    chmod +x app

EXPOSE 8080

CMD ["./app"]