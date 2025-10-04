import React, { useEffect } from 'react';
import InputRadio from './radio'; // обязательно импортируй Radio отсюда!
import { useFormStore } from '../../store/formsStore';
type RadioGroupProps = {
	formId: string;
	name: string;
	initialValue?: string;
	onChange?: (value: string) => void;
	children: React.ReactNode;
	required?: boolean;
	label?: string;
	className?: string;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({ formId, name, initialValue = '', onChange, children, required = false, label, className }) => {
	const field = useFormStore((s) => s.forms[formId]?.[name]);
	const registerField = useFormStore((s) => s.registerField);
	const setFieldValue = useFormStore((s) => s.setFieldValue);
	const setFieldTouched = useFormStore((s) => s.setFieldTouched);

	useEffect(() => {
		registerField({
			formId,
			name,
			label: label ?? '',
			options: { required, type: 'radio', initialValue },
		});
		// eslint-disable-next-line
	}, []);

	const handleRadioChange = (value: string) => {
		setFieldValue(formId, name, value);
		setFieldTouched(formId, name, true);
		onChange?.(value);
	};

	const renderChildren = React.Children.map(children, (child) => {
		if (!React.isValidElement(child)) return null;
		return React.cloneElement(child, {
			checked: field?.value === child.props.value,
			onChange: () => handleRadioChange(child.props.value),
			name,
		} as any);
	});

	return (
		<div className={`${'root'} ${className ? className : ''}`}>
			<div className={['group', className].filter(Boolean).join(' ')}>
				{label && (
					<div className={'label'}>
						{label}
						{required ? ' *' : ''}
					</div>
				)}
				<div className={'options'}>{renderChildren}</div>
				{field?.touched && !!field?.error && <div className={'error'}>{field.error}</div>}
			</div>
		</div>
	);
};
