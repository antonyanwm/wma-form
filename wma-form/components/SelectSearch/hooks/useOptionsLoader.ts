import React from 'react';
import type { Option } from '../types';

type Params = {
	loadOptions?: (q: string) => Promise<Option[]>;
	staticOptions?: Option[];
	hideInput: boolean;
	visibleCount: number | typeof Infinity;
	debounceMs: number;
};

export function useOptionsLoader({ loadOptions, staticOptions, hideInput, visibleCount, debounceMs }: Params) {
	const [loading, setLoading] = React.useState(false);
	const [items, setItems] = React.useState<Option[]>([]);
	// removed unused highlight state

	const cacheRef = React.useRef<Map<string, Option[]>>(new Map());
	const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const reqIdRef = React.useRef(0);

	const immediateFilter = React.useCallback(
		(q: string) => {
			if (!loadOptions && staticOptions) {
				const search = q.trim().toLowerCase();
				const base = staticOptions;
				const filtered =
					hideInput || search === ''
						? base
						: base.filter((o) => {
								const lbl = (o.label ?? '').toString().toLowerCase();
								const val = String(o.value ?? '').toLowerCase();
								return lbl.includes(search) || val.includes(search);
						  });
				const cut = Number.isFinite(visibleCount) ? (filtered as Option[]).slice(0, visibleCount as number) : filtered;
				setItems(cut);
				setLoading(false);
				return;
			}
		},
		[loadOptions, staticOptions, hideInput, visibleCount]
	);

	const fetchOptions = React.useCallback(
		async (q: string, { immediate = false } = {}) => {
			if (!loadOptions) return immediateFilter(q);

			const cached = cacheRef.current.get(q);
			if (cached && !immediate) {
				setItems(cached);
				setLoading(false);
				return;
			}

			const rid = ++reqIdRef.current;
			setLoading(true);
			try {
				const list = await loadOptions(q);
				if (rid !== reqIdRef.current) return;
				const search = q.trim().toLowerCase();
				const arr = Array.isArray(list) ? list : [];
				const filtered =
					search === ''
						? arr
						: arr.filter((o) => {
								const lbl = (o.label ?? '').toString().toLowerCase();
								const val = String(o.value ?? '').toLowerCase();
								return lbl.includes(search) || val.includes(search);
						  });
				cacheRef.current.set(q, filtered);
				setItems(filtered);
			} finally {
				if (rid === reqIdRef.current) setLoading(false);
			}
		},
		[loadOptions, immediateFilter]
	);

	const debouncedFetch = React.useCallback(
		(q: string) => {
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => fetchOptions(q), debounceMs);
		},
		[fetchOptions, debounceMs]
	);

	React.useEffect(
		() => () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		},
		[]
	);

	return {
		loading,
		items,
		fetchOptions,
		debouncedFetch,
	};
}
