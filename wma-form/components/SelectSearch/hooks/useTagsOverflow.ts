import React from 'react';
import { checkTagsOverflow } from '../utils/tagsUtils';
import { Option } from '../types';

interface UseTagsOverflowOptions {
	rootRef: React.RefObject<HTMLDivElement>;
	currentValues: string[];
	allLoadedOptions: Option[];
	maxVisibleItems: number;
	multiple: boolean;
}

/**
 * Хук для управления переполнением тегов в мультиселекте
 * Включает динамическое изменение количества видимых элементов
 */
export function useTagsOverflow({ rootRef, currentValues, allLoadedOptions, maxVisibleItems, multiple }: UseTagsOverflowOptions) {
	const [dynamicMaxVisibleItems, setDynamicMaxVisibleItems] = React.useState(maxVisibleItems);

	// Функция для проверки переполнения тегов
	const checkTagsOverflowCallback = React.useCallback(() => {
		checkTagsOverflow(rootRef, currentValues, allLoadedOptions, maxVisibleItems, dynamicMaxVisibleItems, setDynamicMaxVisibleItems);
	}, [rootRef, currentValues, allLoadedOptions, maxVisibleItems, dynamicMaxVisibleItems]);

	// Проверяем переполнение тегов при изменении выбранных элементов
	React.useEffect(() => {
		if (!multiple) return;

		let rafId: number | null = null;
		const run = () => {
			rafId = requestAnimationFrame(() => {
				checkTagsOverflow(rootRef, currentValues, allLoadedOptions, maxVisibleItems, dynamicMaxVisibleItems, setDynamicMaxVisibleItems);
			});
		};

		if (currentValues.length > 0) {
			run();
		} else if (dynamicMaxVisibleItems !== maxVisibleItems) {
			setDynamicMaxVisibleItems(maxVisibleItems);
		}

		return () => {
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [multiple, currentValues, allLoadedOptions, maxVisibleItems, dynamicMaxVisibleItems, rootRef]);

	// Дополнительная проверка при изменении размера окна
	React.useEffect(() => {
		if (!multiple) return;

		let resizeRaf: number | null = null;
		let lastWidth = 0;

		const handleResize = () => {
			if (resizeRaf) cancelAnimationFrame(resizeRaf);
			resizeRaf = requestAnimationFrame(() => {
				const el = rootRef.current?.querySelector('.control') as HTMLElement | null;
				const width = el ? el.getBoundingClientRect().width : 0;
				if (width && Math.abs(width - lastWidth) < 2) return; // игнорируем микроколебания
				lastWidth = width;
				if (currentValues.length > 0) {
					checkTagsOverflow(rootRef, currentValues, allLoadedOptions, maxVisibleItems, dynamicMaxVisibleItems, setDynamicMaxVisibleItems);
				}
			});
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			if (resizeRaf) cancelAnimationFrame(resizeRaf);
		};
	}, [multiple, currentValues, allLoadedOptions, maxVisibleItems, dynamicMaxVisibleItems, rootRef]);

	return {
		dynamicMaxVisibleItems,
		checkTagsOverflowCallback,
	};
}
