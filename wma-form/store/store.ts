'use client';

import { create } from 'zustand';
import { defaultValidators } from './validator';
import type { FieldValidator, FieldState, FormState, ComputedForm, FormsMeta, InputType } from './types';

/* Helpers */
const isCheckbox = (t?: string) => t === 'checkbox';
const isRadio = (t?: string) => t === 'radio';
const isMulti = (t?: string) => t === 'multiselect';

const coerceValue = (field: FieldState, v: any): any => {
	if (isCheckbox(field.type)) return Boolean(v);
	if (isMulti(field.type)) return Array.isArray(v) ? v : v == null ? [] : [String(v)];
	if (field.type === 'select' || isRadio(field.type)) return v;
	return typeof v === 'string' ? v : String(v ?? '');
};

const computeError = (field: FieldState, name: string): string => {
	const { validator, minLength, maxLength, label, required, ...opts } = field;
	const v: FieldValidator | undefined = validator || (required ? (defaultValidators as any)[field.type] || (defaultValidators as any).text : undefined);
	return v ? v({ value: field.value, name, label, opts: { minLength, maxLength, required, ...opts } }) : '';
};

const shallowEqual = (a: any, b: any) => {
	if (Object.is(a, b)) return true;
	if (!a || !b) return false;
	const ka = Object.keys(a),
		kb = Object.keys(b);
	if (ka.length !== kb.length) return false;
	for (const k of ka) if (!Object.is(a[k], b[k])) return false;
	return true;
};

/* Store interface */
interface Store {
	forms: Record<string, FormState>;
	formsMeta: FormsMeta;
	computed: Record<string, ComputedForm>;

	registerField: (args: {
		formId: string;
		name: string;
		label?: string;
		options?: {
			required?: boolean;
			validator?: FieldValidator;
			type?: InputType;
			initialValue?: any;
			maxLength?: number;
			minLength?: number;
			radioGroup?: string;
			mirrorOf?: string;
			mirrorWhen?: 'valid' | 'always';
			mirrorIfEmptyOnly?: boolean;
			[key: string]: any;
		};
	}) => void;
	unregisterField: (formId: string, name: string) => void;

	setFieldValue: (formId: string, name: string, value: any, extra?: Record<string, any>) => void;
	setFieldTouched: (formId: string, name: string, touched?: boolean) => void;
	setFieldFocused: (formId: string, name: string, focused: boolean) => void;

	isFieldValid: (formId: string, name: string) => boolean;
	validateField: (args: { formId: string; name: string }) => boolean;
	validateForm: (args: { formId: string }) => boolean;

	getFormData: (args: { formId: string }) => Record<string, FieldState>;
	getFormAllFieldData: (args: { formId: string }) => FormState;

	clearFormErrors: (args: { formId: string }) => void;
	setServerErrors: (args: { formId: string; errors: Record<string, string> }) => void;

	resetForm: (args: { formId: string; except?: string[] }) => void;
	resetAllForms: () => void;

	beginSubmit: (formId: string) => void;
	submitSuccess: (formId: string) => void;
	submitError: (formId: string) => void;

	arrayAppend: (args: { formId: string; array: string; template: Record<string, any> }) => void;
	arrayInsert: (args: { formId: string; array: string; index: number; template: Record<string, any> }) => void;
	arrayRemove: (args: { formId: string; array: string; index: number }) => void;
	arraySwap: (args: { formId: string; array: string; i: number; j: number }) => void;
	arrayMove: (args: { formId: string; array: string; from: number; to: number }) => void;

	_recompute: (formId: string) => void;

	// selector factories
	value$: (formId: string, name: string) => (s: Store) => any;
	error$: (formId: string, name: string) => (s: Store) => string | undefined;
	isFieldValid$: (formId: string, name: string) => (s: Store) => boolean;
	formValues$: (formId: string) => (s: Store) => Record<string, any>;
	formErrors$: (formId: string) => (s: Store) => Record<string, string>;
	formIsValid$: (formId: string) => (s: Store) => boolean;
}

export const useFormStore = create<Store>((set, get) => ({
	forms: {},
	formsMeta: {},
	computed: {},

	_recompute: (formId) => {
		const forms = get().forms;
		const form = forms[formId] || {};
		const values: Record<string, any> = {};
		const errors: Record<string, string> = {};
		for (const [name, f] of Object.entries(form)) {
			values[name] = (f as FieldState).value;
			errors[name] = computeError(f as FieldState, name);
		}
		const isValid = Object.values(errors).every((e) => e === '');
		set((s) => ({ computed: { ...s.computed, [formId]: { values, errors, isValid } } }));
	},

	registerField: ({ formId, name, label, options = {} }) => {
		set((state) => {
			const { required = false, validator, type = 'text', initialValue, minLength, maxLength, radioGroup, mirrorOf, mirrorWhen = 'valid', mirrorIfEmptyOnly = true, ...rest } = options;

			const oldForm = state.forms[formId] || {};
			const existing = oldForm[name];

			let value: any;
			if (existing && 'value' in existing) {
				value = (existing as FieldState).value;
			} else if (isCheckbox(type)) {
				value = typeof initialValue === 'boolean' ? initialValue : false;
			} else if (isRadio(type)) {
				value = initialValue ?? null;
			} else {
				value = initialValue ?? '';
			}

			const next: FieldState = {
				...(existing as any),
				value,
				error: (existing as any)?.error ?? '',
				touched: false,
				focused: false,
				required,
				validator,
				type,
				minLength,
				maxLength,
				label,
				radioGroup,
				mirrorOf,
				mirrorWhen,
				mirrorIfEmptyOnly,
				...rest,
			};

			if (existing && shallowEqual(existing, next)) return {};
			return { forms: { ...state.forms, [formId]: { ...oldForm, [name]: next } } };
		});
		get()._recompute(formId);
	},

	unregisterField: (formId, name) => {
		set((state) => {
			const form = state.forms[formId];
			if (!form || !(name in form)) return {};
			const { [name]: _, ...rest } = form;
			return { forms: { ...state.forms, [formId]: rest } };
		});
		get()._recompute(formId);
	},

	setFieldValue: (formId, name, value, extra = {}) => {
		set((state) => {
			const form = state.forms[formId];
			if (!form) return {};
			const field = form[name];
			if (!field) return {};

			// radio
			let nextForm: FormState = form;
			if (isRadio(field.type) && field.radioGroup) {
				const group = field.radioGroup;
				const updated: FormState = { ...nextForm };
				for (const [n, f] of Object.entries(nextForm)) {
					if ((f as FieldState).radioGroup === group && n !== name) {
						updated[n] = { ...(f as FieldState), value: null };
					}
				}
				nextForm = updated;
			}

			const real = coerceValue(field as FieldState, value);
			let nextField: FieldState = { ...nextForm[name], value: real };
			Object.assign(nextField as any, extra);
			nextField.error = computeError(nextField, name);

			nextForm = { ...nextForm, [name]: nextField };

			// MIRROR
			for (const [otherName, otherField] of Object.entries(nextForm)) {
				if (otherName === name) continue;
				const mf = otherField as FieldState;
				if (!mf?.mirrorOf || mf.mirrorOf !== name) continue;

				const sourceValid = nextField.error === '';
				const shouldCopy = mf.mirrorWhen === 'always' || (mf.mirrorWhen ?? 'valid') === 'valid' ? sourceValid : false;
				if (!shouldCopy) continue;

				const isEmptyTarget = mf.value == null || mf.value === '' || (typeof mf.value === 'object' && Object.keys(mf.value).length === 0);
				if (mf.mirrorIfEmptyOnly && !isEmptyTarget) continue;

				const mirrored: FieldState = { ...mf, value: nextField.value };
				mirrored.error = computeError(mirrored, otherName);
				nextForm = { ...nextForm, [otherName]: mirrored };
			}

			if (shallowEqual(form, nextForm)) return {};
			return { forms: { ...state.forms, [formId]: nextForm } };
		});
		get()._recompute(formId);
	},

	setFieldTouched: (formId, name, touched = true) => {
		set((state) => {
			const form = state.forms[formId];
			if (!form) return {};
			const field = form[name];
			if (!field || field.touched === touched) return {};
			const next = { ...field, touched } as FieldState;
			return { forms: { ...state.forms, [formId]: { ...form, [name]: next } } };
		});
		get()._recompute(formId);
	},

	setFieldFocused: (formId, name, focused) => {
		set((state) => {
			const form = state.forms[formId];
			if (!form) return {};
			const field = form[name];
			if (!field || field.focused === focused) return {};
			const next = { ...field, focused } as FieldState;
			return { forms: { ...state.forms, [formId]: { ...form, [name]: next } } };
		});
		get()._recompute(formId);
	},

	isFieldValid: (formId, name) => {
		const f = get().forms[formId]?.[name];
		if (!f) return false;
		return computeError(f as FieldState, name) === '';
	},

	validateField: ({ formId, name }) => {
		const forms = get().forms;
		const form = forms[formId];
		const field = form?.[name] as FieldState | undefined;
		if (!field) return false;

		const error = computeError(field, name);
		if (field.error === error && field.touched === true) {
			get()._recompute(formId);
			return error === '';
		}
		set((state) => ({
			forms: {
				...state.forms,
				[formId]: { ...state.forms[formId], [name]: { ...(field as FieldState), error, touched: true } },
			},
		}));
		get()._recompute(formId);
		return error === '';
	},

	validateForm: ({ formId }) => {
		const form = get().forms[formId];
		if (!form || Object.keys(form).length === 0) {
			get()._recompute(formId);
			return true;
		}
		const results = Object.keys(form).map((n) => get().validateField({ formId, name: n }));
		const ok = results.every(Boolean);
		get()._recompute(formId);
		return ok;
	},

	getFormData: ({ formId }) => {
		const form = get().forms[formId] || {};
		return Object.fromEntries(Object.entries(form).map(([n, f]) => [n, f as any]));
	},
	getFormAllFieldData: ({ formId }) => get().forms[formId] || {},

	clearFormErrors: ({ formId }) => {
		set((state) => {
			const form = state.forms[formId];
			if (!form) return {};
			const next: FormState = {};
			let changed = false;
			for (const [n, f] of Object.entries(form)) {
				if ((f as FieldState).error) {
					next[n] = { ...(f as FieldState), error: '' } as FieldState;
					changed = true;
				} else next[n] = f as FieldState;
			}
			if (!changed) return {};
			return { forms: { ...state.forms, [formId]: next } };
		});
		get()._recompute(formId);
	},

	setServerErrors: ({ formId, errors }) => {
		set((state) => {
			const form = state.forms[formId];
			if (!form) return {};
			const next: FormState = { ...(form as FormState) };
			for (const [name, msg] of Object.entries(errors)) {
				if (next[name]) next[name] = { ...(next[name] as FieldState), error: msg, touched: true } as FieldState;
			}
			return {
				forms: { ...state.forms, [formId]: next },
				formsMeta: { ...state.formsMeta, [formId]: { ...(state.formsMeta[formId] || { status: 'idle' }), serverErrors: errors } },
			};
		});
		get()._recompute(formId);
	},

	resetForm: ({ formId, except = [] }) => {
		set((state) => {
			const form = state.forms[formId];
			if (!form) return {};
			if (except.length === 0) {
				const { [formId]: _, ...restForms } = state.forms;
				const { [formId]: __, ...restMeta } = state.formsMeta;
				const { [formId]: ___, ...restComputed } = state.computed;
				return { forms: restForms, formsMeta: restMeta, computed: restComputed };
			}
			const keep: FormState = {};
			for (const name of Object.keys(form)) {
				if (!except.includes(name)) continue;
				const f = form[name] as FieldState;
				keep[name] = { ...f, error: '', touched: false, focused: false } as FieldState;
			}
			return { forms: { ...state.forms, [formId]: keep }, formsMeta: { ...state.formsMeta, [formId]: { status: 'idle' } } };
		});
		get()._recompute(formId);
	},

	resetAllForms: () => {
		set(() => ({
			forms: {},
			formsMeta: {},
			computed: {},
		}));
	},

	beginSubmit: (formId) => set((s) => ({ formsMeta: { ...s.formsMeta, [formId]: { ...(s.formsMeta[formId] || {}), status: 'loading' } } })),
	submitSuccess: (formId) => set((s) => ({ formsMeta: { ...s.formsMeta, [formId]: { ...(s.formsMeta[formId] || {}), status: 'success' } } })),
	submitError: (formId) => set((s) => ({ formsMeta: { ...s.formsMeta, [formId]: { ...(s.formsMeta[formId] || {}), status: 'error' } } })),

	// arrays helpers
	arrayAppend: ({ formId, array, template }) => {
		set((state) => {
			const form = state.forms[formId] || {};
			let max = -1;
			for (const key of Object.keys(form)) {
				const m = key.match(new RegExp(`^${array}\\[(\\d+)\\]`));
				if (m) max = Math.max(max, Number(m[1]));
			}
			const idx = max + 1;
			const next: FormState = { ...form };
			for (const [tplKey, tplVal] of Object.entries(template)) {
				const name = tplKey.replace('IDX', String(idx));
				const exist = next[name];
				const type: InputType = (exist?.type as InputType) || (typeof tplVal === 'boolean' ? 'checkbox' : typeof tplVal === 'object' ? 'select' : 'text');
				const value = exist ? (exist as FieldState).value : tplVal;
				next[name] = { ...(exist as any), type, value, error: '', touched: false, focused: false, required: !!exist?.required };
			}
			return { forms: { ...state.forms, [formId]: next } };
		});
		get()._recompute(formId);
	},

	arrayInsert: ({ formId, array, index, template }) => {
		set((state) => {
			const form = state.forms[formId] || {};
			const next: FormState = {};
			for (const [name, field] of Object.entries(form)) {
				const m = name.match(new RegExp(`^(${array})\\[(\\d+)\\](.*)$`));
				if (m) {
					const i = Number(m[2]);
					if (i >= index) next[`${m[1]}[${i + 1}]${m[3]}`] = field as FieldState;
					else next[name] = field as FieldState;
				} else next[name] = field as FieldState;
			}
			for (const [tplKey, tplVal] of Object.entries(template)) {
				const name = tplKey.replace('IDX', String(index));
				const exist = next[name];
				const type: InputType = (exist?.type as InputType) || (typeof tplVal === 'boolean' ? 'checkbox' : typeof tplVal === 'object' ? 'select' : 'text');
				const value = exist ? (exist as FieldState).value : tplVal;
				next[name] = { ...(exist as any), type, value, error: '', touched: false, focused: false, required: !!exist?.required };
			}
			return { forms: { ...state.forms, [formId]: next } };
		});
		get()._recompute(formId);
	},

	arrayRemove: ({ formId, array, index }) => {
		set((state) => {
			const form = state.forms[formId] || {};
			const next: FormState = {};
			for (const [name, field] of Object.entries(form)) {
				const m = name.match(new RegExp(`^(${array})\\[(\\d+)\\](.*)$`));
				if (!m) next[name] = field as FieldState;
				else {
					const i = Number(m[2]);
					if (i === index) continue;
					const newIdx = i > index ? i - 1 : i;
					next[`${m[1]}[${newIdx}]${m[3]}`] = field as FieldState;
				}
			}
			return { forms: { ...state.forms, [formId]: next } };
		});
		get()._recompute(formId);
	},

	arraySwap: ({ formId, array, i, j }) => {
		set((state) => {
			const form = state.forms[formId] || {};
			const next: FormState = {};
			for (const [name, field] of Object.entries(form)) {
				const m = name.match(new RegExp(`^(${array})\\[(\\d+)\\](.*)$`));
				if (!m) next[name] = field as FieldState;
				else {
					const idx = Number(m[2]);
					const newIdx = idx === i ? j : idx === j ? i : idx;
					next[`${m[1]}[${newIdx}]${m[3]}`] = field as FieldState;
				}
			}
			return { forms: { ...state.forms, [formId]: next } };
		});
		get()._recompute(formId);
	},

	arrayMove: ({ formId, array, from, to }) => {
		set((state) => {
			const form = state.forms[formId] || {};
			if (from === to) return {};
			const next: FormState = {};
			for (const [name, field] of Object.entries(form)) {
				const m = name.match(new RegExp(`^(${array})\\[(\\d+)\\](.*)$`));
				if (!m) next[name] = field as FieldState;
				else {
					const idx = Number(m[2]);
					let newIdx = idx;
					if (idx === from) newIdx = to;
					else if (from < to && idx > from && idx <= to) newIdx = idx - 1;
					else if (from > to && idx >= to && idx < from) newIdx = idx + 1;
					next[`${m[1]}[${newIdx}]${m[3]}`] = field as FieldState;
				}
			}
			return { forms: { ...state.forms, [formId]: next } };
		});
		get()._recompute(formId);
	},

	/* selector factories */
	value$: (formId, name) => (s) => s.forms[formId]?.[name]?.value,
	error$: (formId, name) => (s) => s.forms[formId]?.[name]?.error,
	isFieldValid$: (formId, name) => (s) => {
		const f = s.forms[formId]?.[name] as FieldState | undefined;
		return !!f && computeError(f, name) === '';
	},
	formValues$: (formId) => (s) => s.computed[formId]?.values ?? {},
	formErrors$: (formId) => (s) => s.computed[formId]?.errors ?? {},
	formIsValid$: (formId) => (s) => s.computed[formId]?.isValid ?? false,
}));
