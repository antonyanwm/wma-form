# SelectSearch - Универсальный компонент селекта с поиском

## 📋 Содержание

-   [Обзор](#обзор)
-   [Установка](#установка)
-   [Базовое использование](#базовое-использование)
-   [API Reference](#api-reference)
-   [Примеры использования](#примеры-использования)
-   [Хуки](#хуки)
-   [Стилизация](#стилизация)
-   [Типы](#типы)
-   [Внешнее управление](#внешнее-управление)
-   [Лучшие практики](#лучшие-практики)
-   [Troubleshooting](#troubleshooting)

## 🎯 Обзор

`SelectSearch` - это универсальный компонент селекта с поиском, который поддерживает:

-   🔍 **Поиск и фильтрация** опций по введенному тексту
-   🎯 **Одиночный и множественный выбор** с настраиваемым поведением
-   ⚡ **Асинхронная загрузка** данных с кэшированием
-   🎛️ **Внешнее управление** через API хуки
-   📱 **Адаптивность** и доступность (a11y)
-   🎨 **Кастомизация** стилей и поведения
-   ⌨️ **Клавиатурная навигация** (стрелки, Enter, Escape, Tab)
-   🏷️ **Теги** для множественного выбора с overflow

## 📦 Установка

```bash
npm install wma-form
```

```tsx
import { SelectSearch, Form } from 'wma-form';
```

## 🚀 Базовое использование

### Простой селект

```tsx
import { SelectSearch, Form } from 'wma-form';

const options = [
	{ label: 'JavaScript', value: 'js' },
	{ label: 'TypeScript', value: 'ts' },
	{ label: 'Python', value: 'py' },
];

function App() {
	return (
		<Form
			formId='my-form'
			onValidSubmit={(data) => console.log(data)}>
			<SelectSearch
				formId='my-form'
				name='language'
				label='Выберите язык программирования'
				options={options}
				required={true}
			/>
		</Form>
	);
}
```

### Множественный выбор

```tsx
<SelectSearch
	formId='my-form'
	name='languages'
	label='Выберите языки программирования'
	options={options}
	multiple={true}
	maxVisibleItems={3}
	allowBackspaceDelete={true}
	hideSelectedFromDropdown={true}
/>
```

### Асинхронная загрузка

```tsx
const loadOptions = async (query: string) => {
	const response = await fetch(`/api/search?q=${query}`);
	const data = await response.json();
	return data.map((item) => ({
		label: item.name,
		value: item.id,
	}));
};

<SelectSearch
	formId='my-form'
	name='users'
	label='Поиск пользователей'
	loadOptions={loadOptions}
	debounceMs={300}
	visibleCount={10}
/>;
```

## 📚 API Reference

### Props

| Prop                       | Тип                                    | По умолчанию | Описание                       |
| -------------------------- | -------------------------------------- | ------------ | ------------------------------ |
| `formId`                   | `string`                               | -            | **Обязательный.** ID формы     |
| `name`                     | `string`                               | -            | **Обязательный.** Имя поля     |
| `label`                    | `string`                               | -            | **Обязательный.** Подпись поля |
| `options`                  | `Option[]`                             | -            | Статические опции              |
| `loadOptions`              | `(query: string) => Promise<Option[]>` | -            | Функция асинхронной загрузки   |
| `multiple`                 | `boolean`                              | `false`      | Режим множественного выбора    |
| `placeholder`              | `boolean \| string`                    | `true`       | Плейсхолдер                    |
| `required`                 | `boolean`                              | `true`       | Обязательное поле              |
| `disabled`                 | `boolean`                              | `false`      | Отключенное состояние          |
| `className`                | `string`                               | `''`         | Дополнительные CSS классы      |
| `validator`                | `Function`                             | -            | Функция валидации              |
| `initialValue`             | `string \| string[]`                   | `''`         | Начальное значение             |
| `visibleCount`             | `number`                               | `Infinity`   | Количество видимых опций       |
| `hideInput`                | `boolean`                              | `false`      | Скрыть поле ввода              |
| `debounceMs`               | `number`                               | `250`        | Задержка поиска (мс)           |
| `hideErrorOnFocus`         | `boolean`                              | `true`       | Скрывать ошибку при фокусе     |
| `icon`                     | `string`                               | -            | Иконка для поля                |
| `maxVisibleItems`          | `number`                               | `3`          | Макс. видимых тегов (multiple) |
| `allowBackspaceDelete`     | `boolean`                              | `false`      | Удаление через Backspace       |
| `hideSelectedFromDropdown` | `boolean`                              | `false`      | Скрыть выбранные из дропдауна  |
| `hideClearButton`          | `boolean`                              | `false`      | Скрыть кнопку очистки          |

### Типы

```tsx
interface Option {
	label: string;
	value: string | number;
	[key: string]: any;
}

interface SelectSearchProps {
	// Обязательные пропсы
	formId: string;
	name: string;
	label: string;

	// Данные
	options?: Option[];
	loadOptions?: (input: string) => Promise<Option[]>;

	// Поведение
	multiple?: boolean;
	placeholder?: boolean | string;
	required?: boolean;
	disabled?: boolean;

	// Валидация
	validator?: ({ value, name, opts }: { value: string; name?: string; opts?: any }) => string;

	// Начальные значения
	initialValue?: string | string[];

	// UI настройки
	className?: string;
	icon?: string;
	visibleCount?: number;
	hideInput?: boolean;
	debounceMs?: number;
	hideErrorOnFocus?: boolean;

	// Множественный выбор
	maxVisibleItems?: number;
	allowBackspaceDelete?: boolean;
	hideSelectedFromDropdown?: boolean;
	hideClearButton?: boolean;
}
```

## 💡 Примеры использования

### 1. Простой селект с валидацией

```tsx
const validator = ({ value }) => {
	if (!value) return 'Поле обязательно для заполнения';
	return '';
};

<SelectSearch
	formId='form'
	name='country'
	label='Страна'
	options={countries}
	validator={validator}
	required={true}
/>;
```

### 2. Множественный выбор с кастомными настройками

```tsx
<SelectSearch
	formId='form'
	name='skills'
	label='Навыки'
	options={skills}
	multiple={true}
	maxVisibleItems={2}
	allowBackspaceDelete={true}
	hideSelectedFromDropdown={true}
	placeholder='Выберите навыки...'
/>
```

### 3. Асинхронный поиск с кэшированием

```tsx
const searchUsers = async (query: string) => {
	if (!query.trim()) return [];

	const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
	const users = await response.json();

	return users.map((user) => ({
		label: `${user.name} (${user.email})`,
		value: user.id,
		avatar: user.avatar,
	}));
};

<SelectSearch
	formId='form'
	name='assignee'
	label='Назначить пользователя'
	loadOptions={searchUsers}
	debounceMs={500}
	visibleCount={8}
	placeholder='Начните вводить имя...'
/>;
```

### 4. Селект без поля ввода (только клик)

```tsx
<SelectSearch
	formId='form'
	name='status'
	label='Статус'
	options={statusOptions}
	hideInput={true}
	placeholder='Выберите статус'
/>
```

### 5. Селект с иконкой и кастомными стилями

```tsx
<SelectSearch
	formId='form'
	name='category'
	label='Категория'
	options={categories}
	icon='📁'
	className='custom-select'
	placeholder='Выберите категорию'
/>
```

## 🎣 Хуки

### useSelectExternalControl

Хук для внешнего управления компонентом:

```tsx
import { useSelectExternalControl } from 'wma-form';

function MyComponent() {
	const {
		// Основные методы
		selectByValue,
		clearAll,
		openDropdown,
		closeDropdown,
		setSearchQuery,

		// Получение данных
		getSelectedValues,
		getSelectedCount,
		hasSelectedValues,
		getFieldState,
		isOptionSelected,

		// Управление фокусом
		focusField,
		blurField,

		// Валидация
		validateField,
		markAsTouched,

		// Дополнительные методы
		selectMultiple,
		removeOption,
		getCurrentQuery,
		isDropdownOpen,
	} = useSelectExternalControl({
		formId: 'my-form',
		name: 'my-select',
		multiple: false,
		options: myOptions,
	});

	return (
		<div>
			<SelectSearch
				formId='my-form'
				name='my-select'
				label='My Select'
				options={myOptions}
			/>

			<button onClick={() => selectByValue('js')}>Выбрать JavaScript</button>
			<button onClick={() => clearAll()}>Очистить все</button>
		</div>
	);
}
```

### Другие хуки

```tsx
// Управление состоянием поля
import { useSelectStoreField } from './hooks/useSelectStoreField';

// Загрузка опций
import { useOptionsLoader } from './hooks/useOptionsLoader';

// Управление дропдауном
import { useDropdownManager } from './hooks/useDropdownManager';

// Обработчики событий
import { useSelectHandlers } from './hooks/useSelectHandlers';

// Позиционирование дропдауна
import { useDropdownPosition } from './hooks/useDropdownPosition';

// Доступность
import { useSelectAccessibility } from './hooks/useSelectAccessibility';
```

## 🎨 Стилизация

### CSS переменные

Компонент использует CSS переменные для кастомизации:

```css
:root {
	/* Цвета дропдауна */
	--background-color-select-search-dropdown: #ffffff;
	--border-color-select-search-dropdown: #e0e0e0;
	--color-select-search-dropdown-option: #333333;
	--color-select-search-dropdown-option-selected: #1976d2;

	/* Цвета тегов */
	--background-color-select-search-dropdown-tag: #1976d2;
	--color-select-search-dropdown-tag: #ffffff;

	/* Размеры */
	--font-size-option: 14px;
	--font-size-tag: 14px;
	--radius-select-search-dropdown: 8px;

	/* Отступы */
	--padding-select-search-dropdown-item-option-TB: 12px;
	--padding-select-search-dropdown-item-option-LR: 16px;
}
```

### Кастомные стили

```css
.my-custom-select .dropdown {
	border-radius: 12px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.my-custom-select .selected-tag {
	background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
	color: white;
}

.my-custom-select .dropdown-option:hover {
	background-color: #f0f8ff;
	transform: translateX(4px);
	transition: all 0.2s ease;
}
```

## 🔧 Внешнее управление

### Программный выбор опций

```tsx
const { selectByValue, getSelectedValues } = useSelectExternalControl({
	formId: 'form',
	name: 'select',
	options: myOptions,
});

// Выбрать опцию
selectByValue('js');

// Получить выбранные значения
const selected = getSelectedValues();
console.log(selected); // ['js'] или 'js'
```

### Управление дропдауном

```tsx
const { openDropdown, closeDropdown, isDropdownOpen } = useSelectExternalControl({
	formId: 'form',
	name: 'select',
	options: myOptions,
});

// Открыть/закрыть дропдаун
openDropdown();
closeDropdown();

// Проверить состояние
if (isDropdownOpen()) {
	console.log('Дропдаун открыт');
}
```

### Управление поиском

```tsx
const { setSearchQuery, getCurrentQuery } = useSelectExternalControl({
	formId: 'form',
	name: 'select',
	options: myOptions,
});

// Установить поисковый запрос
setSearchQuery('javascript');

// Получить текущий запрос
const query = getCurrentQuery();
```

## 🏆 Лучшие практики

### 1. Производительность

```tsx
// ✅ Хорошо: Мемоизация опций
const memoizedOptions = useMemo(() =>
  users.map(user => ({
    label: user.name,
    value: user.id
  })), [users]
);

// ✅ Хорошо: Дебаунс для асинхронного поиска
<SelectSearch
  loadOptions={searchUsers}
  debounceMs={300} // Оптимальная задержка
/>

// ❌ Плохо: Слишком частые запросы
<SelectSearch
  loadOptions={searchUsers}
  debounceMs={50} // Слишком быстро
/>
```

### 2. Доступность

```tsx
// ✅ Хорошо: Семантические лейблы
<SelectSearch
	label='Выберите страну проживания'
	name='country'
	required={true}
/>;

// ✅ Хорошо: Валидация с понятными сообщениями
const validator = ({ value }) => {
	if (!value) return 'Пожалуйста, выберите страну';
	return '';
};
```

### 3. UX

```tsx
// ✅ Хорошо: Понятные плейсхолдеры
<SelectSearch
  placeholder="Начните вводить название города..."
  multiple={false}
/>

// ✅ Хорошо: Ограничение видимых опций
<SelectSearch
  visibleCount={10}
  loadOptions={searchCities}
/>

// ✅ Хорошо: Скрытие выбранных в множественном выборе
<SelectSearch
  multiple={true}
  hideSelectedFromDropdown={true}
  maxVisibleItems={3}
/>
```

### 4. Обработка ошибок

```tsx
const loadOptions = async (query: string) => {
	try {
		const response = await fetch(`/api/search?q=${query}`);
		if (!response.ok) {
			throw new Error('Ошибка загрузки данных');
		}
		return await response.json();
	} catch (error) {
		console.error('Ошибка поиска:', error);
		return []; // Возвращаем пустой массив при ошибке
	}
};
```

## 🐛 Troubleshooting

### Частые проблемы

#### 1. Дропдаун не открывается

```tsx
// ❌ Проблема: Не указан formId
<SelectSearch name="select" label="Select" />

// ✅ Решение: Указать formId
<SelectSearch formId="my-form" name="select" label="Select" />
```

#### 2. Валидация не работает

```tsx
// ❌ Проблема: Валидатор не вызывается
<SelectSearch
  formId="form"
  name="select"
  label="Select"
  validator={validator}
  required={false} // Валидация не сработает
/>

// ✅ Решение: Включить required
<SelectSearch
  formId="form"
  name="select"
  label="Select"
  validator={validator}
  required={true}
/>
```

#### 3. Асинхронная загрузка не работает

```tsx
// ❌ Проблема: Неправильная сигнатура функции
const loadOptions = (query) => {
	return fetch(`/api/search?q=${query}`); // Возвращает Promise<Response>
};

// ✅ Решение: Правильная сигнатура
const loadOptions = async (query: string) => {
	const response = await fetch(`/api/search?q=${query}`);
	const data = await response.json();
	return data.map((item) => ({
		label: item.name,
		value: item.id,
	}));
};
```

#### 4. Стили не применяются

```tsx
// ❌ Проблема: CSS не импортирован
import { SelectSearch } from 'wma-form';

// ✅ Решение: Импортировать стили
import { SelectSearch } from 'wma-form';
import 'wma-form/dist/index.css';
```

#### 5. Множественный выбор не работает

```tsx
// ❌ Проблема: Не указан multiple
<SelectSearch
  formId="form"
  name="select"
  label="Select"
  options={options}
  // multiple не указан
/>

// ✅ Решение: Явно указать multiple
<SelectSearch
  formId="form"
  name="select"
  label="Select"
  options={options}
  multiple={true}
/>
```

### Отладка

```tsx
// Включить логирование
const { getFieldState, getSelectedValues } = useSelectExternalControl({
	formId: 'form',
	name: 'select',
	options: myOptions,
});

// Отслеживать изменения
useEffect(() => {
	console.log('Field state:', getFieldState());
	console.log('Selected values:', getSelectedValues());
}, [getFieldState, getSelectedValues]);
```

## 📝 Changelog

### v1.0.0

-   Первоначальный релиз
-   Поддержка одиночного и множественного выбора
-   Асинхронная загрузка данных
-   Внешнее управление через хуки
-   Полная поддержка доступности
-   Кастомизируемые стили

## 🤝 Поддержка

Если у вас есть вопросы или проблемы:

1. Проверьте [Troubleshooting](#troubleshooting)
2. Изучите примеры в [Stories](./src/stories/SelectSearch/)
3. Создайте issue в репозитории

## 📄 Лицензия

MIT License
