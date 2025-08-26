#!/bin/bash

# Скрипт для автоматической сборки и деплоя Next.js проекта ssrSqlite с Windows (WSL или Git Bash) на сервер с pm2

# Переменные
LOCAL_PROJECT_PATH="/c/Users/e4e5c/OneDrive/Рабочий стол/ssrSqlite"
REMOTE_USER="root"
REMOTE_HOST="109.172.37.134"
REMOTE_PATH="/var/www/html"
PM2_PROCESS_NAME="pwaArcope"

echo "Сборка проекта..."
cd "$LOCAL_PROJECT_PATH" || { echo "Ошибка: не удалось перейти в каталог проекта"; exit 1; }
# npm install пропущен, чтобы не обновлять зависимости без необходимости
npm run build

echo "Удаление кеша и старой сборки на сервере..."
ssh "$REMOTE_USER@$REMOTE_HOST" "rm -rf $REMOTE_PATH/.next"

echo "Синхронизация файлов с сервером..."
scp -r "$LOCAL_PROJECT_PATH/.next" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
# Исключения для папки imgpwa удалены
rsync -av "$LOCAL_PROJECT_PATH/public" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/public"
# Исключаем локальную базу данных из деплоя
rsync -av --exclude='var/www/db/dev.db' --exclude='var/www/db/' "$LOCAL_PROJECT_PATH/prisma" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/prisma"
scp "$LOCAL_PROJECT_PATH/package.json" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
scp "$LOCAL_PROJECT_PATH/package-lock.json" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
scp "$LOCAL_PROJECT_PATH/ecosystem.config.js" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo "Установка зависимостей на сервере..."
ssh "$REMOTE_USER@$REMOTE_HOST" "cd $REMOTE_PATH && npm install --legacy-peer-deps"


echo "Перезапуск pm2 процесса на сервере с использованием ecosystem.config.js..."
ssh "$REMOTE_USER@$REMOTE_HOST" "pm2 delete $PM2_PROCESS_NAME || true; pm2 start $REMOTE_PATH/ecosystem.config.js --only $PM2_PROCESS_NAME"

echo "Деплой завершен."