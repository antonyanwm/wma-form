import React from 'react';
import { useSelectExternalControl } from 'wma-form';
import { SelectSearch, useSelectStoreField } from 'wma-form';

// Универсальный тест со всем функционалом
export function UniversalSelectTest() {
	const formId = 'universal-test';
	const fieldName = 'universal-select';

	// Используем упрощенный хук для внешнего управления
	const { selectByValue, clearAll, openDropdown, closeDropdown, setSearchQuery, getSelectedValues, getSelectedCount, hasSelectedValues, getFieldState, inputRef } = useSelectExternalControl({
		formId,
		name: fieldName,
		multiple: true,
		options: [
			{ label: 'Универсальный 1', value: '1' },
			{ label: 'Универсальный 2', value: '2' },
			{ label: 'Универсальный 3', value: '3' },
			{ label: 'Универсальный 4', value: '4' },
			{ label: 'Универсальный 5', value: '5' },
		],
	});

	// Также используем базовый хук для сравнения
	const { handleClearAll: basicClearAll, field } = useSelectStoreField(formId, fieldName, {
		formId,
		name: fieldName,
		multiple: true,
	});

	const fieldState = getFieldState();
	const hasValue = field?.value && Array.isArray(field.value) && field.value.length > 0;

	return (
		<div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', marginBottom: '20px' }}>
			<h3 style={{ color: '#007bff', marginTop: 0 }}>🎯 Универсальный тест внешнего управления</h3>
			<p style={{ color: '#666', marginBottom: '20px' }}>Этот компонент демонстрирует все возможности внешнего управления селектом</p>

			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
				{/* Селект */}
				<div style={{ flex: 1 }}>
					<SelectSearch
						formId={formId}
						name={fieldName}
						label='Универсальный селект'
						options={[
							{ label: 'Универсальный 1', value: '1' },
							{ label: 'Универсальный 2', value: '2' },
							{ label: 'Универсальный 3', value: '3' },
							{ label: 'Универсальный 4', value: '4' },
							{ label: 'Универсальный 5', value: '5' },
						]}
						multiple={true}
						hideClearButton={true}
						ref={inputRef}
					/>
				</div>

				{/* Кнопки управления */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
					{/* Выбор опций */}
					<div style={{ borderBottom: '1px solid #dee2e6', paddingBottom: '8px', marginBottom: '8px' }}>
						<strong style={{ fontSize: '12px', color: '#666' }}>Выбор опций:</strong>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
							<button
								onClick={() => selectByValue('1')}
								style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Выбрать 1
							</button>
							<button
								onClick={() => selectByValue('2')}
								style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Выбрать 2
							</button>
							<button
								onClick={() => selectByValue('3')}
								style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Выбрать 3
							</button>
							<button
								onClick={() => selectByValue('4')}
								style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Выбрать 4
							</button>
							<button
								onClick={() => selectByValue('5')}
								style={{ background: '#007bff', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Выбрать 5
							</button>
						</div>
					</div>

					{/* Управление дропдауном */}
					<div style={{ borderBottom: '1px solid #dee2e6', paddingBottom: '8px', marginBottom: '8px' }}>
						<strong style={{ fontSize: '12px', color: '#666' }}>Дропдаун:</strong>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
							<button
								onClick={openDropdown}
								style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Открыть
							</button>
							<button
								onClick={closeDropdown}
								style={{ background: '#6c757d', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Закрыть
							</button>
						</div>
					</div>

					{/* Поиск */}
					<div style={{ borderBottom: '1px solid #dee2e6', paddingBottom: '8px', marginBottom: '8px' }}>
						<strong style={{ fontSize: '12px', color: '#666' }}>Поиск:</strong>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
							<button
								onClick={() => setSearchQuery('Универсальный')}
								style={{ background: '#ffc107', color: 'black', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Поиск "Универсальный"
							</button>
							<button
								onClick={() => setSearchQuery('1')}
								style={{ background: '#ffc107', color: 'black', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Поиск "1"
							</button>
							<button
								onClick={() => setSearchQuery('')}
								style={{ background: '#6c757d', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Очистить поиск
							</button>
						</div>
					</div>

					{/* Очистка */}
					<div>
						<strong style={{ fontSize: '12px', color: '#666' }}>Очистка:</strong>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
							<button
								onClick={clearAll}
								style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Очистить все (внешний)
							</button>
							{hasValue && (
								<button
									onClick={basicClearAll}
									style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
									Очистить все (базовый) ({field.value.length})
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Состояние */}
			<div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
				<strong>📊 Текущее состояние:</strong>
				<div style={{ fontSize: '12px', color: '#666', marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
					<div>
						<strong>Внешний хук:</strong>
						<br />
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
					<div>
						<strong>Базовый хук:</strong>
						<br />
						Значение: {JSON.stringify(field?.value)}
						<br />
						Есть значение: {hasValue ? 'Да' : 'Нет'}
						<br />
						Ошибка: {field?.error || 'Нет'}
						<br />
						Фокус: {field?.focused ? 'Да' : 'Нет'}
					</div>
				</div>
			</div>

			{/* Инструкции */}
			<div style={{ marginTop: '15px', padding: '10px', background: '#e7f3ff', borderRadius: '6px' }}>
				<strong>📝 Инструкции:</strong>
				<ul style={{ fontSize: '12px', color: '#666', marginTop: '5px', paddingLeft: '20px' }}>
					<li>Используйте кнопки "Выбрать X" для программного выбора опций</li>
					<li>Кнопки "Открыть/Закрыть" управляют дропдауном</li>
					<li>Кнопки поиска устанавливают поисковый запрос</li>
					<li>Кнопки "Очистить все" очищают выбранные значения</li>
					<li>Состояние обновляется в реальном времени</li>
				</ul>
			</div>
		</div>
	);
}
