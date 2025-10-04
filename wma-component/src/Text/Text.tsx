import React from 'react';
import '../styles/index.css';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
	children?: React.ReactNode;
	text?: string;
	as?: keyof JSX.IntrinsicElements;
	className?: string;
	variant?: 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'warning';
	size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
	weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
	truncate?: boolean;
	breakWords?: boolean;
}

const Text: React.FC<TextProps> = ({
	children,
	text,
	as: Component = 'span',
	className = '',
	variant = 'primary',
	size = 'base',
	weight = 'normal',
	truncate = false,
	breakWords = false,
	...props
}) => {
	// Build CSS classes
	const classes = ['wma-text', `wma-text--${variant}`, `wma-text--${size}`, `wma-text--${weight}`, truncate && 'wma-text--truncate', breakWords && 'wma-text--break-words', className]
		.filter(Boolean)
		.join(' ');

	// Filter out props that might not be compatible with all element types
	const { onCopy, onCut, onPaste, ...filteredProps } = props as any;

	return (
		<Component
			className={classes}
			{...filteredProps}>
			{text || children}
		</Component>
	);
};

export { Text };
export default Text;
