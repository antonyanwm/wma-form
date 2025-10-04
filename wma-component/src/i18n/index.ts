export interface TranslationFunction {
	(key: string, params?: Record<string, any>): string;
}

export interface I18nConfig {
	locale: string;
	fallbackLocale: string;
	translations: Record<string, Record<string, string>>;
}

// Default translations
const defaultTranslations: Record<string, Record<string, string>> = {
	en: {
		'form.required': 'This field is required',
		'form.invalid': 'This field is invalid',
		'form.email': 'Please enter a valid email address',
		'form.minLength': 'Minimum length is {min} characters',
		'form.maxLength': 'Maximum length is {max} characters',
		'form.min': 'Minimum value is {min}',
		'form.max': 'Maximum value is {max}',
		'form.pattern': 'Please enter a valid format',
		'form.custom': 'Please check this field',
		'button.save': 'Save',
		'button.cancel': 'Cancel',
		'button.submit': 'Submit',
		'button.reset': 'Reset',
		'button.loading': 'Loading...',
		'text.required': 'Required',
		'text.optional': 'Optional',
	},
};

// Simple i18n implementation
class I18n {
	#config: I18nConfig;

	constructor(config: Partial<I18nConfig> = {}) {
		this.#config = {
			locale: 'en',
			fallbackLocale: 'en',
			translations: defaultTranslations,
			...config,
		};
	}

	setLocale(locale: string): void {
		this.#config.locale = locale;
	}

	getLocale(): string {
		return this.#config.locale;
	}

	t(key: string, params?: Record<string, any>): string {
		const { locale, fallbackLocale, translations } = this.#config;

		let translation = translations[locale]?.[key] || translations[fallbackLocale]?.[key] || key;

		if (params) {
			Object.entries(params).forEach(([paramKey, value]) => {
				translation = translation.replace(`{${paramKey}}`, String(value));
			});
		}

		return translation;
	}

	addTranslations(locale: string, translations: Record<string, string>): void {
		if (!this.#config.translations[locale]) {
			this.#config.translations[locale] = {};
		}
		this.#config.translations[locale] = { ...this.#config.translations[locale], ...translations };
	}

	getTranslations(locale?: string): Record<string, string> {
		const targetLocale = locale || this.#config.locale;
		return this.#config.translations[targetLocale] || {};
	}

	getAvailableLocales(): string[] {
		return Object.keys(this.#config.translations);
	}
}

// Create default instance
const i18n = new I18n();

// Export translation function (not a React hook)
export function getTranslation(): TranslationFunction {
	return (key: string, params?: Record<string, any>) => i18n.t(key, params);
}

// Export i18n instance for configuration
export { i18n };

// Export default
export default i18n;
