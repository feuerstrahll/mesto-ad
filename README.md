# Mesto

Интерактивный фронтенд-проект с профилем пользователя, карточками мест и работой с API `mesto.nomoreparties.co`.

Ссылка на опубликованный проект:
`https://feuerstrahll.github.io/mesto-production/`

## Технологии

- HTML
- CSS
- JavaScript
- Vite
- GitHub Actions

## Локальный запуск

Установить зависимости:

```bash
npm install
```

Запустить локальный сервер разработки:

```bash
npm run dev
```

Собрать проект:

```bash
npm run build
```

Открыть локальный preview собранной версии:

```bash
npm run preview
```

## Публикация

Публикация выполняется через GitHub Actions из файла `.github/workflows/deploy.yml`.
После коммита и пуша в `master` workflow собирает проект и отправляет `dist` в публичный репозиторий GitHub Pages.

Команды публикации:

```bash
git add .
git commit -m "Update project"
git push origin master
```
