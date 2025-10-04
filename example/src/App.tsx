import React from 'react';
import { Form, FormProvider, BaseInput, FormCheckbox, SelectSearch, Radio, RadioGroup } from 'wma-form';
import { useSelectStoreField } from 'wma-form';
import 'wma-form/dist/index.css';
import { UniversalSelectTest } from './UniversalSelectTest';
import { SingleSelectTest } from './SingleSelectTest';
import { AdvancedSelectTest } from './AdvancedSelectTest';

// Демо функции для loadOptions
const loadUsers = async (input: string): Promise<{ label: string; value: string }[]> => {
	// Имитация API запроса с задержкой
	await new Promise((resolve) => setTimeout(resolve, 500));

	const users = [
		{ id: '1', name: 'John Doe', email: 'john@example.com' },
		{ id: '2', name: 'Jane Smith', email: 'jane@example.com' },
		{ id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
		{ id: '4', name: 'Alice Brown', email: 'alice@example.com' },
		{ id: '5', name: 'Charlie Wilson', email: 'charlie@example.com' },
		{ id: '6', name: 'Diana Davis', email: 'diana@example.com' },
		{ id: '7', name: 'Eve Miller', email: 'eve@example.com' },
		{ id: '8', name: 'Frank Garcia', email: 'frank@example.com' },
		{ id: '9', name: 'Grace Lee', email: 'grace@example.com' },
		{ id: '10', name: 'Henry Taylor', email: 'henry@example.com' },
	];

	// Фильтрация по введенному тексту
	const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(input.toLowerCase()) || user.email.toLowerCase().includes(input.toLowerCase()));

	return filteredUsers.map((user) => ({
		label: `${user.name} `,
		value: user.id,
		...user,
	}));
};

const loadCities = async (input: string): Promise<{ label: string; value: string }[]> => {
	// Имитация API запроса с задержкой
	await new Promise((resolve) => setTimeout(resolve, 3000));

	const cities = [
		{ id: '1', name: 'New York', country: 'USA' },
		{ id: '2', name: 'London', country: 'UK' },
		{ id: '3', name: 'Paris', country: 'France' },
		{ id: '4', name: 'Tokyo', country: 'Japan' },
		{ id: '5', name: 'Sydney', country: 'Australia' },
		{ id: '6', name: 'Berlin', country: 'Germany' },
		{ id: '7', name: 'Rome', country: 'Italy' },
		{ id: '8', name: 'Madrid', country: 'Spain' },
		{ id: '9', name: 'Moscow', country: 'Russia' },
		{ id: '10', name: 'Beijing', country: 'China' },
		{ id: '11', name: 'Mumbai', country: 'India' },
		{ id: '12', name: 'São Paulo', country: 'Brazil' },
		{ id: '13', name: 'Mexico City', country: 'Mexico' },
		{ id: '14', name: 'Cairo', country: 'Egypt' },
		{ id: '15', name: 'Lagos', country: 'Nigeria' },
	];

	// Фильтрация по введенному тексту
	const filteredCities = cities.filter((city) => city.name.toLowerCase().includes(input.toLowerCase()) || city.country.toLowerCase().includes(input.toLowerCase()));

	return filteredCities.map((city) => ({
		label: `${city.name}`,
		value: city.id,
		...city,
	}));
};

const loadProducts = async (input: string): Promise<{ label: string; value: string }[]> => {
	// Имитация API запроса с задержкой
	await new Promise((resolve) => setTimeout(resolve, 400));

	const products = [
		{ id: '1', name: 'iPhone 15 Pro', category: 'Electronics', price: '$999' },
		{ id: '2', name: 'Samsung Galaxy S24', category: 'Electronics', price: '$899' },
		{ id: '3', name: 'MacBook Pro M3', category: 'Computers', price: '$1999' },
		{ id: '4', name: 'Dell XPS 13', category: 'Computers', price: '$1299' },
		{ id: '5', name: 'Nike Air Max', category: 'Shoes', price: '$120' },
		{ id: '6', name: 'Adidas Ultraboost', category: 'Shoes', price: '$180' },
		{ id: '7', name: 'Sony WH-1000XM5', category: 'Audio', price: '$399' },
		{ id: '8', name: 'Bose QuietComfort', category: 'Audio', price: '$329' },
		{ id: '9', name: 'Canon EOS R5', category: 'Cameras', price: '$3899' },
		{ id: '10', name: 'Nikon Z9', category: 'Cameras', price: '$5499' },
	];

	// Фильтрация по введенному тексту
	const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(input.toLowerCase()) || product.category.toLowerCase().includes(input.toLowerCase()));

	return filteredProducts.map((product) => ({
		label: `${product.name}`,
		value: product.id,
		...product,
	}));
};

function App() {
	const handleSubmit = (data: any) => {
		console.log('Form submitted:', data);
	};

	const handleInvalidSubmit = (errors: any) => {
		console.log('Form has errors:', errors);
	};

	// Кастомные валидаторы для тестирования
	const customSelectValidator = ({ value, name, label, opts }: { value: any; name?: string; label?: string; opts?: Record<string, any> }) => {
		console.log(value);
		if (opts?.required && (!value || value === '')) {
			return `${label}Required`;
		}
		// Проверяем invalid: если есть значение, но нет selected опции (значение не найдено в списке)
		if (value && value !== '' && !opts?.selected) {
			// Дополнительная проверка: есть ли значение в доступных опциях
			const availableOptions = opts?.availableOptions || [];
			const foundOption = availableOptions.find((option: any) => String(option.value) === String(value));
			if (!foundOption) {
				return `${label}InvalidError`;
			}
		}
		return '';
	};

	const customMultiselectValidator = ({ value, name, label, opts }: { value: any; name?: string; label?: string; opts?: Record<string, any> }) => {
		if (opts?.required && (!Array.isArray(value) || value.length === 0)) {
			return `${label}Required`;
		}
		// Проверяем invalid: если есть значения, но нет selected опций (значения не найдены в списке)
		if (Array.isArray(value) && value.length > 0 && (!opts?.selected || !Array.isArray(opts.selected) || opts.selected.length === 0)) {
			// Дополнительная проверка: есть ли все значения в доступных опциях
			const availableOptions = opts?.availableOptions || [];
			const invalidValues = value.filter((val: any) => {
				const foundOption = availableOptions.find((option: any) => String(option.value) === String(val));
				return !foundOption;
			});
			if (invalidValues.length > 0) {
				return `${label}InvalidError`;
			}
		}
		return '';
	};

	return (
		<div className='container'>
			<h1>WMA Form Library - Complete Example</h1>
			<p>This example demonstrates all available form components with validation.</p>

			{/* Универсальный тест внешнего управления */}
			<UniversalSelectTest />

			{/* Тест одиночного выбора */}
			<SingleSelectTest />

			{/* Продвинутый тест с дополнительными функциями */}
			<AdvancedSelectTest />

			<Form
				formId='complete-form'
				onValidSubmit={handleSubmit}
				onInvalidSubmit={handleInvalidSubmit}>
				{/* Basic Text Input */}
				<div style={{ marginBottom: '20px' }}>
					<BaseInput
						name='fullName'
						label='Full Name'
						type='text'
						placeholder='Enter your full name'
						required
					/>
				</div>

				{/* Email Input with validation */}
				<div style={{ marginBottom: '20px' }}>
					<BaseInput
						name='email'
						label='Email Address'
						type='email'
						placeholder='Enter your email'
						required
					/>
				</div>

				{/* Phone Input with validation */}
				<div style={{ marginBottom: '20px' }}>
					<BaseInput
						name='phone'
						label='Phone Number'
						type='tel'
						placeholder='Enter your phone number'
						required
					/>
				</div>

				{/* Password Input */}
				<div style={{ marginBottom: '20px' }}>
					<BaseInput
						name='password'
						label='Password'
						type='password'
						placeholder='Enter your password'
						required
					/>
				</div>

				{/* Age Input with min/max validation */}
				<div style={{ marginBottom: '20px' }}>
					<BaseInput
						name='age'
						label='Age'
						type='text'
						placeholder='Enter your age'
						required
					/>
				</div>

				{/* Textarea */}
				<div style={{ marginBottom: '20px' }}>
					<BaseInput
						name='bio'
						label='Biography'
						type='textarea'
						placeholder='Tell us about yourself'
					/>
				</div>

				{/* Checkbox */}
				<div style={{ marginBottom: '20px' }}>
					<FormCheckbox
						required
						name='newsletter'
						label='Subscribe to newsletter'
					/>
				</div>

				{/* Radio Group */}
				<div style={{ marginBottom: '20px' }}>
					<Radio
						formId='complete-form'
						name='gender'
						label='Gender'
						required
						options={[
							{ value: 'male', label: 'Male' },
							{ value: 'female', label: 'Female' },
							{ value: 'other', label: 'Other' },
							{ value: 'prefer-not-to-say', label: 'Prefer not to say' },
						]}
					/>
				</div>

				{/* Single Select Search */}
				<div style={{ marginBottom: '20px' }}>
					<SelectSearch
						formId='complete-form'
						name='country'
						label='Country'
						required
						options={[
							{ value: 'us', label: 'United States' },
							{ value: 'uk', label: 'United Kingdom' },
							{ value: 'ca', label: 'Canada' },
							{ value: 'de', label: 'Germany' },
							{ value: 'fr', label: 'France' },
							{ value: 'it', label: 'Italy' },
							{ value: 'es', label: 'Spain' },
							{ value: 'jp', label: 'Japan' },
							{ value: 'au', label: 'Australia' },
							{ value: 'br', label: 'Brazil' },
						]}
					/>
				</div>

				{/* Multi Select */}
				<div style={{ marginBottom: '20px' }}>
					<SelectSearch
						formId='complete-form'
						name='interests'
						label='Interests (select multiple)'
						multiple
						hideInput
						options={[
							{ value: 'technology', label: 'Technology' },
							{ value: 'sports', label: 'Sports' },
							{ value: 'music', label: 'Music' },
							{ value: 'travel', label: 'Travel' },
							{ value: 'cooking', label: 'Cooking' },
							{ value: 'reading', label: 'Reading' },
							{ value: 'gaming', label: 'Gaming' },
							{ value: 'art', label: 'Art' },
						]}
					/>
				</div>

				{/* Multi Select with hideInput and maxVisibleItems */}
				<div style={{ marginBottom: '20px' }}>
					<SelectSearch
						formId='complete-form'
						name='skills'
						label='Skills (compact view)'
						multiple
						maxVisibleItems={10}
						initialValue={[
							'javascript',
							'react',
							'typescript',
							'nodejs',
							'python',
							'java',
							'csharp',
							'php',
							'ruby',
							'go',
							'rust',
							'swift',
							'kotlin',
							'scala',
							'elixir',
							'ocaml',
							'prolog',
							'lisp',
							'scheme',
							'erlang',
							'haskell',
						]}
						options={[
							{ value: 'javascript', label: 'JavaScript' },
							{ value: 'react', label: 'React' },
							{ value: 'typescript', label: 'TypeScript' },
							{ value: 'nodejs', label: 'Node.js' },
							{ value: 'python', label: 'Python' },
							{ value: 'java', label: 'Java' },
							{ value: 'csharp', label: 'C#' },
							{ value: 'php', label: 'PHP' },
							{ value: 'ruby', label: 'Ruby' },
							{ value: 'go', label: 'Go' },
							{ value: 'rust', label: 'Rust' },
							{ value: 'swift', label: 'Swift' },
							{ value: 'kotlin', label: 'Kotlin' },
							{ value: 'scala', label: 'Scala' },
							{ value: 'elixir', label: 'Elixir' },
							{ value: 'erlang', label: 'Erlang' },
							{ value: 'haskell', label: 'Haskell' },
							{ value: 'ocaml', label: 'OCaml' },
							{ value: 'prolog', label: 'Prolog' },
							{ value: 'lisp', label: 'Lisp' },
							{ value: 'scheme', label: 'Scheme' },
						]}
					/>
				</div>

				{/* Async Load Options - Users */}
				<div style={{ marginBottom: '20px' }}>
					<SelectSearch
						formId='complete-form'
						name='assignedUser'
						label='Assign to User (Async Load)'
						placeholder={true}
						loadOptions={loadUsers}
						debounceMs={300}
						required
						validator={customSelectValidator}
					/>
				</div>

				{/* Async Load Options - Cities */}
				<div style={{ marginBottom: '20px' }}>
					<SelectSearch
						formId='complete-form'
						name='city'
						label='City (Async Load)'
						placeholder={true}
						loadOptions={loadCities}
						debounceMs={200}
						hideInput
						required={false}
						multiple
					/>
				</div>

				{/* Async Load Options - Products (Multiple Selection) */}
				<div style={{ marginBottom: '20px' }}>
					<SelectSearch
						formId='complete-form'
						name='selectedProducts'
						label='Products (Async Load - Multiple)'
						placeholder={true}
						loadOptions={loadProducts}
						multiple
						maxVisibleItems={3}
						debounceMs={250}
						required
						validator={customMultiselectValidator}
						initialValue={['1', '2', '3']}
					/>
				</div>

				{/* Multi Select with hideSelectedFromDropdown */}
				<div style={{ marginBottom: '20px' }}>
					<SelectSearch
						formId='complete-form'
						name='selectedUsers'
						label='Users (Hide Selected from Dropdown)'
						placeholder={true}
						loadOptions={loadUsers}
						multiple
						hideSelectedFromDropdown
						maxVisibleItems={2}
						debounceMs={300}
						required={false}
					/>
				</div>

				{/* Terms and Conditions Checkbox */}
				<div style={{ marginBottom: '20px' }}>
					<FormCheckbox
						required
						name='terms'
						label='I agree to the terms and conditions'
					/>
				</div>

				{/* Submit Button */}
				<button
					type='submit'
					style={{
						padding: '12px 24px',
						backgroundColor: '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '6px',
						cursor: 'pointer',
						fontSize: '16px',
						fontWeight: 'bold',
						width: '100%',
						marginTop: '10px',
					}}>
					Submit Complete Form
				</button>
			</Form>

			{/* Form Status Display */}
			<div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
				<h3>Form Features Demonstrated:</h3>
				<ul>
					<li>
						<strong>🚀 External Clear Button:</strong> Clear All button outside the select component
					</li>
					<li>
						<strong>🎯 Programmatic Selection:</strong> Select options programmatically from outside
					</li>
					<li>
						<strong>📋 Dropdown Control:</strong> Open/close dropdown and manage focus externally
					</li>
					<li>
						<strong>🔍 Search Control:</strong> Set search queries and get filtered results
					</li>
					<li>
						<strong>⚙️ Field State Control:</strong> Manage field state (touched, focused, validation)
					</li>
					<li>
						<strong>🎛️ Comprehensive Control:</strong> Full external control over select behavior
					</li>
					<li>
						<strong>Text Input:</strong> Basic text field with required validation
					</li>
					<li>
						<strong>Email Input:</strong> Email format validation
					</li>
					<li>
						<strong>Phone Input:</strong> Phone number format validation
					</li>
					<li>
						<strong>Password Input:</strong> Secure password field
					</li>
					<li>
						<strong>Age Input:</strong> Numeric validation with min/max
					</li>
					<li>
						<strong>Textarea:</strong> Multi-line text input
					</li>
					<li>
						<strong>Checkbox:</strong> Boolean input with custom styling
					</li>
					<li>
						<strong>Radio Group:</strong> Single selection from multiple options
					</li>
					<li>
						<strong>Select Search:</strong> Searchable dropdown with single selection
					</li>
					<li>
						<strong>Multi Select:</strong> Multiple selection from options
					</li>
					<li>
						<strong>Async Load Options:</strong> Dynamic loading of options with search
					</li>
					<li>
						<strong>User Search:</strong> Async user search with name and email filtering
					</li>
					<li>
						<strong>City Search:</strong> Async city search with country filtering
					</li>
					<li>
						<strong>Product Search:</strong> Async product search with multiple selection
					</li>
					<li>
						<strong>Debounced Search:</strong> Configurable debounce for API calls
					</li>
					<li>
						<strong>Form Validation:</strong> Real-time validation with error messages
					</li>
					<li>
						<strong>Form Submission:</strong> Valid/invalid submit handling
					</li>
				</ul>
			</div>
		</div>
	);
}

export default App;
