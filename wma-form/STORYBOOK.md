# WMA Form - Storybook

Этот проект использует Storybook для демонстрации и тестирования компонентов библиотеки `wma-form`.

## Запуск Storybook

```bash
# Установка зависимостей
npm install

# Запуск Storybook в режиме разработки
npm run storybook

# Сборка статической версии Storybook
npm run build-storybook
```

Storybook будет доступен по адресу: http://localhost:6006

## Структура Stories

### Components/SelectSearch

-   **Default** - Базовый пример селекта
-   **Multiple** - Множественный выбор
-   **WithSearch** - Поиск по опциям
-   **Disabled** - Отключенное состояние
-   **WithValidation** - С валидацией
-   **HideInput** - Только дропдаун
-   **HideSelectedFromDropdown** - Скрыть выбранные из дропдауна
-   **ExternalControl** - Внешнее управление
-   **AsyncLoading** - Асинхронная загрузка опций

### Components/Form

-   **SimpleForm** - Простая форма
-   **FormWithValidation** - Форма с валидацией
-   **FormWithMultipleSelect** - Форма с множественным выбором
-   **FormWithRadioGroup** - Форма с радио-группой

### Components/BaseInput

-   **Default** - Базовое поле ввода
-   **Email** - Email поле
-   **Password** - Поле пароля
-   **Number** - Числовое поле
-   **Disabled** - Отключенное поле
-   **WithValidation** - С валидацией
-   **WithLengthLimit** - С ограничением длины
-   **Phone** - Поле телефона
-   **URL** - Поле URL

## Особенности

-   Все компоненты обернуты в `Form` для корректной работы
-   Поддержка интерактивных контролов
-   Автоматическая генерация документации
-   Примеры валидации и внешнего управления
-   Демонстрация всех возможностей компонентов

## Разработка

При добавлении новых компонентов создавайте соответствующие `.stories.tsx` файлы в папке `src/stories/`.

Пример структуры story:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from '../components/YourComponent';

const meta: Meta<typeof YourComponent> = {
	title: 'Components/YourComponent',
	component: YourComponent,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
	args: {
		// props
	},
};
```

