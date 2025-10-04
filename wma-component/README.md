# WMA Component Library

A lightweight React component library with essential UI components and utilities.

## Features

-   🎨 **Icon Component** - Flexible icon component with customizable size and color
-   📝 **Text Component** - Typography component with variants, sizes, and weights
-   🌍 **i18n Support** - Internationalization utilities with React hooks
-   📦 **TypeScript** - Full TypeScript support with type definitions
-   🧪 **Testing** - Comprehensive test suite with Jest and React Testing Library
-   🎯 **Tree Shaking** - Optimized bundle size with ES modules

## Installation

```bash
npm install wma-component
```

## Usage

### Icon Component

```tsx
import { Icon } from 'wma-component';

function App() {
	return (
		<div>
			<Icon
				name='home'
				size={24}
				color='blue'
			/>
			<Icon
				name='user'
				size={16}
				className='custom-icon'
			/>
		</div>
	);
}
```

### Text Component

```tsx
import { Text } from 'wma-component';

function App() {
	return (
		<div>
			<Text
				as='h1'
				size='2xl'
				weight='bold'>
				Main Title
			</Text>
			<Text
				variant='secondary'
				size='sm'>
				Subtitle text
			</Text>
			<Text
				variant='error'
				truncate>
				This is a very long error message that will be truncated
			</Text>
		</div>
	);
}
```

### i18n Utilities

```tsx
import { useTranslation, i18n } from 'wma-component';

// Configure translations
i18n.addTranslations('en', {
	'welcome.message': 'Welcome, {name}!',
	'button.save': 'Save Changes',
});

function App() {
	const t = useTranslation();

	return (
		<div>
			<h1>{t('welcome.message', { name: 'John' })}</h1>
			<button>{t('button.save')}</button>
		</div>
	);
}
```

## API Reference

### Icon Props

| Prop      | Type             | Default | Description            |
| --------- | ---------------- | ------- | ---------------------- |
| name      | string           | -       | Icon name/identifier   |
| size      | number \| string | 16      | Icon size in pixels    |
| color     | string           | -       | Icon color             |
| className | string           | -       | Additional CSS classes |

### Text Props

| Prop       | Type                                                                     | Default   | Description                 |
| ---------- | ------------------------------------------------------------------------ | --------- | --------------------------- |
| children   | ReactNode                                                                | -         | Text content                |
| text       | string                                                                   | -         | Alternative text content    |
| as         | keyof JSX.IntrinsicElements                                              | 'span'    | HTML element type           |
| variant    | 'primary' \| 'secondary' \| 'muted' \| 'error' \| 'success' \| 'warning' | 'primary' | Text color variant          |
| size       | 'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl' \| '2xl' \| '3xl'                 | 'base'    | Text size                   |
| weight     | 'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold'                  | 'normal'  | Font weight                 |
| truncate   | boolean                                                                  | false     | Truncate text with ellipsis |
| breakWords | boolean                                                                  | false     | Break long words            |

### i18n API

#### useTranslation Hook

Returns a translation function that accepts a key and optional parameters.

```tsx
const t = useTranslation();
t('key', { param: 'value' });
```

#### i18n Instance Methods

-   `setLocale(locale: string)` - Set current locale
-   `getLocale()` - Get current locale
-   `addTranslations(locale: string, translations: Record<string, string>)` - Add translations
-   `getTranslations(locale?: string)` - Get translations for locale
-   `getAvailableLocales()` - Get list of available locales

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run type checking
npm run type-check

# Lint code
npm run lint
```

## License

MIT
