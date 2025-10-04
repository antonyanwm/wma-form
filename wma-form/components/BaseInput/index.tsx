import React, { useEffect, useCallback } from 'react';
import { useFormId } from '../FormProvider';
import { useFormStore } from '../../store/formsStore';
import { Text, Icon } from 'wma-component';

type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type InputFocusEvent = React.FocusEvent<HTMLInputElement>;
type TextareaFocusEvent = React.FocusEvent<HTMLTextAreaElement>;
import './style.css';

type BaseInputProps = {
	name: string;
	required?: boolean;
	initialValue?: string;
	validator?: ({ value, name }: { value: string; name: string }) => string;
	label?: string;
	icon?: string;
	type?: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'number' | 'url';
	formId?: string;
	className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'name' | 'type'>;

const BaseInput: React.FC<BaseInputProps> = ({ name, required, initialValue = '', validator, label = '', icon, type = 'text', formId: forcedFormId, className = '', ...rest }) => {
	const [focused, setFocused] = React.useState(false);
	const ctxFormId = useFormId();
	const formId = forcedFormId || ctxFormId || 'form';
	const t = (key: string) => key; // Простая заглушка для перевода

	const value = useFormStore((s) => s.forms[formId]?.[name]?.value ?? '');
	const error = useFormStore((s) => s.forms[formId]?.[name]?.error ?? '');
	const touched = useFormStore((s) => s.forms[formId]?.[name]?.touched ?? false);
	const registerField = useFormStore((s) => s.registerField);
	const setFieldValue = useFormStore((s) => s.setFieldValue);
	const validateField = useFormStore((s) => s.validateField);

	useEffect(() => {
		registerField({
			formId,
			name,
			options: {
				type: type === 'textarea' ? 'text' : type,
				required,
				initialValue: initialValue ?? '',
				validator,
			},
		});
	}, [formId, name, type]);

	const onChange = useCallback(
		(e: InputEvent) => {
			setFieldValue(formId, name, e.target.value);
		},
		[formId, name, setFieldValue]
	);

	const onBlur = useCallback(
		(e: any) => {
			validateField({ formId, name });
		},
		[formId, name, validateField]
	);

	const showError = touched && !!error;
	const disabled = !!(rest as any)?.disabled;
	const storeValue = Array.isArray(value) ? value.length > 0 : typeof value === 'string' ? value.trim() !== '' : !!value;
	const wrapperClass = ['field', className, disabled ? 'disabled' : '', showError ? 'error' : '', touched ? 'touched' : '', focused ? 'focus' : '', storeValue ? 'active' : '']
		.filter(Boolean)
		.join(' ');

	const renderInput = () => {
		if (type === 'textarea') {
			const { type: _, ...textareaProps } = rest as any;
			return (
				<textarea
					id={name}
					name={name}
					className={'input'}
					value={value}
					onChange={onChange}
					onFocus={(e: any) => setFocused(true)}
					onBlur={(e: any) => {
						setFocused(false);
						onBlur(e);
					}}
					{...textareaProps}
				/>
			);
		}
		return (
			<input
				id={name}
				name={name}
				className={'input'}
				value={value}
				onChange={onChange}
				onFocus={(e: any) => setFocused(true)}
				onBlur={(e: any) => {
					setFocused(false);
					onBlur(e);
				}}
				type={type}
				{...rest}
			/>
		);
	};

	return (
		<div className={wrapperClass}>
			{label && (
				<label
					className={'label'}
					htmlFor={name}>
					<span>{label}</span>
					<div className={'wrap-input'}>
						{renderInput()}
						{icon && (
							<span className={'icon'}>
								<Icon name={icon} />
							</span>
						)}
					</div>
				</label>
			)}
			{!label && (
				<div className={'wrap-input'}>
					{renderInput()}
					{icon && (
						<span className={'icon'}>
							<Icon name={icon} />
						</span>
					)}
				</div>
			)}

			{showError && (
				<div className='error-message'>
					<Text
						className='error-text'
						text={error}
					/>
				</div>
			)}
		</div>
	);
};

export default React.memo(BaseInput);
