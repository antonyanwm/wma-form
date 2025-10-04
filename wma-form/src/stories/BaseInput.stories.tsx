import type { Meta, StoryObj } from '@storybook/react';
import { Form, BaseInput } from '../../index';
import React from 'react';

const meta: Meta<typeof BaseInput> = {
	title: 'Components/BaseInput',
	component: BaseInput,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Базовый компонент ввода с валидацией и различными типами полей.',
			},
		},
	},
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'number', 'tel', 'url'],
			description: 'Тип поля ввода',
		},
		required: {
			control: 'boolean',
			description: 'Обязательное поле',
		},
		disabled: {
			control: 'boolean',
			description: 'Отключенное состояние',
		},
		maxLength: {
			control: { type: 'number', min: 1, max: 1000 },
			description: 'Максимальная длина',
		},
		minLength: {
			control: { type: 'number', min: 1, max: 100 },
			description: 'Минимальная длина',
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BaseInput>;

// Базовый пример
export const Default: Story = {
	args: {
		formId: 'storybook-form',
		name: 'default-input',
		label: 'Базовое поле',
		placeholder: 'Введите текст...',
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};

// Email поле
export const Email: Story = {
	args: {
		formId: 'storybook-form',
		name: 'email-input',
		label: 'Email',
		type: 'email',
		placeholder: 'example@email.com',
		required: true,
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};

// Пароль
export const Password: Story = {
	args: {
		formId: 'storybook-form',
		name: 'password-input',
		label: 'Пароль',
		type: 'password',
		placeholder: 'Введите пароль',
		required: true,
		minLength: 8,
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};

// Числовое поле
export const Number: Story = {
	args: {
		formId: 'storybook-form',
		name: 'number-input',
		label: 'Возраст',
		type: 'number',
		placeholder: 'Введите возраст',
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};

// Отключенное поле
export const Disabled: Story = {
	args: {
		formId: 'storybook-form',
		name: 'disabled-input',
		label: 'Отключенное поле',
		placeholder: 'Нельзя редактировать',
		disabled: true,
		initialValue: 'Заблокированное значение',
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};

// С валидацией
export const WithValidation: Story = {
	args: {
		formId: 'storybook-form',
		name: 'validated-input',
		label: 'Поле с валидацией',
		placeholder: 'Минимум 5 символов',
		required: true,
		validator: ({ value }) => {
			if (!value) return 'Поле обязательно для заполнения';
			if (value.length < 5) return 'Минимум 5 символов';
			if (!value.includes('@')) return 'Должно содержать символ @';
			return '';
		},
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};

// С ограничением длины
export const WithLengthLimit: Story = {
	args: {
		formId: 'storybook-form',
		name: 'limited-input',
		label: 'Поле с ограничением',
		placeholder: 'Максимум 20 символов',
		maxLength: 20,
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};

// Телефон
export const Phone: Story = {
	args: {
		formId: 'storybook-form',
		name: 'phone-input',
		label: 'Телефон',
		type: 'tel',
		placeholder: '+7 (999) 123-45-67',
		validator: ({ value }) => {
			if (!value) return '';
			const phoneRegex = /^\+?[1-9]\d{1,14}$/;
			if (!phoneRegex.test(value.replace(/\D/g, ''))) {
				return 'Введите корректный номер телефона';
			}
			return '';
		},
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};

// URL
export const URL: Story = {
	args: {
		formId: 'storybook-form',
		name: 'url-input',
		label: 'Веб-сайт',
		type: 'url',
		placeholder: 'https://example.com',
		validator: ({ value }) => {
			if (!value) return '';
			try {
				new URL(value);
				return '';
			} catch {
				return 'Введите корректный URL';
			}
		},
	},
	decorators: [
		(Story) => (
			<Form formId='storybook-form'>
				<Story />
			</Form>
		),
	],
};
