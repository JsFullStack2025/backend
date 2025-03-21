### VS CODE
    https://code.visualstudio.com/download

### GIT (64-bit)
    https://git-scm.com/downloads/win

### Настраиваем GIT (user and email)
    https://git-scm.com/book/ru/v2/%D0%92%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5-%D0%9F%D0%B5%D1%80%D0%B2%D0%BE%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-Git

### NODE JS  (версия 21+)
    https://nodejs.org/en/download

### Проверка (cmd)
```bash
    node -v
    npm -v
```

### POSTMAN (для отладки)
    https://www.postman.com/downloads/

### DOCKER (Обращаю внимание - требуется Win 10, 11 версии 21H2+(устанавливать на WSL, не Hyper-V) или linux)
    https://docs.docker.com/desktop/setup/install/windows-install/

### Клонируем репозиторий и делаем свою ветку
```bash
mkdir Visiteo
cd Visiteo
git clone https://github.com/JsFullStack2025/backend.git
# Проверяем статус
git status
# переходим в ветку develop
git checkout develop
# Создаем свою ветку
git checkout dev-...(название ветки)
# работаем, коммитим изменения
git add .
git commit 'Название коммита'
# пушим на сервер
git push origin dev-...(название ветки)
```

### Устанавливаем требуемые пакеты:
```bash
npm install --global yarn
# проверка: yarn -v
npm install prisma --save-dev
# Установка модулей
yarn install
```

### Запуск БД
    Копируем файл .env.example в файл .env
    Запускаем докер
```bash
docker-compose up -d // флаг -d для запуска в фоне
docker ps
```  
### Инсталлируем базы
```bash
npx prisma migrate dev --name init
# Проверяем создание баз через браузер (http://localhost:5555)
cd prisma
npx prisma studio
```

### Запуск бэка
```bash
yarn run start:dev
# Проект запустится в http://localhost:3000
```