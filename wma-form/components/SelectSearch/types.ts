import React from 'react';

export type Option = {
	label: string;
	value: string | number;
	[key: string]: any;
};

export type SelectSearchProps = {
	label: string;
	name: string;
	formId: string;

	loadOptions?: (input: string) => Promise<Option[]>;
	options?: Option[];

	placeholder?: boolean | string;
	required?: boolean;
	className?: string;
	validator?: ({ value, name, opts }: { value: string; name?: string; opts?: any }) => string;
	initialValue?: string | string[]; // Поддержка как строки, так и массива
	maxLength?: number;
	minLength?: number;
	disabled?: boolean;

	visibleCount?: number;
	hideInput?: boolean;
	debounceMs?: number;

	hideErrorOnFocus?: boolean;
	icon?: string;

	// Новые пропсы для объединенного компонента
	multiple?: boolean; // Режим множественного выбора
	maxVisibleItems?: number; // Максимум видимых элементов в чипах (только для multiple)
	allowBackspaceDelete?: boolean; // Разрешить удаление последнего элемента кнопкой Backspace (только для multiple)
	hideSelectedFromDropdown?: boolean; // Скрывать выбранные элементы из дропдауна (только для multiple)

	// Кастомизация Clear All
	hideClearButton?: boolean; // Скрыть встроенную кнопку Clear All

	// Внешнее управление (удалено для упрощения API)
};
