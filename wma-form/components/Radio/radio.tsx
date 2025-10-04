import React from 'react';
import { useFormId } from '../FormProvider';
import { useFormStore } from '../../store/formsStore';
import { Text } from 'wma-component';

type RadioOption = { label: string; value: string };

type InputRadioProps = {
	name: string;
	label?: string;
	required?: boolean;
	initialValue?: string;
	options: RadioOption[];
	validator?: ({ value, name }: { value: string; name: string }) => string;
	formId?: string;
	className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked' | 'name' | 'type' | 'value'>;

const InputRadio: React.FC<InputRadioProps> = ({ name, label = '', required, initialValue = '', validator, options, formId: forcedFormId, className = '', ...rest }) => {
	const [focused, setFocused] = React.useState(false);
	const ctxFormId = useFormId();
	const formId = forcedFormId || ctxFormId || 'form';

	const value = useFormStore((s) => s.forms[formId]?.[name]?.value ?? '');
	const error = useFormStore((s) => s.forms[formId]?.[name]?.error ?? '');
	const touched = useFormStore((s) => s.forms[formId]?.[name]?.touched ?? false);
	const registerField = useFormStore((s) => s.registerField);
	const setFieldValue = useFormStore((s) => s.setFieldValue);
	const validateField = useFormStore((s) => s.validateField);

	React.useEffect(() => {
		registerField({
			formId,
			name,
			options: {
				type: 'radio',
				required,
				initialValue: initialValue ?? '',
				validator,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formId, name]);

	const onChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFieldValue(formId, name, e.target.value);
		},
		[formId, name, setFieldValue]
	);

	const onBlur = React.useCallback(() => {
		validateField({ formId, name });
	}, [formId, name, validateField]);

	const showError = touched && !!error;
	const disabled = !!(rest as any)?.disabled;
	const storeValue = !!value;
	const wrapperClass = ['field', className, disabled ? 'disabled' : '', showError ? 'error' : '', touched ? 'touched' : '', focused ? 'focus' : '', storeValue ? 'active' : '']
		.filter(Boolean)
		.join(' ');

	return (
		<div className={wrapperClass}>
			{label && <div>{label}</div>}
			{options.map((opt) => (
				<label
					key={opt.value}
					className={'item'}>
					<input
						type='radio'
						name={name}
						value={opt.value}
						checked={value === opt.value}
						onChange={onChange}
						onBlur={onBlur}
						{...rest}
					/>
					<span>{opt.label}</span>
				</label>
			))}
			{showError && (
				<div className={'error'}>
					<Text
						className='error-text'
						text={error}
					/>
				</div>
			)}
		</div>
	);
};

export default InputRadio;
