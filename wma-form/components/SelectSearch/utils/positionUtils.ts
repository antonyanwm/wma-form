import React from 'react';
import { Option } from '../types';

// Утилита для создания временных элементов для измерения
export const createTempElement = (className: string, content?: string): HTMLElement => {
	const element = document.createElement('div');
	element.className = className;
	element.style.visibility = 'hidden';
	element.style.position = 'absolute';
	element.style.top = '-9999px';
	element.style.left = '-9999px';
	if (content) {
		element.textContent = content;
	}
	return element;
};

export const measureElement = (element: HTMLElement): number => {
	document.body.appendChild(element);
	const height = element.getBoundingClientRect().height;
	document.body.removeChild(element);
	return height;
};

// Расчет позиции дропдауна
export const calculateDropdownPosition = (rootRef: React.RefObject<HTMLDivElement>, listRef: React.RefObject<HTMLDivElement>, filtered: Option[]) => {
	if (!rootRef.current) return { top: 0, left: 0, width: 0, showAbove: false };

	const rect = rootRef.current.getBoundingClientRect();
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

	// Получаем реальные размеры только из refs и DOM
	let estimatedHeight = 0;

	if (listRef.current) {
		// Если дропдаун уже существует, используем его реальную высоту
		estimatedHeight = listRef.current.getBoundingClientRect().height;
	} else {
		// Создаем временный дропдаун для измерения
		const tempDropdown = createTempElement('dropdown');
		tempDropdown.style.width = `${rect.width}px`;
		tempDropdown.style.maxHeight = 'none';

		const tempListWrapper = createTempElement('list-wrapper');
		tempDropdown.appendChild(tempListWrapper);

		// Добавляем все опции для точного измерения
		filtered.forEach((option: Option) => {
			const tempOption = createTempElement('dropdown-option', option.label);
			tempListWrapper.appendChild(tempOption);
		});

		estimatedHeight = measureElement(tempDropdown);
	}

	const spaceBelow = window.innerHeight - rect.bottom;
	const spaceAbove = rect.top;

	// Получаем минимальное пространство из реальных размеров
	const minSpaceRequired = estimatedHeight > 0 ? estimatedHeight / 10 : 0;
	const showAbove = spaceBelow < estimatedHeight + minSpaceRequired && spaceAbove > estimatedHeight + minSpaceRequired;

	// Рассчитываем позицию с учетом границ viewport
	let top = showAbove ? rect.top - estimatedHeight : rect.bottom;
	let left = rect.left;

	// Проверяем, не выходит ли дропдаун за границы экрана
	const viewportWidth = window.innerWidth;
	const dropdownWidth = rect.width;

	// Если дропдаун выходит за правую границу, сдвигаем влево
	if (left + dropdownWidth > viewportWidth) {
		left = viewportWidth - dropdownWidth;
	}

	// Если дропдаун выходит за левую границу, сдвигаем вправо
	if (left < 0) {
		left = 0;
	}

	return {
		top: top + scrollTop,
		left: left + scrollLeft,
		width: rect.width,
		showAbove,
	};
};
