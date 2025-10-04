import React from 'react';
import { useSelectExternalControl } from 'wma-form';
import { SelectSearch } from 'wma-form';

// Продвинутый тест с дополнительными функциями
export function AdvancedSelectTest() {
	const formId = 'advanced-test';
	const fieldName = 'advanced-select';

	const {
		selectByValue,
		clearAll,
		openDropdown,
		closeDropdown,
		setSearchQuery,
		getSelectedValues,
		getSelectedCount,
		hasSelectedValues,
		getFieldState,
		isOptionSelected,
		getAvailableOptions,
		focusField,
		blurField,
		validateField,
		markAsTouched,
		inputRef,
	} = useSelectExternalControl({
		formId,
		name: fieldName,
		multiple: true,
		options: [
			{ label: 'Продвинутый 1', value: '1' },
			{ label: 'Продвинутый 2', value: '2' },
			{ label: 'Продвинутый 3', value: '3' },
			{ label: 'Продвинутый 4', value: '4' },
			{ label: 'Продвинутый 5', value: '5' },
		],
	});

	const fieldState = getFieldState();
	const availableOptions = getAvailableOptions();

	return (
		<div style={{ padding: '20px', border: '2px solid #6f42c1', borderRadius: '8px', marginBottom: '20px' }}>
			<h3 style={{ color: '#6f42c1', marginTop: 0 }}>🚀 Продвинутый тест с дополнительными функциями</h3>
			<p style={{ color: '#666', marginBottom: '20px' }}>Этот компонент демонстрирует все дополнительные функции внешнего управления</p>

			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
				{/* Селект */}
				<div style={{ flex: 1 }}>
					<SelectSearch
						formId={formId}
						name={fieldName}
						label='Продвинутый селект'
						options={[
							{ label: 'Продвинутый 1', value: '1' },
							{ label: 'Продвинутый 2', value: '2' },
							{ label: 'Продвинутый 3', value: '3' },
							{ label: 'Продвинутый 4', value: '4' },
							{ label: 'Продвинутый 5', value: '5' },
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
								style={{ background: '#6f42c1', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Выбрать 1
							</button>
							<button
								onClick={() => selectByValue('2')}
								style={{ background: '#6f42c1', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Выбрать 2
							</button>
							<button
								onClick={() => selectByValue('3')}
								style={{ background: '#6f42c1', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Выбрать 3
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

					{/* Управление фокусом */}
					<div style={{ borderBottom: '1px solid #dee2e6', paddingBottom: '8px', marginBottom: '8px' }}>
						<strong style={{ fontSize: '12px', color: '#666' }}>Фокус:</strong>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
							<button
								onClick={focusField}
								style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Установить фокус
							</button>
							<button
								onClick={blurField}
								style={{ background: '#6c757d', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Снять фокус
							</button>
						</div>
					</div>

					{/* Валидация и состояние */}
					<div style={{ borderBottom: '1px solid #dee2e6', paddingBottom: '8px', marginBottom: '8px' }}>
						<strong style={{ fontSize: '12px', color: '#666' }}>Валидация:</strong>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
							<button
								onClick={() => {
									const result = validateField();
									alert(`Валидация: ${result ? 'Пройдена' : 'Не пройдена'}`);
								}}
								style={{ background: '#ffc107', color: 'black', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Валидировать поле
							</button>
							<button
								onClick={markAsTouched}
								style={{ background: '#fd7e14', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
								Отметить как touched
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
								Очистить все
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Состояние */}
			<div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
				<strong>📊 Текущее состояние:</strong>
				<div style={{ fontSize: '12px', color: '#666', marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
					<div>
						<strong>Основное состояние:</strong>
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
						<br />
						Touched: {fieldState.touched ? 'Да' : 'Нет'}
					</div>
					<div>
						<strong>Проверка опций:</strong>
						<br />
						Опция 1 выбрана: {isOptionSelected('1') ? 'Да' : 'Нет'}
						<br />
						Опция 2 выбрана: {isOptionSelected('2') ? 'Да' : 'Нет'}
						<br />
						Опция 3 выбрана: {isOptionSelected('3') ? 'Да' : 'Нет'}
						<br />
						Доступно опций: {availableOptions.length}
						<br />
						Поиск: {fieldState.query || 'Пустой'}
					</div>
				</div>
			</div>

			{/* Инструкции */}
			<div style={{ marginTop: '15px', padding: '10px', background: '#e2e3e5', borderRadius: '6px' }}>
				<strong>📝 Дополнительные функции:</strong>
				<ul style={{ fontSize: '12px', color: '#666', marginTop: '5px', paddingLeft: '20px' }}>
					<li>
						<strong>isOptionSelected(value)</strong> - проверяет, выбрана ли конкретная опция
					</li>
					<li>
						<strong>getAvailableOptions()</strong> - возвращает все доступные опции
					</li>
					<li>
						<strong>focusField()</strong> - устанавливает фокус на поле
					</li>
					<li>
						<strong>blurField()</strong> - снимает фокус с поля
					</li>
					<li>
						<strong>validateField()</strong> - валидирует поле и возвращает результат
					</li>
					<li>
						<strong>markAsTouched()</strong> - отмечает поле как touched
					</li>
				</ul>
			</div>
		</div>
	);
}
