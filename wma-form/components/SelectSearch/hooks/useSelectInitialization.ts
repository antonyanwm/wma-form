import React from 'react';
import { Option } from '../types';

interface UseSelectInitializationOptions {
	formId: string;
	name: string;
	multiple: boolean;
	initialValue: string | string[];
	allLoadedOptions: Option[];
	setSelectedOptions: React.Dispatch<React.SetStateAction<Option[]>>;
	setSelectedLabel: React.Dispatch<React.SetStateAction<string>>;
	setSelectedOption: React.Dispatch<React.SetStateAction<Option | null>>;
	setFieldValue: (formId: string, name: string, value: any, meta?: any) => void;
	isInitialized: React.MutableRefObject<boolean>;
}

/**
 * Хук для инициализации значений селекта
 * Обрабатывает initialValue и устанавливает начальные значения
 */
export function useSelectInitialization({
	formId,
	name,
	multiple,
	initialValue,
	allLoadedOptions,
	setSelectedOptions,
	setSelectedLabel,
	setSelectedOption,
	setFieldValue,
	isInitialized,
}: UseSelectInitializationOptions) {
	// Инициализация selectedOptions и selectedLabel/selectedOption только один раз при монтировании
	React.useEffect(() => {
		if (!isInitialized.current && allLoadedOptions.length > 0) {
			if (multiple && initialValue && Array.isArray(initialValue) && initialValue.length > 0) {
				// Находим опции, соответствующие initialValue
				const initialOptions = allLoadedOptions.filter((option) => initialValue.includes(String(option.value)));
				if (initialOptions.length > 0) {
					setSelectedOptions(initialOptions);
					// Обновляем стор с найденными опциями
					setFieldValue(formId, name, initialValue, {
						selected: initialOptions,
					});
					setFieldValue(formId, `${name}_selectedOptions`, initialOptions);
				}
			} else if (!multiple && initialValue && typeof initialValue === 'string') {
				// Находим опцию, соответствующую initialValue
				const foundOption = allLoadedOptions.find((option) => String(option.value) === initialValue);
				if (foundOption) {
					setSelectedLabel(foundOption.label);
					setSelectedOption(foundOption);
					// Обновляем стор с найденной опцией
					setFieldValue(formId, name, initialValue, {
						selected: foundOption,
					});
					setFieldValue(formId, `${name}_selectedOption`, foundOption);
				}
			}
			isInitialized.current = true;
		}
	}, [allLoadedOptions.length, initialValue, multiple, setFieldValue, formId, name, setSelectedOptions, setSelectedLabel, setSelectedOption, isInitialized]);
}






