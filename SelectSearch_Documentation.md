# SelectSearch - Полная документация

## Обзор

`SelectSearch` - это универсальный компонент селекта с поиском, который поддерживает как одиночный, так и множественный выбор, асинхронную загрузку данных и внешнее управление через API.

## Основные возможности

-   🔍 **Поиск** - фильтрация опций по введенному тексту
-   🎯 **Одиночный/множественный выбор** - настраиваемый режим выбора
-   ⚡ **Асинхронная загрузка** - динамическая подгрузка опций
-   🎛️ **Внешнее управление** - полный контроль через API
-   📱 **Адаптивность** - работает на всех устройствах
-   🎨 **Кастомизация** - настраиваемые стили и поведение
-   ♿ **Доступность** - поддержка клавиатурной навигации и screen readers
-   🏷️ **Теги** - отображение выбранных элементов в виде тегов

## Установка и импорт

```tsx
import { SelectSearch, Form } from 'wma-form';
```

## Базовое использование

### Простой селект

```tsx
import { SelectSearch, Form } from 'wma-form';

const options = [
	{ label: 'JavaScript', value: 'js' },
	{ label: 'TypeScript', value: 'ts' },
	{ label: 'Python', value: 'py' },
	{ label: 'Java', value: 'java' },
];

function MyForm() {
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

## API Reference

### Props

#### Обязательные свойства

| Prop     | Тип      | Описание                           |
| -------- | -------- | ---------------------------------- |
| `formId` | `string` | ID формы (должен совпадать с Form) |
| `name`   | `string` | Имя поля                           |
| `label`  | `string` | Подпись поля                       |

#### Основные свойства

| Prop          | Тип                                    | По умолчанию | Описание                                                                |
| ------------- | -------------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `options`     | `Option[]`                             | -            | Статический список опций                                                |
| `loadOptions` | `(input: string) => Promise<Option[]>` | -            | Функция асинхронной загрузки                                            |
| `multiple`    | `boolean`                              | `false`      | Режим множественного выбора                                             |
| `placeholder` | `boolean \| string`                    | `true`       | Плейсхолдер (true = автоматический, false = скрыть, string = кастомный) |
| `required`    | `boolean`                              | `true`       | Обязательное поле                                                       |
| `disabled`    | `boolean`                              | `false`      | Отключенное состояние                                                   |
| `className`   | `string`                               | `''`         | Дополнительные CSS классы                                               |

#### Настройки отображения

| Prop              | Тип       | По умолчанию | Описание                                 |
| ----------------- | --------- | ------------ | ---------------------------------------- |
| `visibleCount`    | `number`  | `Infinity`   | Количество видимых элементов в дропдауне |
| `hideInput`       | `boolean` | `false`      | Скрыть поле ввода                        |
| `hideClearButton` | `boolean` | `false`      | Скрыть кнопку очистки                    |
| `icon`            | `string`  | -            | Иконка для поля                          |

#### Настройки множественного выбора

| Prop                       | Тип       | По умолчанию | Описание                            |
| -------------------------- | --------- | ------------ | ----------------------------------- |
| `maxVisibleItems`          | `number`  | `3`          | Максимум видимых элементов в тегах  |
| `allowBackspaceDelete`     | `boolean` | `false`      | Разрешить удаление через Backspace  |
| `hideSelectedFromDropdown` | `boolean` | `false`      | Скрыть выбранные опции из дропдауна |

#### Настройки поиска

| Prop         | Тип      | По умолчанию | Описание                 |
| ------------ | -------- | ------------ | ------------------------ |
| `debounceMs` | `number` | `250`        | Задержка для поиска (мс) |

#### Валидация

| Prop               | Тип                                 | По умолчанию | Описание                   |
| ------------------ | ----------------------------------- | ------------ | -------------------------- |
| `validator`        | `({ value, name, opts }) => string` | -            | Функция валидации          |
| `hideErrorOnFocus` | `boolean`                           | `true`       | Скрывать ошибки при фокусе |

#### Начальные значения

| Prop           | Тип                  | По умолчанию | Описание                                                                            |
| -------------- | -------------------- | ------------ | ----------------------------------------------------------------------------------- |
| `initialValue` | `string \| string[]` | `''`         | Начальное значение (пустая строка для одиночного, пустой массив для множественного) |

#### Кастомизация

| Prop | Тип | По умолчанию | Описание |
| ---- | --- | ------------ | -------- |

### Типы

```tsx
interface Option {
	label: string;
	value: string | number;
	[key: string]: any; // Дополнительные свойства
}

interface SelectSearchProps {
	// Обязательные
	formId: string;
	name: string;
	label: string;

	// Данные
	options?: Option[];
	loadOptions?: (input: string) => Promise<Option[]>;

	// Основные настройки
	multiple?: boolean;
	placeholder?: boolean | string;
	required?: boolean;
	disabled?: boolean;
	className?: string;

	// Отображение
	visibleCount?: number;
	hideInput?: boolean;
	hideClearButton?: boolean;
	icon?: string;

	// Множественный выбор
	maxVisibleItems?: number;
	allowBackspaceDelete?: boolean;
	hideSelectedFromDropdown?: boolean;

	// Поиск
	debounceMs?: number;

	// Валидация
	validator?: ({ value, name, opts }: { value: string; name?: string; opts?: any }) => string;
	hideErrorOnFocus?: boolean;

	// Начальные значения
	initialValue?: string | string[];
}
```

## Внешнее управление

### useSelectExternalControl Hook

Для программного управления компонентом используйте хук `useSelectExternalControl`:

```tsx
import { useSelectExternalControl } from 'wma-form';

function MyComponent() {
	const {
		// Основные функции управления
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
		getAvailableOptions,

		// Управление фокусом
		focusField,
		blurField,

		// Валидация и состояние
		validateField,
		markAsTouched,

		// Дополнительные методы
		selectMultiple,
		removeOption,
		getCurrentQuery,
		isDropdownOpen,
		getSelectedOptions,
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
			<button onClick={() => openDropdown()}>Открыть дропдаун</button>
		</div>
	);
}
```

### Методы внешнего управления

#### Основные функции управления

-   `selectByValue(value: string | number)` - выбрать опцию по значению
-   `clearAll()` - очистить все выбранные значения
-   `openDropdown()` - открыть дропдаун
-   `closeDropdown()` - закрыть дропдаун
-   `setSearchQuery(query: string)` - установить поисковый запрос

#### Получение данных

-   `getSelectedValues()` - получить выбранные значения
-   `getSelectedCount()` - получить количество выбранных элементов
-   `hasSelectedValues()` - проверить, есть ли выбранные значения
-   `getFieldState()` - получить состояние поля
-   `isOptionSelected(value)` - проверить, выбрана ли опция
-   `getAvailableOptions()` - получить все доступные опции
-   `getSelectedOptions()` - получить выбранные опции

#### Управление фокусом

-   `focusField()` - установить фокус на поле
-   `blurField()` - убрать фокус с поля

#### Валидация и состояние

-   `validateField()` - валидировать поле
-   `markAsTouched()` - отметить поле как touched

#### Дополнительные методы

-   `selectMultiple(values)` - выбрать несколько опций сразу
-   `removeOption(value)` - удалить конкретную опцию
-   `getCurrentQuery()` - получить текущий поисковый запрос
-   `isDropdownOpen()` - проверить, открыт ли дропдаун

## Примеры использования

### 1. Простой селект с валидацией

```tsx
const validator = ({ value }) => {
	if (!value) {
		return 'Поле обязательно для заполнения';
	}
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

### 2. Множественный выбор с кастомными тегами

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
/>
```

### 3. Асинхронный поиск пользователей

```tsx
const loadUsers = async (query: string) => {
	if (query.length < 2) return [];

	const response = await fetch(`/api/users/search?q=${query}`);
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
	label='Назначить на'
	loadOptions={loadUsers}
	debounceMs={300}
	visibleCount={8}
	placeholder='Начните вводить имя пользователя...'
/>;
```

### 4. Внешнее управление

```tsx
function AdvancedSelect() {
	const { selectByValue, clearAll, getSelectedValues, getFieldState } = useSelectExternalControl({
		formId: 'form',
		name: 'category',
		options: categories,
	});

	const handlePresetSelection = (preset: string) => {
		switch (preset) {
			case 'web':
				selectByValue('frontend');
				selectByValue('backend');
				break;
			case 'mobile':
				selectByValue('ios');
				selectByValue('android');
				break;
			case 'clear':
				clearAll();
				break;
		}
	};

	return (
		<div>
			<SelectSearch
				formId='form'
				name='category'
				label='Категории'
				options={categories}
				multiple={true}
			/>

			<div>
				<button onClick={() => handlePresetSelection('web')}>Веб-разработка</button>
				<button onClick={() => handlePresetSelection('mobile')}>Мобильная разработка</button>
				<button onClick={() => handlePresetSelection('clear')}>Очистить</button>
			</div>

			<div>Выбрано: {getSelectedValues().join(', ')}</div>
		</div>
	);
}
```

### 5. Скрытый инпут (только дропдаун)

```tsx
<SelectSearch
	formId='form'
	name='status'
	label='Статус'
	options={statuses}
	hideInput={true}
	placeholder='Выберите статус'
/>
```

### 6. С иконкой

```tsx
<SelectSearch
	formId='form'
	name='priority'
	label='Приоритет'
	options={priorities}
	icon='⚡'
/>
```

## Клавиатурная навигация

Компонент поддерживает полную клавиатурную навигацию:

-   `↑/↓` - навигация по опциям
-   `Enter` - выбор активной опции
-   `Escape` - закрытие дропдауна
-   `Tab` - переход к следующему элементу
-   `Backspace` - удаление последнего элемента (в множественном режиме)

## Стилизация

Компонент использует CSS классы для стилизации:

```css
.select-search-wrapper {
	/* Основной контейнер */
}

.select-search-wrapper.error {
	/* Состояние ошибки */
}

.select-search-wrapper.focused {
	/* Состояние фокуса */
}

.control {
	/* Контейнер поля ввода */
}

.control.multiple {
	/* Множественный выбор */
}

.control.single {
	/* Одиночный выбор */
}

.control-input {
	/* Поле ввода */
}

.dropdown {
	/* Дропдаун */
}

.dropdown-option {
	/* Опция в дропдауне */
}

.dropdown-option.active {
	/* Активная опция */
}

.dropdown-option.selected {
	/* Выбранная опция */
}

.selected-tag {
	/* Тег выбранного элемента */
}

.selected-tag-remove {
	/* Кнопка удаления тега */
}

.error-message {
	/* Сообщение об ошибке */
}
```

## Доступность (Accessibility)

Компонент полностью поддерживает доступность:

-   ARIA атрибуты (`role`, `aria-expanded`, `aria-controls`, `aria-activedescendant`)
-   Поддержка screen readers
-   Клавиатурная навигация
-   Семантическая разметка
-   Правильные ID для связывания элементов

## Производительность

-   Дебаунсинг для поиска (настраивается через `debounceMs`)
-   Кэширование результатов асинхронной загрузки
-   Виртуализация для больших списков (через `visibleCount`)
-   Оптимизированные ре-рендеры

## Ограничения

1. Компонент должен использоваться внутри `Form` или с явно переданным `formId`
2. Для асинхронной загрузки требуется функция `loadOptions`
3. Множественный выбор имеет ограничение на количество видимых тегов

## Миграция

### С версии 1.x на 2.x

Основные изменения:

-   Упрощен API внешнего управления
-   Удалены устаревшие пропсы
-   Улучшена производительность
-   Добавлена поддержка TypeScript

### Обновление кода

```tsx
// Старый код
<SelectSearch
	externalControl={true}
	onSelectionChange={handleChange}
/>;

// Новый код
const { selectByValue, getSelectedValues } = useSelectExternalControl({
	formId: 'form',
	name: 'select',
	options: myOptions,
});
```

## Поддержка

Для получения помощи:

1. Проверьте примеры в Storybook
2. Изучите типы TypeScript
3. Обратитесь к команде разработки

---

_Документация актуальна для версии 2.x компонента SelectSearch_
