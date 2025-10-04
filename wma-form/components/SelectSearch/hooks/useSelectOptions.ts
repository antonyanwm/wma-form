import React from 'react';
import { Option } from '../types';

interface UseSelectOptionsOptions {
	options?: Option[];
	loadedOptions: Option[];
	query: string;
	visibleCount: number;
	hideSelectedFromDropdown: boolean;
	multiple: boolean;
	currentValues: string[];
}

/**
 * Хук для управления опциями селекта
 * Включает дедупликацию, фильтрацию и обработку hideSelectedFromDropdown
 */
export function useSelectOptions({ options, loadedOptions, query, visibleCount, hideSelectedFromDropdown, multiple, currentValues }: UseSelectOptionsOptions) {
	// Состояние для хранения всех загруженных опций (для отображения выбранных элементов)
	const [allLoadedOptions, setAllLoadedOptions] = React.useState<Option[]>([]);

	// Стабилизируем массив опций с помощью useMemo и глубокого сравнения
	const stableOptions = React.useMemo(() => {
		if (!options || options.length === 0) return [];
		// Создаем стабильный массив с уникальными значениями
		return options.reduce((acc: Option[], option: Option) => {
			const existingIndex = acc.findIndex((opt) => String(opt.value) === String(option.value));
			if (existingIndex === -1) {
				acc.push(option);
			}
			return acc;
		}, []);
	}, [options]);

	// Инициализируем все загруженные опции для статических опций
	React.useEffect(() => {
		setAllLoadedOptions((prev) => {
			// Если нет опций, очищаем
			if (stableOptions.length === 0) {
				return prev.length === 0 ? prev : [];
			}

			// Проверяем, изменились ли опции
			const hasChanged =
				prev.length !== stableOptions.length ||
				prev.some((prevOpt, index) => {
					const newOpt = stableOptions[index];
					return !newOpt || String(prevOpt.value) !== String(newOpt.value) || prevOpt.label !== newOpt.label;
				});

			if (hasChanged) {
				return stableOptions;
			}
			return prev;
		});
	}, [stableOptions]);

	// Стабилизируем loadedOptions
	const stableLoadedOptions = React.useMemo(() => {
		if (!loadedOptions || loadedOptions.length === 0) return [];
		return loadedOptions.reduce((acc: Option[], option: Option) => {
			const existingIndex = acc.findIndex((opt) => String(opt.value) === String(option.value));
			if (existingIndex === -1) {
				acc.push(option);
			}
			return acc;
		}, []);
	}, [loadedOptions]);

	// Обновляем все загруженные опции при загрузке новых опций
	React.useEffect(() => {
		if (stableLoadedOptions.length > 0) {
			setAllLoadedOptions((prev) => {
				// Объединяем предыдущие опции с новыми, избегая дублирования
				const existingValues = new Set(prev.map((opt) => String(opt.value)));
				const newOptions = stableLoadedOptions.filter((opt) => !existingValues.has(String(opt.value)));

				if (newOptions.length === 0) {
					return prev; // Нет новых опций для добавления
				}

				return [...prev, ...newOptions];
			});
		}
	}, [stableLoadedOptions]);

	// Фильтрация опций
	const filtered = React.useMemo(() => {
		// Используем все загруженные опции (включая статические и динамические)
		const uniqueOptions = allLoadedOptions;

		// Фильтруем выбранные элементы, если включена опция hideSelectedFromDropdown
		let filteredOptions = uniqueOptions;
		if (hideSelectedFromDropdown && multiple && currentValues.length > 0) {
			filteredOptions = uniqueOptions.filter((option: Option) => !currentValues.includes(String(option.value)));
		}

		const q = (query ?? '').toString().trim().toLowerCase();
		if (!q) return filteredOptions.slice(0, visibleCount);

		return filteredOptions
			.filter((option: Option) => {
				const lbl = (option.label ?? '').toString().toLowerCase();
				const val = String(option.value ?? '').toLowerCase();
				return lbl.includes(q) || val.includes(q);
			})
			.slice(0, visibleCount);
	}, [allLoadedOptions, query, visibleCount, hideSelectedFromDropdown, multiple, currentValues]);

	return {
		allLoadedOptions,
		setAllLoadedOptions,
		filtered,
	};
}
