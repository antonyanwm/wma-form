import React from 'react';
import { Option } from '../types';

// Обработчики событий для селекта
export const createEventHandlers = (
	props: {
		disabled: boolean;
		open: boolean;
		query: string;
		hideInput: boolean;
		multiple: boolean;
		currentValue: string;
		storeValue: string | string[];
		activeIndex: number;
		filtered: Option[];
		allowBackspaceDelete: boolean;
		formId: string;
		name: string;
		componentId: string;
	},
	refs: {
		rootRef: React.RefObject<HTMLDivElement>;
		inputRef: React.RefObject<HTMLInputElement>;
	},
	callbacks: {
		setOpen: (open: boolean) => void;
		setQuery: (query: string) => void;
		setActiveIndex: (index: number | ((prev: number) => number)) => void;
		setIsKeyboardNavigation: (value: boolean) => void;
		setFieldValue: (formId: string, name: string, value: string | string[]) => void;
		setFieldFocused: (formId: string, name: string, focused: boolean) => void;
		closeAllDropdowns: (except?: string) => void;
		fetchOptions: (query: string, options?: { immediate?: boolean }) => void;
		handleSelect: (option: Option) => void;
		debouncedFetch: (input: string) => void;
		setSelectedLabel: (label: string) => void;
		setSelectedOption: (option: Option | null) => void;
	}
) => {
	const { disabled, open, query, hideInput, multiple, currentValue, storeValue, activeIndex, filtered, allowBackspaceDelete, formId, name, componentId } = props;

	const { rootRef, inputRef } = refs;

	const {
		setOpen,
		setQuery,
		setActiveIndex,
		setIsKeyboardNavigation,
		setFieldValue,
		setFieldFocused,
		closeAllDropdowns,
		fetchOptions,
		handleSelect,
		debouncedFetch,
		setSelectedLabel,
		setSelectedOption,
	} = callbacks;

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value;
		const value = (raw ?? '').toString().toLowerCase();
		setQuery(value);

		// Для single: всегда очищаем текущее отображаемое значение и выбранную опцию при вводе
		if (!multiple) {
			if (currentValue) {
				setFieldValue(formId, name, '');
			}
			setSelectedLabel('');
			setSelectedOption(null);
		}

		// Автоматически открываем дропдаун при вводе
		if (!open) {
			setOpen(true);
		}

		// Запускаем немедленную фильтрацию/загрузку для мгновенного отклика
		fetchOptions(value, { immediate: true });
	};

	const handleBoxClick = (e?: React.MouseEvent) => {
		if (disabled) return;

		// Проверяем, что клик не по кнопке удаления тега
		if (e && (e.target as HTMLElement).closest('.selected-tag-remove')) {
			return;
		}

		// Проверяем, что клик не по дропдауну
		if (e && (e.target as HTMLElement).closest('.dropdown')) {
			return;
		}

		// Если есть инпут - фокусируемся на нем
		if (inputRef.current) {
			inputRef.current.focus();
			return;
		}

		// Для hideInput режима - открываем/закрываем дропдаун

		closeAllDropdowns(componentId); // Закрываем все остальные дропдауны
		setOpen(true);
		fetchOptions(query, { immediate: true });
	};

	const handleFocus = () => {
		if (disabled) return;
		setFieldFocused(formId, name, true);
		closeAllDropdowns(componentId); // Закрываем все остальные дропдауны

		// Для простого селекта очищаем инпут при фокусе, если есть выбранное значение
		if (!multiple && currentValue) {
			setQuery('');
		}

		setOpen(true);
		// Всегда запускаем поиск с текущим значением инпута
		fetchOptions(query, { immediate: true });
	};

	// blur обрабатывается в основном компоненте (UnifiedSelect)

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
		if (disabled) return;

		// Открываем дропдаун стрелками или Enter
		if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
			setOpen(true);
			e.preventDefault();
			// При открытии запускаем поиск по текущему query, а не по значению
			fetchOptions(query, { immediate: true });
			if (e.key === 'ArrowUp') {
				setActiveIndex(filtered.length - 1);
			}
			return;
		}

		if (!open) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setIsKeyboardNavigation(true);
				setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setIsKeyboardNavigation(true);
				setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
				break;
			case 'Enter':
				e.preventDefault();
				if (activeIndex >= 0 && filtered[activeIndex]) {
					handleSelect(filtered[activeIndex]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				setOpen(false);
				if (multiple) {
					setQuery('');
				}
				break;
			case 'Tab':
				setOpen(false);
				if (multiple) {
					setQuery('');
				}
				break;
			case 'Backspace':
				if (multiple && allowBackspaceDelete && !query && Array.isArray(storeValue) && storeValue.length > 0) {
					e.preventDefault();
					const newValues = storeValue.slice(0, -1);
					setFieldValue(formId, name, newValues);
				}
				break;
		}
	};

	return {
		handleInput,
		handleBoxClick,
		handleFocus,
		onKeyDown,
	};
};
