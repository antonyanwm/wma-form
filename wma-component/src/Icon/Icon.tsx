import React from 'react';
import '../styles/index.css';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
	name: string;
	className?: string;
	size?: number | string;
	color?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = '', size = 16, color, style, ...props }) => {
	return (
		<span
			className={`icon icon-${name} ${className}`}
			style={{
				fontSize: size,
				display: 'inline-block',
				width: size,
				height: size,
				color,
				...style,
			}}
			{...props}>
			{/* Simple fallback for icons - you can replace with your icon library */}
			{name}
		</span>
	);
};

export default Icon;
