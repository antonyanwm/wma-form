import React from 'react';
import { SelectSearch } from 'wma-form';

const SimpleSelectTest: React.FC = () => {
	const options = [
		{ value: 1, label: 'Простой 1' },
		{ value: 2, label: 'Простой 2' },
		{ value: 3, label: 'Простой 3' },
		{ value: 4, label: 'Простой 4' },
		{ value: 5, label: 'Простой 5' },
	];

	return (
		<div style={{ padding: '20px', border: '2px solid #28a745', margin: '20px 0' }}>
			<h3>✅ Простой тест без внешнего управления</h3>
			<p>Этот селект работает без внешнего управления - просто кликайте по опциям в дропдауне</p>

			<SelectSearch
				formId='simple-form'
				name='simple-select'
				options={options}
				multiple={false}
				placeholder='Выберите опцию (кликните по дропдауну)'
				style={{ marginBottom: '10px' }}
			/>

			<div style={{ fontSize: '12px', color: '#666' }}>
				<strong>Инструкции:</strong>
				<br />
				1. Кликните по полю ввода
				<br />
				2. Выберите любую опцию из дропдауна
				<br />
				3. Проверьте, отображается ли выбранное значение в поле
			</div>
		</div>
	);
};

export default SimpleSelectTest;






