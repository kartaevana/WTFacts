FROM node:18-alpine

WORKDIR /app

# 1. Копируем зависимости
COPY package.json package-lock.json ./

# 2. Устанавливаем зависимости с исправлением проблем
RUN npm install --legacy-peer-deps && \
    npm install @babel/plugin-proposal-private-property-in-object --save-dev

# 3. Копируем исходный код
COPY . .

# 4. Собираем проект
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]