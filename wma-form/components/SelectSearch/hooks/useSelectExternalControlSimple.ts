import React from 'react';
import { Option } from '../types';
import { useSelectStoreField } from './useSelectStoreField';
import { useDropdownManager } from './useDropdownManager';

interface UseSelectExternalControlSimpleOptions {
	formId: string;
	name: string;
	multiple?: boolean;
	options?: Option[];
}

/**
 * Упрощенный хук для внешнего управления селектом
 * Предоставляет только основные функции
 */
export function useSelectExternalControlSimple({ formId, name, multiple = false, options = [] }: UseSelectExternalControlSimpleOptions) {
	// Refs
	const inputRef = React.useRef<HTMLInputElement>(null);
	const isInitialized = React.useRef(false);

	// Состояние для хранения выбранных опций
	const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([]);
	const [selectedLabel, setSelectedLabel] = React.useState<string>('');
	const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);
	const [query, setQuery] = React.useState('');
	const [inputKey, setInputKey] = React.useState(0);

	// Store field management
	const { field, setFieldValue, setFieldTouched, setFieldFocused, registerField, validateField, handleClearAll } = useSelectStoreField<Option>(formId, name, {
		formId,
		name,
		multiple,
		setSelectedOptions,
		setSelectedLabel,
		setSelectedOption,
		setQuery,
		isInitialized,
		inputRef,
		setInputKey,
	});

	// Dropdown management
	const componentId = `${formId}-${name}`;
	const dropdownManager = useDropdownManager({
		componentId,
		multiple,
		setQuery,
	});

	// Безопасное поле с дефолтными значениями
	const safeField = field || { error: '', focused: false, touched: false, value: '' };
	const storeValue = safeField.value ?? (multiple ? [] : '');

	// Внешние функции управления

	/**
	 * Открыть дропдаун
	 */
	const openDropdown = React.useCallback(() => {
		dropdownManager.setOpen(true);
		if (inputRef.current) {
			inputRef.current.focus();
			// Создаем событие focus для правильного открытия дропдауна
			const focusEvent = new Event('focus', { bubbles: true });
			inputRef.current.dispatchEvent(focusEvent);
		}
	}, [dropdownManager]);

	/**
	 * Закрыть дропдаун
	 */
	const closeDropdown = React.useCallback(() => {
		dropdownManager.setOpen(false);
		if (inputRef.current) {
			inputRef.current.blur();
		}
	}, [dropdownManager]);

	/**
	 * Установить поисковый запрос
	 */
	const setSearchQuery = React.useCallback(
		(query: string) => {
			// В одиночном селекте сначала очищаем выбранную опцию
			if (!multiple && selectedOption) {
				setSelectedLabel('');
				setSelectedOption(null);
				setFieldValue(formId, name, '', {
					selected: null,
				});
				setFieldValue(formId, `${name}_selectedOption`, null);

				// Используем requestAnimationFrame для правильной последовательности
				requestAnimationFrame(() => {
					// Устанавливаем новый поисковый запрос
					setQuery(query);
					// Синхронизируем с полем ввода через React события
					if (inputRef.current) {
						// Устанавливаем значение через React
						const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
						if (nativeInputValueSetter) {
							nativeInputValueSetter.call(inputRef.current, query);
						}

						// Создаем событие input для обновления состояния
						const inputEvent = new Event('input', { bubbles: true });
						inputRef.current.dispatchEvent(inputEvent);

						// Также создаем событие change
						const changeEvent = new Event('change', { bubbles: true });
						inputRef.current.dispatchEvent(changeEvent);
					}

					// Открываем дропдаун для показа результатов поиска
					openDropdown();
				});
			} else {
				// Если нет выбранной опции, устанавливаем сразу
				setQuery(query);
				// Синхронизируем с полем ввода через React события
				if (inputRef.current) {
					// Устанавливаем значение через React
					const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
					if (nativeInputValueSetter) {
						nativeInputValueSetter.call(inputRef.current, query);
					}

					// Создаем событие input для обновления состояния
					const inputEvent = new Event('input', { bubbles: true });
					inputRef.current.dispatchEvent(inputEvent);

					// Также создаем событие change
					const changeEvent = new Event('change', { bubbles: true });
					inputRef.current.dispatchEvent(changeEvent);
				}

				// Открываем дропдаун для показа результатов поиска
				openDropdown();
			}
		},
		[multiple, selectedOption, setSelectedLabel, setSelectedOption, setFieldValue, formId, name, openDropdown]
	);

	/**
	 * Программно выбрать опцию по значению
	 */
	const selectByValue = React.useCallback(
		(value: string | number) => {
			const option = options.find((opt) => String(opt.value) === String(value));
			if (option) {
				const valueStr = String(option.value);

				if (multiple) {
					// Множественный выбор
					const currentValues = Array.isArray(storeValue) ? storeValue.filter((v) => v != null && v !== '') : [];
					const newValues = currentValues.includes(valueStr)
						? currentValues.filter((v) => v !== valueStr) // Удаляем
						: [...currentValues, valueStr]; // Добавляем

					// Убираем дублирующиеся значения и пустые значения
					const uniqueValues = [...new Set(newValues.filter((v) => v != null && v !== ''))];

					// Обновляем массив выбранных опций
					let newOptions = [...selectedOptions];

					// Если опция была удалена
					if (currentValues.includes(valueStr) && !newValues.includes(valueStr)) {
						newOptions = newOptions.filter((opt: Option) => String(opt.value) !== valueStr);
					}
					// Если опция была добавлена
					else if (!currentValues.includes(valueStr) && newValues.includes(valueStr)) {
						// Проверяем, что опции еще нет в массиве
						const alreadyExists = newOptions.some((opt: Option) => String(opt.value) === valueStr);
						if (!alreadyExists) {
							newOptions.push(option);
						}
					}

					// Обновляем локальное состояние
					setSelectedOptions(newOptions);

					// Сохраняем значения и опции
					setFieldValue(formId, name, uniqueValues, {
						selected: newOptions,
					});
					setFieldValue(formId, `${name}_selectedOptions`, newOptions);
				} else {
					// Одиночный выбор - просто устанавливаем значение в store
					setFieldValue(formId, name, valueStr, {
						selected: option,
					});
					setFieldValue(formId, `${name}_selectedOption`, option);

					// Очищаем локальные состояния
					setSelectedLabel(option.label);
					setSelectedOption(option);
					setQuery('');
				}
			}
		},
		[options, multiple, storeValue, selectedOptions, setSelectedOptions, setSelectedLabel, setSelectedOption, setFieldValue, formId, name]
	);

	/**
	 * Получить текущие выбранные значения
	 */
	const getSelectedValues = React.useCallback(() => {
		return multiple ? (Array.isArray(storeValue) ? storeValue : []) : storeValue;
	}, [multiple, storeValue]);

	/**
	 * Получить количество выбранных элементов
	 */
	const getSelectedCount = React.useCallback(() => {
		if (multiple) {
			return Array.isArray(storeValue) ? storeValue.length : 0;
		} else {
			return storeValue ? 1 : 0;
		}
	}, [multiple, storeValue]);

	/**
	 * Проверить, есть ли выбранные значения
	 */
	const hasSelectedValues = React.useCallback(() => {
		return getSelectedCount() > 0;
	}, [getSelectedCount]);

	/**
	 * Получить состояние поля
	 */
	const getFieldState = React.useCallback(() => {
		return {
			value: storeValue,
			error: safeField.error,
			focused: safeField.focused,
			touched: safeField.touched,
			selectedCount: getSelectedCount(),
			hasValues: hasSelectedValues(),
		};
	}, [storeValue, safeField, getSelectedCount, hasSelectedValues]);

	/**
	 * Проверить, выбрана ли конкретная опция
	 */
	const isOptionSelected = React.useCallback(
		(value: string | number) => {
			const valueStr = String(value);
			if (multiple) {
				return Array.isArray(storeValue) && storeValue.includes(valueStr);
			} else {
				return storeValue === valueStr;
			}
		},
		[multiple, storeValue]
	);

	/**
	 * Получить все доступные опции
	 */
	const getAvailableOptions = React.useCallback(() => {
		return options;
	}, [options]);

	/**
	 * Установить фокус на поле
	 */
	const focusField = React.useCallback(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	/**
	 * Снять фокус с поля
	 */
	const blurField = React.useCallback(() => {
		if (inputRef.current) {
			inputRef.current.blur();
		}
	}, []);

	/**
	 * Валидировать поле
	 */
	const validateFieldExternally = React.useCallback(() => {
		return validateField({ formId, name });
	}, [validateField, formId, name]);

	/**
	 * Отметить поле как touched
	 */
	const markAsTouched = React.useCallback(() => {
		setFieldTouched(formId, name, true);
	}, [setFieldTouched, formId, name]);

	/**
	 * Очистить все выбранные значения (улучшенная версия)
	 */
	const clearAll = React.useCallback(() => {
		console.log('🧹 Clear All called from external control:', { multiple, storeValue });

		// Очищаем локальные состояния
		setSelectedOptions([]);
		setSelectedLabel('');
		setSelectedOption(null);
		setQuery('');

		// Очищаем значения в store
		if (multiple) {
			setFieldValue(formId, name, [], {
				selected: [],
			});
			setFieldValue(formId, `${name}_selectedOptions`, []);
		} else {
			setFieldValue(formId, name, '', {
				selected: null,
			});
			setFieldValue(formId, `${name}_selectedOption`, null);
		}

		// Сбрасываем флаг инициализации
		isInitialized.current = false;

		// Принудительно обновляем input элемент
		setInputKey((prev) => prev + 1);

		// Принудительно обновляем DOM input элемента
		if (inputRef.current) {
			// Принудительно обновляем значение в DOM
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
			if (nativeInputValueSetter) {
				nativeInputValueSetter.call(inputRef.current, '');
			}
			// Диспатчим события для синхронизации с React
			const inputEvent = new Event('input', { bubbles: true });
			inputRef.current.dispatchEvent(inputEvent);
			const changeEvent = new Event('change', { bubbles: true });
			inputRef.current.dispatchEvent(changeEvent);
		}
	}, [multiple, storeValue, setFieldValue, formId, name, setSelectedOptions, setSelectedLabel, setSelectedOption, setQuery, setInputKey, inputRef]);

	return {
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
		validateField: validateFieldExternally,
		markAsTouched,

		// Внутренние состояния
		field: safeField,
		selectedOptions,
		selectedLabel,
		selectedOption,
		query,
		setQuery,
		inputKey,
		inputRef,
	};
}
