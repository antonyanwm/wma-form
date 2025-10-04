export type FieldValidator = ({ value, name, label, opts }: { value: any; name: string; label: string; opts?: Record<string, any> }) => string;

export const defaultValidators: Record<string, FieldValidator> = {
	email: ({ value, name, label }) => (!value ? `${label}Required` : !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value) ? `${label}InvalidError` : ''),

	phone: ({ value, name, label }) => (!value ? `${label}Required` : !/^\+?[0-9\s\-()]{7,20}$/.test(value) ? `${label}InvalidError` : ''),

	text: ({ value, name, label, opts = {} }) => {
		if (!value) return `${label}Required`;
		if (opts.minLength && value.length < opts.minLength) return `${label}TooShort`;
		if (opts.maxLength && value.length > opts.maxLength) return `${label}TooLong`;
		return '';
	},

	number: ({ value, name, label, opts = {} }) => {
		if (value === undefined || value === null || value === '') return `${label}Required`;
		const num = Number(value);
		if (isNaN(num)) return `${label}InvalidError`;
		if (opts.min !== undefined && num < opts.min) return `${label}Min`;
		if (opts.max !== undefined && num > opts.max) return `${label}Max`;
		return '';
	},

	checkbox: ({ value, name, label }) => (!value || value === false ? `${label}Required` : ''),

	radio: ({ value, name, label }) => (!value ? `${label}Required` : ''),

	select: ({ value, name, label, opts = {} }) => {
		if (opts.required && !value) {
			return `${label}Required`;
		}

		return '';
	},

	multiselect: ({ value, name, label, opts = {} }) => {
		if (opts.required && (!Array.isArray(value) || value.length === 0)) {
			return `${label}Required`;
		}

		return '';
	},
};
