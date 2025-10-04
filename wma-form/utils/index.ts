import React from 'react';

export function cssEscapeSafe(id: string) {
	const esc = (globalThis as any).CSS?.escape;
	if (typeof esc === 'function') return esc(id);
	// Minimal polyfill: escape quotes and brackets
	return String(id)
		.replace(/["'`]/g, '$&')
		.replace(/[\]\[]/g, '$&');
}

export function focusFirstErrors(formEl: HTMLFormElement, firstInvalidName?: string) {
	if (!firstInvalidName) return;
	const nameEsc = cssEscapeSafe(firstInvalidName);
	Promise.resolve().then(() => {
		let el = (formEl.querySelector(`[name="${nameEsc}"]`) || formEl.querySelector(`[data-name="${nameEsc}"]`)) as HTMLElement | null;
		if (el && typeof (el as any).focus !== 'function') {
			el = el.querySelector<HTMLElement>('input,textarea,select,[tabindex]') || el;
		}
		el?.focus?.();
	});
}
