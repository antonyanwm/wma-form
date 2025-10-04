// Тексты для компонента SelectSearch
export const SELECT_TEXTS = {
	// Placeholder тексты
	PLACEHOLDER: {
		SINGLE: 'Select an option...',
		MULTIPLE: 'Select options...',
	},

	// Сообщения в дропдауне
	DROPDOWN: {
		LOADING: 'Loading...',
		NO_OPTIONS: 'No options found',
	},

	// Кнопки
	BUTTONS: {
		CLEAR_ALL: 'Clear all',
	},

	// Теги
	TAGS: {
		MORE: 'more',
	},
} as const;

// Функция для получения placeholder текста
export const getPlaceholderText = (placeholder: boolean | string | undefined, multiple: boolean, defaultTexts: typeof SELECT_TEXTS = SELECT_TEXTS): string => {
	if (typeof placeholder === 'string') {
		return placeholder;
	}

	if (placeholder === false) {
		return multiple ? defaultTexts.PLACEHOLDER.MULTIPLE : defaultTexts.PLACEHOLDER.SINGLE;
	}

	// placeholder === true или undefined
	return multiple ? defaultTexts.PLACEHOLDER.MULTIPLE : defaultTexts.PLACEHOLDER.SINGLE;
};
