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
	setDynamicMaxVisibleItems: (value: number) => void
) => {
	if (!rootRef.current) return;

	const control = rootRef.current.querySelector('.control') as HTMLElement;
	if (!control) return;

	const controlRect = control.getBoundingClientRect();
	const availableWidth = controlRect.width - 40; // 40px для инпута и кнопок

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
	measureContainer.className = 'all-tag-wrapper';
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
			if (totalWidth <= availableWidth - 40) {
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
