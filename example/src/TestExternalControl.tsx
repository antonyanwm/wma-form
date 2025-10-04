import React from 'react';
import { SelectSearch, useSelectExternalControl } from 'wma-form';
import { Option } from 'wma-form';

// Простой тестовый компонент для проверки всех функций
export function TestExternalControl() {
	const options: Option[] = [
		{ label: 'Test 1', value: '1' },
		{ label: 'Test 2', value: '2' },
		{ label: 'Test 3', value: '3' },
	];

	const formId = 'test-form';
	const fieldName = 'test-select';

	const { selectByValue, clearAll, openDropdown, closeDropdown, getSelectedValues, getSelectedCount, hasSelectedValues, getFieldState } = useSelectExternalControl({
		formId,
		name: fieldName,
		multiple: true,
		options,
	});

	const fieldState = getFieldState();

	return (
		<div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '20px' }}>
			<h3 style={{ color: '#28a745', marginTop: 0 }}>🧪 Тест внешнего управления</h3>

			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
				<div style={{ flex: 1 }}>
					<SelectSearch
						formId={formId}
						name={fieldName}
						label='Тестовый селект'
						options={options}
						multiple={true}
						hideClearButton={true}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<button
						onClick={() => selectByValue('1')}
						style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Выбрать Test 1
					</button>
					<button
						onClick={() => selectByValue('2')}
						style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Выбрать Test 2
					</button>
					<button
						onClick={clearAll}
						style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
						Очистить все
					</button>
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
				</div>
			</div>

			<div style={{ marginTop: '12px', padding: '12px', background: '#d4edda', borderRadius: '6px' }}>
				<strong>📊 Состояние:</strong>
				<div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
					Выбрано: {getSelectedCount()} элементов
					<br />
					Значения: {JSON.stringify(getSelectedValues())}
					<br />
					Есть значения: {hasSelectedValues() ? 'Да' : 'Нет'}
					<br />
					Ошибка: {fieldState.error || 'Нет'}
					<br />
					Фокус: {fieldState.focused ? 'Да' : 'Нет'}
				</div>
			</div>
		</div>
	);
}






