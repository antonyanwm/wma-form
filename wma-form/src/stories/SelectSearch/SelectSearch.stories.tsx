import type { Meta, StoryObj } from '@storybook/react';
import { Form, SelectSearch } from '../../../index';
import { Option, SelectSearchProps } from '../../../components/SelectSearch/types';
import React from 'react';
import { useSelectExternalControl } from '../../../components/SelectSearch/hooks';

type LocalArgs = SelectSearchProps & {
	useAsync?: boolean;
	withValidation?: boolean;
	prefix?: string;
	suffix?: string;
	customPrefix?: string;
	customSuffix?: string;
	showDefaultSuffix?: boolean;
};

// Функция для создания иконок из строковых значений
const createIcon = (iconType: string, customValue?: string, color: string = '#666') => {
	if (iconType === 'none') return null;
	if (iconType === 'custom') {
		if (!customValue || customValue.trim() === '') return null;
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 20,
					height: 20,
					color: color,
					fontSize: 16,
				}}>
				{customValue}
			</div>
		);
	}

	const iconMap: Record<string, string> = {
		search: '🔍',
		user: '👤',
		star: '⭐',
		heart: '❤️',
		'arrow-down': '', // Возвращаем пустую строку для показа дефолтной стрелки с ротацией
		plus: '+',
		check: '✓',
		close: '✕',
	};

	const icon = iconMap[iconType];

	// Если icon === null, возвращаем null (для дефолтной стрелки)
	if (icon === null) return null;

	// Если icon не найден в map, используем iconType как есть
	const displayIcon = icon || iconType;

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: 20,
				height: 20,
				color: color,
				fontSize: 16,
			}}>
			{displayIcon}
		</div>
	);
};

// Образцы данных для демонстрации
const sampleOptions: Option[] = [
	{ label: 'JavaScript', value: 'js' },
	{ label: 'TypeScript', value: 'ts' },
	{ label: 'Python', value: 'py' },
	{ label: 'Java', value: 'java' },
	{ label: 'C#', value: 'csharp' },
	{ label: 'Go', value: 'go' },
	{ label: 'Rust', value: 'rust' },
	{ label: 'PHP', value: 'php' },
	{ label: 'Ruby', value: 'ruby' },
	{ label: 'Swift', value: 'swift' },
];

const meta: Meta<LocalArgs> = {
	title: 'Components/SelectSearch',
	component: SelectSearch,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: `
# SelectSearch

Универсальный компонент селекта с поиском, поддержкой одиночного и множественного выбора, асинхронной загрузкой данных и внешним управлением.

## Основные возможности

- 🔍 **Поиск** - фильтрация опций по введенному тексту
- 🎯 **Одиночный/множественный выбор** - настраиваемый режим выбора
- ⚡ **Асинхронная загрузка** - динамическая подгрузка опций
- 🎛️ **Внешнее управление** - полный контроль через API
- 📱 **Адаптивность** - работает на всех устройствах
- 🎨 **Кастомизация** - настраиваемые стили и поведение

## Использование

\`\`\`tsx
import { SelectSearch, Form } from 'wma-form';

<Form formId="my-form" onValidSubmit={(data) => console.log(data)}>
	  <SelectSearch
    formId="my-form"
	    name="language"
    label="Выберите язык программирования"
    options={[
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Python', value: 'py' }
    ]}
    multiple={false}
    required={true}
	  />
</Form>
\`\`\`
	                `,
			},
		},
	},
	argTypes: {
		label: {
			control: 'text',
			description: 'Подпись поля',
		},
		placeholder: {
			control: 'text',
			description: 'Плейсхолдер для поля ввода',
		},
		multiple: {
			control: 'boolean',
			description: 'Множественный выбор',
		},
		required: {
			control: 'boolean',
			description: 'Обязательное поле',
		},
		disabled: {
			control: 'boolean',
			description: 'Отключенное состояние',
		},
		hideInput: {
			control: 'boolean',
			description: 'Скрыть поле ввода',
		},
		hideClearButton: {
			control: 'boolean',
			description: 'Скрыть кнопку очистки',
		},
		hideSelectedFromDropdown: {
			control: 'boolean',
			description: 'Скрыть выбранные опции из дропдауна',
		},
		allowBackspaceDelete: {
			control: 'boolean',
			description: 'Разрешить удаление через Backspace',
		},
		maxVisibleItems: {
			control: { type: 'number', min: 1, max: 20 },
			description: 'Максимальное количество видимых элементов',
		},
		visibleCount: {
			control: { type: 'number', min: 1, max: 10 },
			description: 'Количество видимых элементов в дропдауне',
		},
		debounceMs: {
			control: { type: 'number', min: 0, max: 1000 },
			description: 'Задержка для поиска (мс)',
		},
		prefix: {
			control: 'select',
			options: ['', '🔍', '👤', '⭐', '❤️', '🎯', '🚀', '💻', '📱', '🔧'],
			description: 'Иконка перед полем ввода',
		},
		suffix: {
			control: 'select',
			options: ['', 'arrow-down', '+', '✓', '✕', '🚀', '⭐', '💻', '📱', '🔧'],
			description: 'Иконка после поля ввода',
		},
		showDefaultSuffix: {
			control: 'boolean',
			description: 'Показывать дефолтную стрелку (если suffix не передан)',
		},
		loadOptions: {
			control: { type: 'text', disabled: true },
			description: 'Функция асинхронной загрузки опций',
		},
		validator: {
			control: { type: 'text', disabled: true },
			description: 'Функция валидации поля',
		},
		maxLength: {
			control: 'number',
			description: 'Максимальная длина введенного текста',
		},
		minLength: {
			control: 'number',
			description: 'Минимальная длина введенного текста',
		},
		hideErrorOnFocus: {
			control: 'boolean',
			description: 'Скрывать ошибку при фокусе',
		},
		initialValue: {
			control: 'text',
			description: 'Начальное значение',
		},
		useAsync: {
			control: 'boolean',
			description: 'Использовать асинхронную загрузку',
		},
		withValidation: {
			control: 'boolean',
			description: 'Включить валидацию',
		},
	},
	args: {
		label: 'Выберите язык программирования',
		placeholder: 'Начните вводить...',
		multiple: false,
		required: false,
		disabled: false,
		hideInput: false,
		hideClearButton: false,
		hideSelectedFromDropdown: false,
		allowBackspaceDelete: true,
		maxVisibleItems: 5,
		visibleCount: 8,
		debounceMs: 250,
		prefix: '🔍',
		suffix: 'arrow-down',
		showDefaultSuffix: true,
		loadOptions: undefined,
		validator: undefined,
		maxLength: undefined,
		minLength: undefined,
		hideErrorOnFocus: true,
		initialValue: '',
		useAsync: false,
		withValidation: false,
		options: sampleOptions,
	},
};

export default meta;
type Story = StoryObj<LocalArgs>;

// 1. БАЗОВАЯ ИСТОРИЯ - без внешнего вмешательства
export const Basic: Story = {
	render: (args) => {
		const validator = (args.withValidation as boolean)
			? ({ value }: { value: string | string[] }) => {
					if ((Array.isArray(value) && value.length === 0) || (!Array.isArray(value) && !value)) {
						return 'Поле обязательно для заполнения';
					}
					return '';
			  }
			: undefined;

		const loadFn = (args.useAsync as boolean)
			? async (q: string) => {
					await new Promise((r) => setTimeout(r, args.debounceMs ?? 250));
					return ((args.options as Option[]) || sampleOptions).filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
			  }
			: undefined;

		return (
			<div style={{ maxWidth: 640 }}>
				<Form
					formId='basic-form'
					onValidSubmit={(data) => {
						console.log('Form submitted:', data);
					}}>
					<SelectSearch
						formId='basic-form'
						name='basic-select'
						label={args.label}
						options={(args.options as Option[]) || sampleOptions}
						loadOptions={loadFn}
						placeholder={args.placeholder as string}
						multiple={!!args.multiple}
						required={!!args.required}
						disabled={!!args.disabled}
						hideInput={!!args.hideInput}
						hideClearButton={!!args.hideClearButton}
						hideSelectedFromDropdown={!!args.hideSelectedFromDropdown}
						allowBackspaceDelete={!!args.allowBackspaceDelete}
						maxVisibleItems={args.maxVisibleItems as number}
						visibleCount={args.visibleCount as number}
						debounceMs={args.debounceMs as number}
						maxLength={args.maxLength as number}
						minLength={args.minLength as number}
						hideErrorOnFocus={!!args.hideErrorOnFocus}
						prefix={args.prefix || null}
						suffix={args.suffix === 'arrow-down' ? null : args.suffix || null}
						showDefaultSuffix={!!args.showDefaultSuffix}
						validator={validator as unknown as SelectSearchProps['validator']}
						initialValue={args.initialValue as string | string[]}
						showTagLine={!!args.showTagLine}
					/>
				</Form>

				{/* Документация */}
				<div style={{ marginTop: 24, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef' }}>
					<h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>📖 Базовое использование</h4>
					<p style={{ margin: '0 0 12px 0', fontSize: 14, color: '#6c757d' }}>
						Это стандартное использование компонента SelectSearch без внешнего управления. Все взаимодействие происходит через пользовательский интерфейс.
					</p>
					<div style={{ fontSize: 12, color: '#6c757d' }}>
						<strong>Особенности:</strong>
						<ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
							<li>Поиск по введенному тексту</li>
							<li>Выбор опций кликом</li>
							<li>Очистка через кнопку или Backspace</li>
							<li>Валидация (если включена)</li>
							<li>Асинхронная загрузка (если включена)</li>
						</ul>
					</div>
				</div>
			</div>
		);
	},
	args: {
		label: 'Выберите язык программирования',
		placeholder: 'Начните вводить...',
		multiple: false,
		required: false,
		disabled: false,
		hideInput: false,
		hideClearButton: false,
		hideSelectedFromDropdown: false,
		allowBackspaceDelete: true,
		maxVisibleItems: 5,
		visibleCount: 8,
		debounceMs: 250,
		prefix: '🔍',
		suffix: 'arrow-down',
		showDefaultSuffix: true,
		loadOptions: undefined,
		validator: undefined,
		maxLength: undefined,
		minLength: undefined,
		hideErrorOnFocus: true,
		initialValue: '',
		useAsync: false,
		withValidation: false,
	},
};

// 2. ИСТОРИЯ С ПОЛНЫМ ВНЕШНИМ КОНТРОЛЕМ
export const ExternalControl: Story = {
	render: (args) => {
		// Используем хук для выбора и чтения состояния
		const {
			selectByValue,
			clearAll: hookClearAll,
			getSelectedValues,
			getSelectedCount,
			hasSelectedValues,
			getFieldState,
			getCurrentQuery,
		} = useSelectExternalControl({
			formId: 'external-form',
			name: 'external-select',
			multiple: !!args.multiple,
			options: (args.options as Option[]) || sampleOptions,
		});

		const fieldState = getFieldState();
		const [externalQuery, setExternalQuery] = React.useState<string>('');

		// Создаем функции для управления дропдауном через DOM (работают с реальным компонентом)
		const openDropdown = () => {
			const input = document.querySelector('#select-search-external-form-external-select') as HTMLInputElement;
			if (input) {
				input.focus();
				input.click();
			}
		};

		const closeDropdown = () => {
			// Кликаем вне компонента
			document.body.click();
		};

		const setSearchQuery = (query: string) => {
			// Находим input и устанавливаем значение
			const input = document.querySelector('#select-search-external-form-external-select') as HTMLInputElement;
			if (input) {
				// Устанавливаем значение через React
				const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
				if (nativeInputValueSetter) {
					nativeInputValueSetter.call(input, query);
				}

				// Создаем событие input для обновления состояния
				const inputEvent = new Event('input', { bubbles: true });
				input.dispatchEvent(inputEvent);

				// Также создаем событие change
				const changeEvent = new Event('change', { bubbles: true });
				input.dispatchEvent(changeEvent);

				// Открываем дропдаун для показа результатов поиска
				setTimeout(() => {
					openDropdown();
				}, 100);
			}
		};

		const clearAll = () => {
			// Сначала вызываем функцию очистки из хука
			hookClearAll();

			// Затем дополнительно очищаем через DOM манипуляции для надежности
			setTimeout(() => {
				// Пытаемся найти кнопку очистки и кликнуть по ней
				const clearButton = document.querySelector('.button-clear-all');
				if (clearButton) {
					(clearButton as HTMLElement).click();
				} else {
					// Если кнопка не найдена, очищаем через DOM манипуляции
					const input = document.querySelector('#select-search-external-form-external-select') as HTMLInputElement;
					if (input) {
						// Очищаем значение через React
						const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
						if (nativeInputValueSetter) {
							nativeInputValueSetter.call(input, '');
						}

						// Создаем событие input для обновления состояния
						const inputEvent = new Event('input', { bubbles: true });
						input.dispatchEvent(inputEvent);

						// Также создаем событие change
						const changeEvent = new Event('change', { bubbles: true });
						input.dispatchEvent(changeEvent);
					}
				}
			}, 50);
		};

		return (
			<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
				<div style={{ maxWidth: 640 }}>
					<Form
						formId='external-form'
						onValidSubmit={(data) => console.log('Form submitted:', data)}>
						<SelectSearch
							formId='external-form'
							name='external-select'
							label={args.label}
							options={(args.options as Option[]) || sampleOptions}
							placeholder={args.placeholder as string}
							multiple={!!args.multiple}
							required={!!args.required}
							disabled={!!args.disabled}
							hideInput={!!args.hideInput}
							hideClearButton={!!args.hideClearButton}
							hideSelectedFromDropdown={!!args.hideSelectedFromDropdown}
							allowBackspaceDelete={!!args.allowBackspaceDelete}
							maxVisibleItems={args.maxVisibleItems as number}
							visibleCount={args.visibleCount as number}
							debounceMs={args.debounceMs as number}
							maxLength={args.maxLength as number}
							minLength={args.minLength as number}
							hideErrorOnFocus={!!args.hideErrorOnFocus}
							prefix={args.prefix === 'custom' ? args.customPrefix : args.prefix === 'none' ? null : args.prefix}
							suffix={args.suffix === 'custom' ? args.customSuffix : args.suffix === 'none' ? null : args.suffix === 'arrow-down' ? null : args.suffix}
							showDefaultSuffix={!!args.showDefaultSuffix}
							initialValue={args.initialValue as string | string[]}
							showTagLine={!!args.showTagLine}
						/>
					</Form>
				</div>

				<div style={{ padding: 16, borderRadius: 8, backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0' }}>
					<h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600 }}>🎛️ Внешнее управление</h3>

					<div style={{ marginBottom: 16, padding: 12, backgroundColor: 'white', borderRadius: 4, border: '1px solid #ddd' }}>
						<strong>Текущее состояние:</strong>
						<div style={{ marginTop: 8, fontSize: 14 }}>
							<div>
								Выбранные значения: <code>{JSON.stringify(getSelectedValues())}</code>
							</div>
							<div>
								Количество: <code>{getSelectedCount()}</code>
							</div>
							<div>
								Есть значения: <code>{hasSelectedValues() ? 'Да' : 'Нет'}</code>
							</div>
							<div>
								Поисковый запрос: <code>"{getCurrentQuery()}"</code>
							</div>
							<div>
								Фокус: <code>{fieldState.focused ? 'Да' : 'Нет'}</code>
							</div>
							<div>
								Ошибка: <code>{fieldState.error || 'Нет'}</code>
							</div>
						</div>
					</div>

					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
						<h4 style={{ width: '100%', margin: '0 0 8px 0', fontSize: 14 }}>Выбор опций:</h4>
						<button
							onClick={() => selectByValue('js')}
							style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#e3f2fd' }}
							disabled={!!args.disabled}>
							Выбрать JavaScript
						</button>
						<button
							onClick={() => selectByValue('ts')}
							style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#e3f2fd' }}
							disabled={!!args.disabled}>
							Выбрать TypeScript
						</button>
						<button
							onClick={() => selectByValue('py')}
							style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#e3f2fd' }}
							disabled={!!args.disabled}>
							Выбрать Python
						</button>
					</div>

					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
						<h4 style={{ width: '100%', margin: '0 0 8px 0', fontSize: 14 }}>Управление дропдауном:</h4>
						<button
							onClick={() => openDropdown()}
							style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#e3f2fd' }}
							disabled={!!args.disabled}>
							Открыть дропдаун
						</button>
						<button
							onClick={() => closeDropdown()}
							style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#ffebee' }}
							disabled={!!args.disabled}>
							Закрыть дропдаун
						</button>
					</div>

					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
						<h4 style={{ width: '100%', margin: '0 0 8px 0', fontSize: 14 }}>Управление поиском:</h4>
						<input
							type='text'
							value={externalQuery}
							onChange={(e) => setExternalQuery(e.target.value)}
							placeholder='Введите поисковый запрос'
							style={{ padding: '6px 8px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4 }}
						/>
						<button
							onClick={() => setSearchQuery(externalQuery)}
							style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#e3f2fd' }}
							disabled={!!args.disabled}>
							Установить запрос
						</button>
						<button
							onClick={() => {
								setExternalQuery('');
								setSearchQuery('');
							}}
							style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#ffebee' }}
							disabled={!!args.disabled}>
							Очистить запрос
						</button>
					</div>

					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
						<h4 style={{ width: '100%', margin: '0 0 8px 0', fontSize: 14 }}>Очистка:</h4>
						<button
							onClick={() => clearAll()}
							style={{ padding: '6px 12px', fontSize: 12, backgroundColor: '#e3f2fd', color: 'black', border: '1px solid #2196f3' }}
							disabled={!!args.disabled}>
							Очистить все
						</button>
					</div>
				</div>

				<div style={{ padding: 16, backgroundColor: '#e8f5e8', borderRadius: 8, border: '1px solid #4caf50' }}>
					<h4 style={{ margin: '0 0 12px 0', color: '#2e7d32' }}>🎛️ Внешнее управление</h4>
					<p style={{ margin: '0 0 12px 0', fontSize: 14, color: '#388e3c' }}>
						Этот пример демонстрирует полное внешнее управление компонентом SelectSearch через хук useSelectExternalControl.
					</p>
					<div style={{ fontSize: 12, color: '#388e3c' }}>
						<strong>Доступные методы:</strong>
						<ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
							<li>
								<code>selectByValue(value)</code> - выбор опции по значению
							</li>
							<li>
								<code>clearAll()</code> - очистка всех значений
							</li>
							<li>
								<code>openDropdown()</code> / <code>closeDropdown()</code> - управление дропдауном
							</li>
							<li>
								<code>setSearchQuery(query)</code> - установка поискового запроса
							</li>
							<li>
								<code>getSelectedValues()</code> - получение выбранных значений
							</li>
							<li>
								<code>getCurrentQuery()</code> - получение текущего поискового запроса
							</li>
							<li>
								<code>getFieldState()</code> - получение состояния поля
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	},
	args: {
		label: 'Выберите язык программирования',
		placeholder: 'Начните вводить...',
		multiple: false,
		required: false,
		disabled: false,
		hideInput: false,
		hideClearButton: false,
		hideSelectedFromDropdown: false,
		allowBackspaceDelete: true,
		maxVisibleItems: 5,
		visibleCount: 8,
		debounceMs: 250,
		prefix: '🔍',
		suffix: 'arrow-down',
		showDefaultSuffix: true,
		loadOptions: undefined,
		validator: undefined,
		maxLength: undefined,
		minLength: undefined,
		hideErrorOnFocus: true,
		initialValue: '',
		useAsync: false,
		withValidation: false,
		options: sampleOptions,
	},
};
