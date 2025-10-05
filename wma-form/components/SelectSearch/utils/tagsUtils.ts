import React from 'react';
import { Option } from '../types';
import { SELECT_TEXTS } from '../constants/texts';

// Функция для проверки переполнения тегов
export const checkTagsOverflow = (
	rootRef: React.RefObject<HTMLDivElement>,
	currentValues: string[],
	allLoadedOptions: Option[],
	maxVisibleItems: number,
	dynamicMaxVisibleItems: number,
	setDynamicMaxVisibleItems: (value: number) => void,
	showTagLine: boolean = true
) => {
	if (!rootRef.current) return;

	// Если showTagLine = false, не проверяем переполнение, просто используем maxVisibleItems
	if (!showTagLine) {
		const newMaxVisible = Math.min(currentValues.length, maxVisibleItems);
		if (newMaxVisible !== dynamicMaxVisibleItems) {
			setDynamicMaxVisibleItems(newMaxVisible);
		}
		return;
	}

	const control = rootRef.current.querySelector('.control') as HTMLElement;
	if (!control) return;

	// Определяем доступное пространство для тегов с учетом всех элементов
	const getAvailableSpaceForTags = () => {
		const controlRect = control.getBoundingClientRect();
		const controlWidth = controlRect.width;

		// Находим префикс (если есть)
		const prefixIcon = control.querySelector('.prefix-icon') as HTMLElement;
		const prefixWidth = prefixIcon ? prefixIcon.getBoundingClientRect().width : 0;

		// Находим суффикс (если есть)
		const suffixIcon = control.querySelector('.suffix-icon') as HTMLElement;
		const suffixWidth = suffixIcon ? suffixIcon.getBoundingClientRect().width : 0;

		// Находим кнопку Clear All (если есть)
		const clearButton = control.querySelector('.button-clear-all') as HTMLElement;
		const clearButtonWidth = clearButton ? clearButton.getBoundingClientRect().width : 0;

		// Минимальная ширина инпута
		const minInputWidth = 50;

		// Подсчитываем количество элементов (для gap)
		let elementsCount = 0;
		if (prefixIcon) elementsCount++;
		if (suffixIcon) elementsCount++;
		if (clearButton) elementsCount++;
		elementsCount++; // +1 для инпута
		elementsCount++; // +1 для тегов

		// Gap между элементами (4px из CSS)
		const totalGapWidth = elementsCount * 4;

		// Получаем computed styles для точного расчета padding
		const computedStyle = window.getComputedStyle(control);
		const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
		const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
		const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
		const borderRight = parseFloat(computedStyle.borderRightWidth) || 0;

		// Доступное пространство = общая ширина - padding - border - префикс - суффикс - кнопка Clear All - минимальная ширина инпута - gap
		return controlWidth - paddingLeft - paddingRight - borderLeft - borderRight - prefixWidth - suffixWidth - clearButtonWidth - minInputWidth - totalGapWidth;
	};

	const availableWidth = getAvailableSpaceForTags();

	// Убеждаемся, что currentValues содержит только уникальные значения
	const uniqueCurrentValues = [...new Set(currentValues.filter((v) => v != null && v !== ''))];

	if (uniqueCurrentValues.length === 0) {
		// Если нет значений, сбрасываем к исходному значению
		if (dynamicMaxVisibleItems !== maxVisibleItems) {
			setDynamicMaxVisibleItems(maxVisibleItems);
		}
		return;
	}

	// Если тегов мало (1-2), показываем все без placeholder
	if (uniqueCurrentValues.length <= 2) {
		const maxToShow = Math.min(uniqueCurrentValues.length, maxVisibleItems);
		if (maxToShow !== dynamicMaxVisibleItems) {
			setDynamicMaxVisibleItems(maxToShow);
		}
		return;
	}

	// Для 3+ тегов проверяем переполнение
	let bestVisibleCount = Math.min(uniqueCurrentValues.length, maxVisibleItems);

	// Создаем контейнер для измерений один раз
	const measureContainer = document.createElement('div');
	measureContainer.style.visibility = 'hidden';
	measureContainer.style.position = 'absolute';
	measureContainer.style.top = '-9999px';
	measureContainer.style.left = '-9999px';
	measureContainer.style.whiteSpace = 'nowrap';
	measureContainer.className = `all-tag-wrapper ${showTagLine ? 'single-line' : ''}`;
	control.appendChild(measureContainer);

	try {
		// Проверяем каждое возможное количество видимых тегов
		for (let visibleCount = 1; visibleCount <= Math.min(uniqueCurrentValues.length, maxVisibleItems); visibleCount++) {
			// Очищаем контейнер
			measureContainer.innerHTML = '';

			// Добавляем видимые теги
			for (let i = 0; i < visibleCount; i++) {
				const value = uniqueCurrentValues[i];
				const option = allLoadedOptions.find((opt: Option) => String(opt.value) === value);
				const label = option?.label || value;

				const tagElement = document.createElement('span');
				tagElement.className = 'selected-tag';
				tagElement.innerHTML = `<span class="selected-tag-label">${label}</span><span class="selected-tag-remove">×</span>`;
				measureContainer.appendChild(tagElement);
			}

			// Если есть скрытые теги, добавляем placeholder
			const hiddenCount = uniqueCurrentValues.length - visibleCount;
			if (hiddenCount > 0) {
				const placeholderElement = document.createElement('span');
				placeholderElement.className = 'placeholder-tag';
				placeholderElement.textContent = `+${hiddenCount} ${SELECT_TEXTS.TAGS.MORE}`;
				measureContainer.appendChild(placeholderElement);
			}

			// Измеряем общую ширину
			const totalWidth = measureContainer.getBoundingClientRect().width;

			// Если все помещается, это наш лучший вариант
			if (totalWidth <= availableWidth) {
				bestVisibleCount = visibleCount;
			} else {
				// Если не помещается, останавливаемся на предыдущем варианте
				break;
			}
		}
	} finally {
		// Всегда удаляем контейнер для измерений
		control.removeChild(measureContainer);
	}

	// Обновляем количество видимых элементов только если значение изменилось
	const newMaxVisible = Math.max(1, bestVisibleCount);
	if (newMaxVisible !== dynamicMaxVisibleItems) {
		setDynamicMaxVisibleItems(newMaxVisible);
	}
};
