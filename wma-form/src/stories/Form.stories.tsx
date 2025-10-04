import type { Meta, StoryObj } from '@storybook/react';
import { Form, SelectSearch, BaseInput, Checkbox, RadioGroup } from '../../index';
import InputRadio from '../../components/Radio/radio';
import { Option } from '../../components/SelectSearch/types';
import React from 'react';

const meta: Meta<typeof Form> = {
	title: 'Components/Form',
	component: Form,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Компонент формы с валидацией и управлением состоянием.',
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const sampleOptions: Option[] = [
	{ label: 'Москва', value: 'moscow' },
	{ label: 'Санкт-Петербург', value: 'spb' },
	{ label: 'Новосибирск', value: 'novosibirsk' },
	{ label: 'Екатеринбург', value: 'ekaterinburg' },
];

// Простая форма
export const SimpleForm: Story = {
	render: () => (
		<Form formId='simple-form'>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
				<BaseInput
					formId='simple-form'
					name='name'
					label='Имя'
					placeholder='Введите ваше имя'
					required
				/>
				<BaseInput
					formId='simple-form'
					name='email'
					label='Email'
					type='email'
					placeholder='example@email.com'
					required
				/>
				<SelectSearch
					formId='simple-form'
					name='city'
					label='Город'
					options={sampleOptions}
					placeholder='Выберите город'
				/>
				<button
					type='submit'
					style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
					Отправить
				</button>
			</div>
		</Form>
	),
};

// Форма с валидацией
export const FormWithValidation: Story = {
	render: () => (
		<Form formId='validation-form'>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
				<BaseInput
					formId='validation-form'
					name='username'
					label='Имя пользователя'
					placeholder='Минимум 3 символа'
					required
					validator={({ value }) => {
						if (!value) return 'Поле обязательно';
						if (value.length < 3) return 'Минимум 3 символа';
						return '';
					}}
				/>
				<BaseInput
					formId='validation-form'
					name='password'
					label='Пароль'
					type='password'
					placeholder='Минимум 8 символов'
					required
					validator={({ value }) => {
						if (!value) return 'Поле обязательно';
						if (value.length < 8) return 'Минимум 8 символов';
						return '';
					}}
				/>
				<BaseInput
					formId='validation-form'
					name='confirmPassword'
					label='Подтвердите пароль'
					type='password'
					placeholder='Повторите пароль'
					required
					validator={({ value, opts }) => {
						if (!value) return 'Поле обязательно';
						if (value !== opts?.password) return 'Пароли не совпадают';
						return '';
					}}
				/>
				<button
					type='submit'
					style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
					Зарегистрироваться
				</button>
			</div>
		</Form>
	),
};

// Форма с множественным выбором
export const FormWithMultipleSelect: Story = {
	render: () => (
		<Form formId='multiple-form'>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
				<BaseInput
					formId='multiple-form'
					name='projectName'
					label='Название проекта'
					placeholder='Введите название проекта'
					required
				/>
				<SelectSearch
					formId='multiple-form'
					name='technologies'
					label='Технологии'
					options={[
						{ label: 'React', value: 'react' },
						{ label: 'Vue', value: 'vue' },
						{ label: 'Angular', value: 'angular' },
						{ label: 'Node.js', value: 'nodejs' },
						{ label: 'Python', value: 'python' },
						{ label: 'TypeScript', value: 'typescript' },
						{ label: 'JavaScript', value: 'javascript' },
					]}
					multiple={true}
					maxVisibleItems={3}
					placeholder='Выберите технологии'
				/>
				<SelectSearch
					formId='multiple-form'
					name='priority'
					label='Приоритет'
					options={[
						{ label: 'Низкий', value: 'low' },
						{ label: 'Средний', value: 'medium' },
						{ label: 'Высокий', value: 'high' },
						{ label: 'Критический', value: 'critical' },
					]}
					placeholder='Выберите приоритет'
					required
				/>
				<Checkbox
					formId='multiple-form'
					name='isPublic'
					label='Публичный проект'
				/>
				<button
					type='submit'
					style={{ padding: '12px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}>
					Создать проект
				</button>
			</div>
		</Form>
	),
};

// Форма с радио-группой
export const FormWithRadioGroup: Story = {
	render: () => (
		<Form formId='radio-form'>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
				<BaseInput
					formId='radio-form'
					name='fullName'
					label='Полное имя'
					placeholder='Введите полное имя'
					required
				/>
				<RadioGroup
					formId='radio-form'
					name='gender'
					label='Пол'
					required>
					<InputRadio
						value='male'
						label='Мужской'
					/>
					<InputRadio
						value='female'
						label='Женский'
					/>
					<InputRadio
						value='other'
						label='Другой'
					/>
				</RadioGroup>
				<SelectSearch
					formId='radio-form'
					name='country'
					label='Страна'
					options={[
						{ label: 'Россия', value: 'ru' },
						{ label: 'Беларусь', value: 'by' },
						{ label: 'Казахстан', value: 'kz' },
						{ label: 'Украина', value: 'ua' },
					]}
					placeholder='Выберите страну'
				/>
				<button
					type='submit'
					style={{ padding: '12px', background: '#fd7e14', color: 'white', border: 'none', borderRadius: '4px' }}>
					Сохранить
				</button>
			</div>
		</Form>
	),
};
