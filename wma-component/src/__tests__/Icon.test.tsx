import React from 'react';
import { render, screen } from '@testing-library/react';
import Icon from '../Icon/Icon';

describe('Icon Component', () => {
	it('renders with name prop', () => {
		render(<Icon name='test-icon' />);
		expect(screen.getByText('test-icon')).toBeInTheDocument();
	});

	it('applies custom className', () => {
		render(
			<Icon
				name='test-icon'
				className='custom-class'
			/>
		);
		const icon = screen.getByText('test-icon');
		expect(icon).toHaveClass('custom-class');
		expect(icon).toHaveClass('icon-test-icon');
	});

	it('applies custom size', () => {
		render(
			<Icon
				name='test-icon'
				size={24}
			/>
		);
		const icon = screen.getByText('test-icon');
		expect(icon).toHaveStyle('font-size: 24px');
		expect(icon).toHaveStyle('width: 24px');
		expect(icon).toHaveStyle('height: 24px');
	});

	it('applies custom color', () => {
		render(
			<Icon
				name='test-icon'
				color='red'
			/>
		);
		const icon = screen.getByText('test-icon');
		expect(icon).toHaveStyle('color: red');
	});

	it('forwards additional props', () => {
		render(
			<Icon
				name='test-icon'
				data-testid='icon-test'
			/>
		);
		expect(screen.getByTestId('icon-test')).toBeInTheDocument();
	});
});
