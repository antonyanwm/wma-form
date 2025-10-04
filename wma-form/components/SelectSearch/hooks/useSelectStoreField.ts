import React from 'react';
import { useFormStore } from '../../../store/formsStore';

interface UseSelectStoreFieldOptions<T = unknown> {
	formId: string;
	name: string;
	multiple: boolean;
	setSelectedOptions?: React.Dispatch<React.SetStateAction<T[]>>;
	setSelectedLabel?: React.Dispatch<React.SetStateAction<string>>;
	setSelectedOption?: React.Dispatch<React.SetStateAction<T | null>>;
	setQuery?: React.Dispatch<React.SetStateAction<string>>;
	isInitialized?: React.MutableRefObject<boolean>;
	inputRef?: React.RefObject<HTMLInputElement>;
	setInputKey?: React.Dispatch<React.SetStateAction<number>>;
}

export function useSelectStoreField<T = unknown>(formId: string, name: string, options?: UseSelectStoreFieldOptions<T>) {
	const selectField = React.useMemo(() => (s: any) => s.forms?.[formId]?.[name], [formId, name]);
	const field = useFormStore(selectField) as any;

	const setFieldValue = useFormStore((s) => s.setFieldValue);
	const setFieldTouched = useFormStore((s) => s.setFieldTouched);
	const setFieldFocused = useFormStore((s) => s.setFieldFocused);
	const registerField = useFormStore((s) => s.registerField);
	const validateField = useFormStore((s) => s.validateField);

	// Функция очистки всех выбранных элементов
	const handleClearAll = React.useCallback(() => {
		if (!options) return;

		const { multiple, setSelectedOptions, setSelectedLabel, setSelectedOption, setQuery, isInitialized, inputRef, setInputKey } = options;

		// debug log removed

		if (multiple) {
			// Очистка для множественного выбора
			if (setSelectedOptions) {
				setSelectedOptions([]);
			}

			// Очищаем значения в сторе
			setFieldValue(formId, name, [], {
				selected: [],
			});
			setFieldValue(formId, `${name}_selectedOptions`, []);
		} else {
			// Очистка для одиночного выбора
			if (setSelectedLabel) {
				setSelectedLabel('');
			}
			if (setSelectedOption) {
				setSelectedOption(null);
			}

			// Очищаем значения в сторе
			setFieldValue(formId, name, '', {
				selected: null,
			});
			setFieldValue(formId, `${name}_selectedOption`, null);
		}

		// Очищаем поисковый запрос
		if (setQuery) {
			setQuery('');
		}

		// Сбрасываем флаг инициализации
		if (isInitialized) {
			isInitialized.current = false;
		}

		// Принудительно обновляем input элемент
		if (setInputKey) {
			setInputKey((prev) => prev + 1);
		}

		// Принудительно обновляем DOM input элемента
		if (inputRef?.current) {
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
	}, [formId, name, setFieldValue, options]);

	return {
		field,
		setFieldValue,
		setFieldTouched,
		setFieldFocused,
		registerField,
		validateField,
		handleClearAll,
	};
}
