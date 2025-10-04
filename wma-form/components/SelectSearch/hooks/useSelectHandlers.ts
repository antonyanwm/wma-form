import React from 'react';
import { Option } from '../types';

interface UseSelectHandlersOptions {
	formId: string;
	name: string;
	multiple: boolean;
	storeValue: any;
	selectedOptions: Option[];
	setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
	setSelectedLabel: React.Dispatch<React.SetStateAction<string>>;
	setSelectedOption: React.Dispatch<React.SetStateAction<Option | null>>;
	setFieldValue: (formId: string, name: string, value: any, meta?: any) => void;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	inputRef: React.RefObject<HTMLInputElement>;
}

/**
 * Хук для обработчиков событий селекта
 * Включает handleSelect для обработки выбора опций
 */
export function useSelectHandlers({
	formId,
	name,
	multiple,
	storeValue,
	selectedOptions,
	setSelectedOptions,
	setSelectedLabel,
	setSelectedOption,
	setFieldValue,
	setOpen,
	setQuery,
	inputRef,
}: UseSelectHandlersOptions) {
	// Обработка выбора
	const handleSelect = React.useCallback(
		(option: Option) => {
			const value = String(option.value);

			if (multiple) {
				// Множественный выбор
				const currentValues = Array.isArray(storeValue) ? storeValue.filter((v) => v != null && v !== '') : [];
				const newValues = currentValues.includes(value)
					? currentValues.filter((v) => v !== value) // Удаляем
					: [...currentValues, value]; // Добавляем
				// Убираем дублирующиеся значения и пустые значения
				const uniqueValues = [...new Set(newValues.filter((v) => v != null && v !== ''))];

				// Обновляем массив выбранных опций
				let newOptions = [...selectedOptions];

				// Если опция была удалена
				if (currentValues.includes(value) && !newValues.includes(value)) {
					newOptions = newOptions.filter((opt: Option) => String(opt.value) !== value);
				}
				// Если опция была добавлена
				else if (!currentValues.includes(value) && newValues.includes(value)) {
					// Проверяем, что опции еще нет в массиве
					const alreadyExists = newOptions.some((opt: Option) => String(opt.value) === value);
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
				// Одиночный выбор
				setSelectedLabel(option.label);
				setSelectedOption(option);
				setFieldValue(formId, name, value, {
					selected: option,
				});
				setFieldValue(formId, `${name}_selectedOption`, option);
				setOpen(false);
				setQuery('');
				// Убираем фокус после выбора
				if (inputRef.current) {
					inputRef.current.blur();
				}
			}
		},
		[multiple, storeValue, setFieldValue, formId, name, selectedOptions, setSelectedOptions, setSelectedLabel, setSelectedOption, setOpen, setQuery, inputRef]
	);

	return {
		handleSelect,
	};
}
