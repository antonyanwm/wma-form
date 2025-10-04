import React from 'react';
import { useFormId } from '../FormProvider';
import { useFormStore } from '../../store/formsStore';
import { Text } from 'wma-component';
import './style.css';

type InputCheckboxProps = {
	name: string;
	label?: string;
	required?: boolean;
	initialValue?: boolean;
	validator?: ({ value, name }: { value: boolean; name: string }) => string;
	formId?: string;
	className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked' | 'name' | 'type'>;

const InputCheckbox: React.FC<InputCheckboxProps> = ({ name, label = '', required, initialValue = false, validator, formId: forcedFormId, className = '', ...rest }) => {
	const [focused, setFocused] = React.useState(false);
	const ctxFormId = useFormId();
	const formId = forcedFormId || ctxFormId || 'form';

	const checked = useFormStore((s) => Boolean(s.forms[formId]?.[name]?.value));
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
				type: 'checkbox',
				required,
				initialValue: initialValue ?? false,
				validator,
			},
		});
	}, [formId, name]);

	const onChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFieldValue(formId, name, e.target.checked);
		},
		[formId, name, setFieldValue]
	);

	const onBlur = React.useCallback(() => {
		validateField({ formId, name });
	}, [formId, name, validateField]);

	const showError = touched && !!error;
	const disabled = !!(rest as any)?.disabled;
	const storeValue = !!checked;
	const wrapperClass = ['field', 'checkbox', className, disabled ? 'disabled' : '', showError ? 'error' : '', touched ? 'touched' : '', focused ? 'focus' : '', storeValue ? 'active' : '']
		.filter(Boolean)
		.join(' ');

	return (
		<div className={wrapperClass}>
			<label className={`custom-checkbox-label ${className}`}>
				<div className='custom-checkbox'>
					<input
						type='checkbox'
						name={name}
						checked={checked}
						onChange={onChange}
						onBlur={onBlur}
						{...rest}
					/>

					<div className='checkbox-visual'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'>
							<path
								className='tick'
								fillRule='evenodd'
								clipRule='evenodd'
								d='M21.5553 5.30296C21.8365 5.58425 21.9945 5.96571 21.9945 6.36346C21.9945 6.76121 21.8365 7.14267 21.5553 7.42396L10.3123 18.667C10.1637 18.8156 9.98733 18.9335 9.79318 19.0139C9.59904 19.0943 9.39095 19.1357 9.1808 19.1357C8.97066 19.1357 8.76257 19.0943 8.56843 19.0139C8.37428 18.9335 8.19788 18.8156 8.0493 18.667L2.4633 13.082C2.32004 12.9436 2.20576 12.7781 2.12715 12.5951C2.04854 12.4121 2.00716 12.2152 2.00543 12.0161C2.0037 11.8169 2.04165 11.6194 2.11707 11.435C2.19249 11.2507 2.30387 11.0832 2.44471 10.9424C2.58555 10.8015 2.75303 10.6901 2.93737 10.6147C3.12172 10.5393 3.31924 10.5014 3.51841 10.5031C3.71757 10.5048 3.9144 10.5462 4.09741 10.6248C4.28042 10.7034 4.44593 10.8177 4.5843 10.961L9.1803 15.557L19.4333 5.30296C19.5726 5.16357 19.738 5.053 19.9201 4.97755C20.1021 4.90211 20.2972 4.86328 20.4943 4.86328C20.6914 4.86328 20.8865 4.90211 21.0686 4.97755C21.2506 5.053 21.416 5.16357 21.5553 5.30296Z'
							/>
						</svg>
					</div>
				</div>
				{label && <span>{label}</span>}
				{showError && (
					<div className={'error'}>
						<Text
							className='error-text'
							text={error}
						/>
					</div>
				)}
			</label>
		</div>
	);
};

export default InputCheckbox;
