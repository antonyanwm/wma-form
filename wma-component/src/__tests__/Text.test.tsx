import React from 'react';
import { render, screen } from '@testing-library/react';
import Text from '../Text/Text';

describe('Text Component', () => {
	it('renders with children', () => {
		render(<Text>Hello World</Text>);
		expect(screen.getByText('Hello World')).toBeInTheDocument();
	});

	it('renders with text prop', () => {
		render(<Text text='Hello World' />);
		expect(screen.getByText('Hello World')).toBeInTheDocument();
	});

	it('renders as different element', () => {
		render(<Text as='h1'>Hello World</Text>);
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});

	it('applies variant classes', () => {
		render(<Text variant='error'>Error text</Text>);
		const text = screen.getByText('Error text');
		expect(text).toHaveClass('wma-text--error');
	});

	it('applies size classes', () => {
		render(<Text size='lg'>Large text</Text>);
		const text = screen.getByText('Large text');
		expect(text).toHaveClass('wma-text--lg');
	});

	it('applies weight classes', () => {
		render(<Text weight='bold'>Bold text</Text>);
		const text = screen.getByText('Bold text');
		expect(text).toHaveClass('wma-text--bold');
	});

	it('applies truncate class', () => {
		render(<Text truncate>Truncated text</Text>);
		const text = screen.getByText('Truncated text');
		expect(text).toHaveClass('wma-text--truncate');
	});

	it('applies custom className', () => {
		render(<Text className='custom-class'>Custom text</Text>);
		const text = screen.getByText('Custom text');
		expect(text).toHaveClass('custom-class');
		expect(text).toHaveClass('wma-text');
	});
});
