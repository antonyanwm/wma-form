import React from 'react';

interface UseSelectAccessibilityOptions {
	formId: string;
	name: string;
	open: boolean;
	activeIndex: number;
	listRef: React.RefObject<HTMLDivElement>;
}

/**
 * Хук для управления доступностью селекта
 * Включает генерацию ID, автоскролл к активной опции
 */
export function useSelectAccessibility({ formId, name, open, activeIndex, listRef }: UseSelectAccessibilityOptions) {
	// ID для доступности
	const inputId = `select-search-${formId}-${name}`;
	const listId = `select-search-list-${formId}-${name}`;
	const activeId = activeIndex >= 0 ? `option-${formId}-${name}-${activeIndex}` : undefined;

	// Автоскролл к активной опции
	React.useEffect(() => {
		if (!open || !listRef.current || activeIndex < 0) return;

		const listElement = listRef.current;
		const activeElement = listElement.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;

		if (activeElement) {
			activeElement.scrollIntoView({
				block: 'nearest',
				behavior: 'smooth',
			});
		}
	}, [open, activeIndex, listRef]);

	return {
		inputId,
		listId,
		activeId,
	};
}






