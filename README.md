# WMA Form Library

React компонентная библиотека для форм с валидацией и управлением состоянием.

## Структура проекта

```
package-component/
├── package.json          # Корневой package.json с workspaces
├── turbo.json           # Конфигурация Turborepo
├── tsconfig.json        # Корневой TypeScript config
├── wma-form/            # Основная библиотека
│   ├── package.json     # Конфигурация пакета
│   ├── tsconfig.json    # TypeScript config пакета
│   ├── rollup.config.mjs # Конфигурация сборки
│   ├── jest.config.js   # Конфигурация тестов
│   ├── dist/            # Собранные файлы
│   └── components/      # React компоненты
└── example/             # Пример приложения
    ├── package.json
    ├── vite.config.ts
    └── src/
```

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Сборка библиотеки

```bash
cd wma-form
npm run build
```

### 3. Запуск примера

```bash
cd example
npm run dev
```

### 4. Запуск Storybook

```bash
cd wma-form
npm run storybook
```

Storybook будет доступен по адресу: http://localhost:6006

## Доступные команды

### В корне проекта:

-   `npm run build` - Собрать все пакеты
-   `npm run dev` - Запустить dev режим
-   `npm run lint` - Линтинг
-   `npm run test` - Тесты
-   `npm run type-check` - Проверка типов

### В папке wma-form:

-   `npm run build` - Собрать только wma-form
-   `npm run dev` - Dev режим с watch
-   `npm run test` - Запустить тесты
-   `npm run lint` - Линтинг
-   `npm run type-check` - Проверка типов
-   `npm run storybook` - Запустить Storybook
-   `npm run build-storybook` - Собрать статическую версию Storybook

## Компоненты

-   **Form** - Основной компонент формы
-   **BaseInput** - Базовый input компонент
-   **FormCheckbox** - Чекбокс для форм
-   **FormRadioGroup** - Группа радио кнопок
-   **FormSelectSearch** - Поисковый селект
-   **FormProvider** - Провайдер контекста формы

## Хуки

-   **useFormStatus** - Хук для получения статуса формы
-   **useTranslation** - Хук для переводов
-   **useFormStore** - Хук для работы с состоянием формы

## Пример использования

```tsx
import { Form, FormProvider, BaseInput, FormCheckbox } from 'wma-form';

function MyForm() {
	const handleSubmit = (data) => {
		console.log('Form data:', data);
	};

	return (
		<FormProvider>
			<Form onSubmit={handleSubmit}>
				<BaseInput
					name='name'
					type='text'
					placeholder='Name'
					required
				/>
				<BaseInput
					name='email'
					type='email'
					placeholder='Email'
					required
				/>
				<FormCheckbox
					name='newsletter'
					label='Subscribe to newsletter'
				/>
				<button type='submit'>Submit</button>
			</Form>
		</FormProvider>
	);
}
```

## Storybook

Проект включает Storybook для демонстрации и тестирования компонентов:

-   **SelectSearch** - Все варианты селекта с поиском
-   **Form** - Примеры форм с валидацией
-   **BaseInput** - Различные типы полей ввода
-   **Интерактивные контролы** - Настройка пропсов в реальном времени
-   **Автодокументация** - Автоматическая генерация документации

Подробнее см. [STORYBOOK.md](./wma-form/STORYBOOK.md)

## Публикация пакета

```bash
cd wma-form
npm run build
npm publish
```

## Технологии

-   React 18+
-   TypeScript
-   Zustand (управление состоянием)
-   Rollup (сборка)
-   Jest (тестирование)
-   ESLint (линтинг)
-   Storybook (документация и демо)
-   Turborepo (монорепозиторий)
