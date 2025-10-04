// Export all components
export { Icon, default as IconComponent } from './Icon';
export type { IconProps } from './Icon';

export { Text, default as TextComponent } from './Text';
export type { TextProps } from './Text';

// Export i18n utilities
export { getTranslation, i18n, default as i18nInstance } from './i18n';
export type { TranslationFunction, I18nConfig } from './i18n';

// Re-export everything as default for convenience
import IconComponent from './Icon';
import TextComponent from './Text';
import { getTranslation, i18n as i18nInstance } from './i18n';

const WMAComponent = {
	Icon: IconComponent,
	Text: TextComponent,
	getTranslation: getTranslation,
	i18n: i18nInstance,
};

export default WMAComponent;
