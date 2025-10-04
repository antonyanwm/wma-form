# Настройка WMA Form с Storybook

## Установка зависимостей

Из-за возможных проблем с правами доступа в Windows, выполните установку в следующем порядке:

### 1. Очистка кэша npm

```bash
npm cache clean --force
```

### 2. Удаление node_modules (если есть)

```bash
rm -rf node_modules
# или в Windows:
rmdir /s node_modules
```

### 3. Установка зависимостей

```bash
npm install --legacy-peer-deps
```

### 4. Если проблемы продолжаются, попробуйте:

```bash
npm install --no-optional --legacy-peer-deps
```

## Запуск Storybook

После успешной установки:

```bash
# Запуск Storybook
npm run storybook

# Сборка статической версии
npm run build-storybook
```

## Альтернативная установка

Если проблемы с npm persist, попробуйте yarn:

```bash
# Установка yarn (если не установлен)
npm install -g yarn

# Установка зависимостей
yarn install

# Запуск Storybook
yarn storybook
```

## Структура Storybook

После установки у вас будет:

```
wma-form/
├── .storybook/
│   ├── main.ts          # Конфигурация Storybook
│   └── preview.ts       # Глобальные настройки
├── src/
│   └── stories/
│       ├── SelectSearch.stories.tsx
│       ├── Form.stories.tsx
│       └── BaseInput.stories.tsx
└── STORYBOOK.md         # Документация Storybook
```

## Доступные Stories

### SelectSearch

-   Default - Базовый селект
-   Multiple - Множественный выбор
-   WithSearch - Поиск по опциям
-   Disabled - Отключенное состояние
-   WithValidation - С валидацией
-   HideInput - Только дропдаун
-   HideSelectedFromDropdown - Скрыть выбранные
-   ExternalControl - Внешнее управление
-   AsyncLoading - Асинхронная загрузка

### Form

-   SimpleForm - Простая форма
-   FormWithValidation - С валидацией
-   FormWithMultipleSelect - С множественным выбором
-   FormWithRadioGroup - С радио-группой

### BaseInput

-   Default - Базовое поле
-   Email - Email поле
-   Password - Поле пароля
-   Number - Числовое поле
-   Disabled - Отключенное поле
-   WithValidation - С валидацией
-   WithLengthLimit - С ограничением длины
-   Phone - Поле телефона
-   URL - Поле URL

## Публикация пакета

```bash
# Сборка библиотеки
npm run build

# Публикация (требует npm login)
npm publish
```

## Troubleshooting

### Проблема с правами доступа

-   Запустите терминал от имени администратора
-   Отключите антивирус на время установки
-   Закройте все редакторы кода

### Конфликты версий

-   Используйте `--legacy-peer-deps`
-   Или обновите Node.js до последней версии

### Проблемы с Storybook

-   Убедитесь, что все зависимости установлены
-   Проверьте версии React и TypeScript
-   Очистите кэш: `npm cache clean --force`

