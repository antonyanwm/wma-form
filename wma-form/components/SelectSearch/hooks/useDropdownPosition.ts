import React from 'react';
import { calculateDropdownPosition } from '../utils/positionUtils';
import { Option } from '../types';

interface UseDropdownPositionOptions {
	rootRef: React.RefObject<HTMLDivElement>;
	listRef: React.RefObject<HTMLDivElement>;
	filtered: Option[];
	open: boolean;
	multiple: boolean;
	checkTagsOverflowCallback?: () => void;
}

/**
 * Хук для управления позицией дропдауна
 * Включает расчет позиции, обработку resize и scroll событий
 */
export function useDropdownPosition({ rootRef, listRef, filtered, open, multiple, checkTagsOverflowCallback }: UseDropdownPositionOptions) {
	const [dropdownPosition, setDropdownPosition] = React.useState({
		top: 0,
		left: 0,
		width: 0,
		showAbove: false,
	});

	// Используем useRef для хранения актуальной ссылки на callback
	const checkTagsOverflowRef = React.useRef(checkTagsOverflowCallback);
	checkTagsOverflowRef.current = checkTagsOverflowCallback;

	// Расчет позиции дропдауна
	const calculatePosition = React.useCallback(() => {
		const position = calculateDropdownPosition(rootRef, listRef, filtered);
		setDropdownPosition(position);
	}, [filtered.length]);

	// Постоянное отслеживание позиции при открытом dropdown
	React.useEffect(() => {
		if (!open) return;

		calculatePosition();

		const handleResize = () => {
			calculatePosition();
			// Также пересчитываем переполнение тегов при изменении размера
			if (multiple && checkTagsOverflowRef.current) {
				checkTagsOverflowRef.current();
			}
		};
		const handleScroll = () => calculatePosition();

		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleScroll, true);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [open, calculatePosition, multiple]);

	return {
		dropdownPosition,
		calculatePosition,
	};
}
