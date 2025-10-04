import React from 'react';
import { SelectSearch, useSelectExternalControl } from 'wma-form';
import { Option } from 'wma-form';

// Пример 1: Программное управление выбором
export function ProgrammaticSelectionExample() {
	const options: Option[] = [
		{ label: 'Option 1', value: '1' },
		{ label: 'Option 2', value: '2' },
		{ label: 'Option 3', value: '3' },
		{ label: 'Option 4', value: '4' },
		{ label: 'Option 5', value: '5' },
	];

	const formId = 'programmatic-form';
	const fieldName = 'programmatic-select';

	const { selectByValue, selectMultiple, clearAll, getSelectedValues, getSelectedCount, hasSelectedValues, getFieldState } = useSelectExternalControl({
		formId,
		name: fieldName,
		multiple: true,
		options,
	});

	const handleSelectFirst = () => selectByValue('1');
	const handleSelectLast = () => selectByValue('5');
	const handleSelectMultiple = () => selectMultiple(['2', '3', '4']);
	const handleClear = () => clearAll();

	const fieldState = getFieldState();

	return (
		<div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '20px' }}>
			<h3 style={{ color: '#28a745', marginTop: 0 }}>🎯 Программное управление выбором</h3>

			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
				<div style={{ flex: 1 }}>
					<SelectSearch
						formId={formId}
						name={fieldName}
						label='Выберите опции'
						options={options}
						multiple={true}
						hideClearButton={true}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<button
						onClick={handleSelectFirst}
						style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Выбрать первый
					</button>
					<button
						onClick={handleSelectLast}
						style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Выбрать последний
					</button>
					<button
						onClick={handleSelectMultiple}
						style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Выбрать 2,3,4
					</button>
					<button
						onClick={handleClear}
						style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Очистить все
					</button>
				</div>
			</div>

			{hasSelectedValues() && (
				<div style={{ marginTop: '12px', padding: '12px', background: '#d4edda', borderRadius: '6px' }}>
					<strong>✅ Выбрано: {getSelectedCount()} элементов</strong>
					<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Значения: {JSON.stringify(getSelectedValues())}</div>
				</div>
			)}
		</div>
	);
}

// Пример 2: Управление дропдауном
export function DropdownControlExample() {
	const options: Option[] = [
		{ label: 'Apple', value: 'apple' },
		{ label: 'Banana', value: 'banana' },
		{ label: 'Cherry', value: 'cherry' },
		{ label: 'Date', value: 'date' },
		{ label: 'Elderberry', value: 'elderberry' },
	];

	const formId = 'dropdown-form';
	const fieldName = 'dropdown-select';

	const { openDropdown, closeDropdown, isDropdownOpen, focusInput, blurInput, getFieldState } = useSelectExternalControl({
		formId,
		name: fieldName,
		options,
	});

	const fieldState = getFieldState();

	return (
		<div style={{ padding: '20px', border: '2px solid #ffc107', borderRadius: '8px', marginBottom: '20px' }}>
			<h3 style={{ color: '#856404', marginTop: 0 }}>📋 Управление дропдауном</h3>

			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
				<div style={{ flex: 1 }}>
					<SelectSearch
						formId={formId}
						name={fieldName}
						label='Фрукты'
						options={options}
						hideClearButton={true}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<button
						onClick={openDropdown}
						style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Открыть дропдаун
					</button>
					<button
						onClick={closeDropdown}
						style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Закрыть дропдаун
					</button>
					<button
						onClick={focusInput}
						style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Фокус на инпут
					</button>
					<button
						onClick={blurInput}
						style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Убрать фокус
					</button>
				</div>
			</div>

			<div style={{ marginTop: '12px', padding: '12px', background: '#fff3cd', borderRadius: '6px' }}>
				<strong>📊 Состояние дропдауна: {isDropdownOpen() ? 'Открыт' : 'Закрыт'}</strong>
				<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
					Фокус: {fieldState.focused ? 'Да' : 'Нет'} | Touched: {fieldState.touched ? 'Да' : 'Нет'}
				</div>
			</div>
		</div>
	);
}

// Пример 3: Управление поиском
export function SearchControlExample() {
	const options: Option[] = [
		{ label: 'JavaScript', value: 'js' },
		{ label: 'TypeScript', value: 'ts' },
		{ label: 'Python', value: 'py' },
		{ label: 'Java', value: 'java' },
		{ label: 'C#', value: 'csharp' },
		{ label: 'Go', value: 'go' },
		{ label: 'Rust', value: 'rust' },
		{ label: 'Swift', value: 'swift' },
	];

	const formId = 'search-form';
	const fieldName = 'search-select';

	const { setSearchQuery, getCurrentQuery, getFilteredOptions, getAllOptions, getFieldState } = useSelectExternalControl({
		formId,
		name: fieldName,
		options,
	});

	const fieldState = getFieldState();
	const currentQuery = getCurrentQuery();
	const filteredOptions = getFilteredOptions();
	const allOptions = getAllOptions();

	return (
		<div style={{ padding: '20px', border: '2px solid #6f42c1', borderRadius: '8px', marginBottom: '20px' }}>
			<h3 style={{ color: '#6f42c1', marginTop: 0 }}>🔍 Управление поиском</h3>

			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
				<div style={{ flex: 1 }}>
					<SelectSearch
						formId={formId}
						name={fieldName}
						label='Языки программирования'
						options={options}
						hideClearButton={true}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<button
						onClick={() => setSearchQuery('java')}
						style={{ background: '#6f42c1', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Поиск "java"
					</button>
					<button
						onClick={() => setSearchQuery('script')}
						style={{ background: '#6f42c1', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Поиск "script"
					</button>
					<button
						onClick={() => setSearchQuery('')}
						style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Очистить поиск
					</button>
				</div>
			</div>

			<div style={{ marginTop: '12px', padding: '12px', background: '#e2e3f1', borderRadius: '6px' }}>
				<strong>🔍 Текущий поиск: "{currentQuery}"</strong>
				<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
					Всего опций: {allOptions.length} | Отфильтровано: {filteredOptions.length}
				</div>
				{filteredOptions.length > 0 && <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Найдено: {filteredOptions.map((opt) => opt.label).join(', ')}</div>}
			</div>
		</div>
	);
}

// Пример 4: Управление состоянием поля
export function FieldStateControlExample() {
	const options: Option[] = [
		{ label: 'Option 1', value: '1' },
		{ label: 'Option 2', value: '2' },
		{ label: 'Option 3', value: '3' },
	];

	const formId = 'state-form';
	const fieldName = 'state-select';

	const { markAsTouched, markAsFocused, validateField, getFieldState, selectByValue, clearAll } = useSelectExternalControl({
		formId,
		name: fieldName,
		options,
	});

	const fieldState = getFieldState();

	const handleValidate = () => {
		const result = validateField();
		alert(`Валидация: ${result ? 'Ошибка: ' + result : 'Успешно'}`);
	};

	return (
		<div style={{ padding: '20px', border: '2px solid #fd7e14', borderRadius: '8px', marginBottom: '20px' }}>
			<h3 style={{ color: '#fd7e14', marginTop: 0 }}>⚙️ Управление состоянием поля</h3>

			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
				<div style={{ flex: 1 }}>
					<SelectSearch
						formId={formId}
						name={fieldName}
						label='Состояние поля'
						options={options}
						required={true}
						hideClearButton={true}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<button
						onClick={() => markAsTouched()}
						style={{ background: '#fd7e14', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Mark as Touched
					</button>
					<button
						onClick={() => markAsFocused(true)}
						style={{ background: '#fd7e14', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Mark as Focused
					</button>
					<button
						onClick={handleValidate}
						style={{ background: '#20c997', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Валидировать
					</button>
					<button
						onClick={() => selectByValue('1')}
						style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Выбрать Option 1
					</button>
					<button
						onClick={clearAll}
						style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Очистить
					</button>
				</div>
			</div>

			<div style={{ marginTop: '12px', padding: '12px', background: '#ffeaa7', borderRadius: '6px' }}>
				<strong>📊 Состояние поля:</strong>
				<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
					Значение: {JSON.stringify(fieldState.value)}
					<br />
					Ошибка: {fieldState.error || 'Нет'}
					<br />
					Фокус: {fieldState.focused ? 'Да' : 'Нет'}
					<br />
					Touched: {fieldState.touched ? 'Да' : 'Нет'}
					<br />
					Выбрано: {fieldState.selectedCount} элементов
				</div>
			</div>
		</div>
	);
}

// Пример 5: Комплексное управление
export function ComprehensiveControlExample() {
	const options: Option[] = [
		{ label: 'Red', value: 'red' },
		{ label: 'Green', value: 'green' },
		{ label: 'Blue', value: 'blue' },
		{ label: 'Yellow', value: 'yellow' },
		{ label: 'Purple', value: 'purple' },
		{ label: 'Orange', value: 'orange' },
	];

	const formId = 'comprehensive-form';
	const fieldName = 'comprehensive-select';

	const {
		selectByValue,
		selectMultiple,
		removeOption,
		clearAll,
		openDropdown,
		closeDropdown,
		setSearchQuery,
		getSelectedValues,
		getSelectedOptions,
		getSelectedCount,
		hasSelectedValues,
		isOptionSelected,
		getFieldState,
	} = useSelectExternalControl({
		formId,
		name: fieldName,
		multiple: true,
		options,
	});

	const fieldState = getFieldState();

	return (
		<div style={{ padding: '20px', border: '2px solid #e83e8c', borderRadius: '8px', marginBottom: '20px' }}>
			<h3 style={{ color: '#e83e8c', marginTop: 0 }}>🎛️ Комплексное управление</h3>

			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
				<div style={{ flex: 1 }}>
					<SelectSearch
						formId={formId}
						name={fieldName}
						label='Цвета'
						options={options}
						multiple={true}
						hideClearButton={true}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<button
						onClick={() => selectByValue('red')}
						style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
						+ Red
					</button>
					<button
						onClick={() => selectByValue('green')}
						style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
						+ Green
					</button>
					<button
						onClick={() => selectByValue('blue')}
						style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
						+ Blue
					</button>
					<button
						onClick={() => selectMultiple(['yellow', 'purple'])}
						style={{ background: '#ffc107', color: 'black', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
						+ Yellow & Purple
					</button>
					<button
						onClick={() => removeOption('red')}
						style={{ background: '#6c757d', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
						- Red
					</button>
					<button
						onClick={clearAll}
						style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
						Очистить все
					</button>
				</div>
			</div>

			{hasSelectedValues() && (
				<div style={{ marginTop: '12px', padding: '12px', background: '#f8d7da', borderRadius: '6px' }}>
					<strong>🎨 Выбранные цвета: {getSelectedCount()}</strong>
					<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
						Значения: {JSON.stringify(getSelectedValues())}
						<br />
						Опции:{' '}
						{getSelectedOptions()
							.map((opt) => opt.label)
							.join(', ')}
						<br />
						Red выбран: {isOptionSelected('red') ? 'Да' : 'Нет'}
					</div>
				</div>
			)}
		</div>
	);
}






