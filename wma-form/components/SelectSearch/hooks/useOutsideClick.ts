import React from 'react';

export function useOutsideClick(open: boolean, roots: React.RefObject<HTMLElement>[], onOutside: () => void) {
	React.useEffect(() => {
		if (!open) return;

		const handler = (e: MouseEvent) => {
			const t = e.target as Node;

			// Проверяем, что клик не по опции в дропдауне
			const isOptionClick = (t as Element).closest('[role="option"]') !== null;
			if (isOptionClick) return;

			// Проверяем, что клик не по самому контейнеру
			const isContainerClick = (t as Element).closest('.select-search-wrapper') !== null;
			if (isContainerClick) return;

			const inside = roots.some((r) => r.current && r.current.contains(t));
			if (!inside) {
				// Добавляем небольшую задержку для предотвращения конфликтов с onBlur
				setTimeout(() => {
					onOutside();
				}, 50);
			}
		};

		document.addEventListener('mousedown', handler, true);
		return () => document.removeEventListener('mousedown', handler, true);
	}, [open, roots, onOutside]);
}
