import React from 'react';

// Глобальное состояние для отслеживания открытых дропдаунов
let openDropdowns = new Set<string>();

const closeAllDropdowns = (except?: string) => {
	openDropdowns.forEach((id) => {
		if (id !== except) {
			const event = new CustomEvent('closeDropdown', { detail: { id } });
			document.dispatchEvent(event);
		}
	});
	openDropdowns.clear();
	if (except) {
		openDropdowns.add(except);
	}
};

interface UseDropdownManagerOptions {
	componentId: string;
	multiple: boolean;
	setQuery?: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Хук для управления состоянием дропдауна
 * Включает открытие/закрытие, активный индекс, клавиатурную навигацию
 */
export function useDropdownManager({ componentId, multiple, setQuery }: UseDropdownManagerOptions) {
	const [open, setOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState(-1);
	const [isKeyboardNavigation, setIsKeyboardNavigation] = React.useState(false);

	// Функция для открытия дропдауна
	const openDropdown = React.useCallback(() => {
		closeAllDropdowns(componentId);
		setOpen(true);
		setActiveIndex(0);
	}, [componentId]);

	// Функция для закрытия дропдауна
	const closeDropdown = React.useCallback(() => {
		setOpen(false);
		setActiveIndex(-1);
		if (multiple && setQuery) {
			setQuery('');
		}
	}, [multiple, setQuery]);

	// Обработчик глобальных событий закрытия дропдаунов
	React.useEffect(() => {
		const handleCloseDropdown = (e: Event) => {
			const customEvent = e as CustomEvent<{ id: string }>;
			if (customEvent.detail?.id === componentId) {
				closeDropdown();
			}
		};

		document.addEventListener('closeDropdown', handleCloseDropdown);
		return () => document.removeEventListener('closeDropdown', handleCloseDropdown);
	}, [componentId, closeDropdown]);

	// Устанавливаем активный индекс при открытии дропдауна
	React.useEffect(() => {
		if (open) {
			setActiveIndex(0);
		}
	}, [open]);

	return {
		open,
		setOpen,
		activeIndex,
		setActiveIndex,
		isKeyboardNavigation,
		setIsKeyboardNavigation,
		openDropdown,
		closeDropdown,
		closeAllDropdowns,
	};
}






