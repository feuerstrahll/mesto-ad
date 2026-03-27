# Mesto

Интерактивный фронтенд-проект с профилем пользователя, карточками мест и интеграцией с API `mesto.nomoreparties.co`.

## Ссылка на проект

[GitHub Pages: mesto-production](https://feuerstrahll.github.io/mesto-production/)

## Технологии

- HTML
- CSS
- JavaScript
- Vite
- GitHub Actions

## Запуск проекта

Установка зависимостей:

```bash
npm install
```

Запуск локального сервера разработки:

```bash
npm run dev
```

Сборка проекта:

```bash
npm run build
```

Локальный preview собранной версии:

```bash
npm run preview
```

## Публикация

Публикация выполняется через GitHub Actions из файла `.github/workflows/deploy.yml`.
После коммита и пуша в ветку `master` workflow собирает проект и публикует содержимое `dist` в публичный репозиторий GitHub Pages.

Команды публикации:

```bash
git add .
git commit -m "Update project"
git push origin master
```
