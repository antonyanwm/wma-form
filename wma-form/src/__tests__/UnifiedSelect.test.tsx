import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider } from '../../components/FormProvider';
import UnifiedSelect from '../../components/SelectSearch/UnifiedSelect';
import { Option } from '../../components/SelectSearch/types';

// Mock компонент для тестирования
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<FormProvider formId='test-form'>
		<form>{children}</form>
	</FormProvider>
);

// Тестовые данные
const mockOptions: Option[] = [
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'TypeScript', value: 'typescript' },
	{ label: 'React', value: 'react' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Node.js', value: 'nodejs' },
	{ label: 'Python', value: 'python' },
	{ label: 'Java', value: 'java' },
	{ label: 'C#', value: 'csharp' },
	{ label: 'Go', value: 'go' },
];

describe('UnifiedSelect', () => {
	beforeEach(() => {
		// Сброс моков перед каждым тестом
		jest.clearAllMocks();
	});

	describe('Single Select', () => {
		it('should render single select with placeholder', () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='language'
						options={mockOptions}
						placeholder='Select a language'
					/>
				</TestWrapper>
			);

			expect(screen.getByPlaceholderText('Select a language')).toBeInTheDocument();
		});

		it('should open dropdown on click', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='language'
						options={mockOptions}
						placeholder='Select a language'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select a language');
			fireEvent.click(input);

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});
		});

		it('should select option and close dropdown', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='language'
						options={mockOptions}
						placeholder='Select a language'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select a language');
			fireEvent.click(input);

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText('JavaScript'));

			await waitFor(() => {
				expect(input).toHaveValue('JavaScript');
			});
		});
	});

	describe('Multiple Select', () => {
		it('should render multiple select with placeholder', () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='languages'
						options={mockOptions}
						multiple={true}
						placeholder='Select languages'
					/>
				</TestWrapper>
			);

			expect(screen.getByPlaceholderText('Select languages')).toBeInTheDocument();
		});

		it('should select multiple options', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='languages'
						options={mockOptions}
						multiple={true}
						placeholder='Select languages'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select languages');
			fireEvent.click(input);

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			// Выбираем первый элемент
			fireEvent.click(screen.getByText('JavaScript'));

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			// Выбираем второй элемент
			fireEvent.click(screen.getByText('TypeScript'));

			await waitFor(() => {
				expect(screen.getByText('TypeScript')).toBeInTheDocument();
			});
		});

		it('should remove selected tag on click', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='languages'
						options={mockOptions}
						multiple={true}
						placeholder='Select languages'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select languages');
			fireEvent.click(input);

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			// Выбираем элемент
			fireEvent.click(screen.getByText('JavaScript'));

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			// Удаляем элемент
			const removeButton = screen.getByText('×');
			fireEvent.click(removeButton);

			await waitFor(() => {
				expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
			});
		});

		it('should show placeholder tag when maxVisibleItems exceeded', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='languages'
						options={mockOptions}
						multiple={true}
						maxVisibleItems={2}
						placeholder='Select languages'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select languages');
			fireEvent.click(input);

			// Выбираем 3 элемента
			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText('JavaScript'));
			fireEvent.click(screen.getByText('TypeScript'));
			fireEvent.click(screen.getByText('React'));

			await waitFor(() => {
				// Должны быть видны только 2 тега + placeholder
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
				expect(screen.getByText('TypeScript')).toBeInTheDocument();
				expect(screen.getByText('+1 more')).toBeInTheDocument();
			});
		});

		it('should clear all selected items', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='languages'
						options={mockOptions}
						multiple={true}
						placeholder='Select languages'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select languages');
			fireEvent.click(input);

			// Выбираем несколько элементов
			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText('JavaScript'));
			fireEvent.click(screen.getByText('TypeScript'));

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
				expect(screen.getByText('TypeScript')).toBeInTheDocument();
			});

			// Очищаем все
			const clearButton = screen.getByTitle('Clear all');
			fireEvent.click(clearButton);

			await waitFor(() => {
				expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
				expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
			});
		});
	});

	describe('Tags Overflow Logic', () => {
		it('should not show placeholder for 1-2 tags', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='languages'
						options={mockOptions}
						multiple={true}
						placeholder='Select languages'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select languages');
			fireEvent.click(input);

			// Выбираем 1 элемент
			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText('JavaScript'));

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
				expect(screen.queryByText(/\+.*more/)).not.toBeInTheDocument();
			});

			// Выбираем 2 элемент
			fireEvent.click(screen.getByText('TypeScript'));

			await waitFor(() => {
				expect(screen.getByText('TypeScript')).toBeInTheDocument();
				expect(screen.queryByText(/\+.*more/)).not.toBeInTheDocument();
			});
		});

		it('should handle duplicate values correctly', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='languages'
						options={mockOptions}
						multiple={true}
						placeholder='Select languages'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select languages');
			fireEvent.click(input);

			// Выбираем один элемент дважды
			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText('JavaScript'));
			fireEvent.click(screen.getByText('JavaScript')); // Должен удалиться

			await waitFor(() => {
				expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
			});
		});
	});

	describe('Keyboard Navigation', () => {
		it('should open dropdown with arrow keys', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='language'
						options={mockOptions}
						placeholder='Select a language'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select a language');
			fireEvent.keyDown(input, { key: 'ArrowDown' });

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});
		});

		it('should select option with Enter key', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='language'
						options={mockOptions}
						placeholder='Select a language'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select a language');
			fireEvent.keyDown(input, { key: 'ArrowDown' });

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			fireEvent.keyDown(input, { key: 'Enter' });

			await waitFor(() => {
				expect(input).toHaveValue('JavaScript');
			});
		});

		it('should close dropdown with Escape key', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='language'
						options={mockOptions}
						placeholder='Select a language'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select a language');
			fireEvent.click(input);

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
			});

			fireEvent.keyDown(input, { key: 'Escape' });

			await waitFor(() => {
				expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
			});
		});
	});

	describe('Search Functionality', () => {
		it('should filter options based on search input', async () => {
			render(
				<TestWrapper>
					<UnifiedSelect
						name='language'
						options={mockOptions}
						placeholder='Select a language'
					/>
				</TestWrapper>
			);

			const input = screen.getByPlaceholderText('Select a language');
			fireEvent.click(input);

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
				expect(screen.getByText('TypeScript')).toBeInTheDocument();
			});

			// Ищем "java"
			fireEvent.change(input, { target: { value: 'java' } });

			await waitFor(() => {
				expect(screen.getByText('JavaScript')).toBeInTheDocument();
				expect(screen.getByText('Java')).toBeInTheDocument();
				expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
			});
		});
	});
});
