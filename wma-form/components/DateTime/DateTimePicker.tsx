import React, { useRef, useEffect, useMemo, useState } from 'react';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid, parse } from 'date-fns';
import { useFormStore } from '../../../../components/Form/store/formsStore';
import BaseInput from '../BaseInput';

type Props = {
	formId: string;
	extraName?: string;
	name: string;
	label?: string;
	required?: boolean;
	className?: string;
	[key: string]: any;
};

export function FormDateTimePicker({ formId, name, label = '', required = false, className = '', extraName, ...rest }: Props) {
	const dateName = `date${extraName || ''}`; //'yyyy-MM-dd'
	const timeName = `time${extraName || ''}`; // 'HH:mm'

	useEffect(() => {
		const reg = useFormStore.getState().registerField;
		reg({ formId, name, label, options: { type: 'text', required, initialValue: '' } });
		reg({ formId, name: dateName, label: `${label} (date)`, options: { type: 'text', initialValue: '' } });
		reg({ formId, name: timeName, label: `${label} (time)`, options: { type: 'text', initialValue: '' } });
	}, [formId, name, dateName, timeName, label, required]);

	const value = useFormStore((s) => s.forms[formId]?.[name]?.value as string | undefined);
	const setField = useFormStore((s) => s.setFieldValue);
	const validateField = useFormStore((s) => s.validateField);

	const dateTimeValue = useMemo(() => {
		if (!value) return null;
		const dt = parse(value.replace('T', ' '), 'yyyy-MM-dd HH:mm', new Date());
		return isValid(dt) ? dt : null;
	}, [value]);

	useEffect(() => {
		if (!dateTimeValue) {
			setField(formId, dateName, '');
			setField(formId, timeName, '');
			return;
		}
		const d = format(dateTimeValue, 'yyyy-MM-dd');
		const t = format(dateTimeValue, 'HH:mm');

		if (useFormStore.getState().forms[formId]?.[dateName]?.value !== d) setField(formId, dateName, d);
		if (useFormStore.getState().forms[formId]?.[timeName]?.value !== t) setField(formId, timeName, t);
	}, [dateTimeValue, formId, dateName, timeName, setField]);

	const [pickerOpen, setPickerOpen] = useState(false);
	const anchorRef = useRef<HTMLDivElement>(null);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<div
				className='wrapper-input-field-anchor'
				ref={anchorRef}>
				<BaseInput
					formId={formId}
					name={name}
					label={label}
					required={required}
					readOnly
					className={'datetime-input ' + className}
					icon='calendar'
					value={dateTimeValue ? format(dateTimeValue, 'dd.MM.yyyy HH:mm') : ''}
					onClick={() => setPickerOpen(true)}
					tabIndex={0}
					blurValidate={false}
					hideErrorOnFocus={false}
					autoComplete='off'
					{...rest}
				/>

				<MuiDateTimePicker
					disablePast
					enableAccessibleFieldDOMStructure={false}
					open={pickerOpen}
					onOpen={() => setPickerOpen(true)}
					onClose={() => {
						setPickerOpen(false);
						validateField({ formId, name });
					}}
					value={dateTimeValue}
					onChange={(date) => {
						if (date instanceof Date && isValid(date)) {
							const full = format(date, 'yyyy-MM-dd HH:mm');
							const d = format(date, 'yyyy-MM-dd');
							const t = format(date, 'HH:mm');
							setField(formId, name, full);
							setField(formId, dateName, d);
							setField(formId, timeName, t);
						} else {
							setField(formId, name, '');
							setField(formId, dateName, '');
							setField(formId, timeName, '');
						}
					}}
					onAccept={() => setPickerOpen(false)}
					ampm={false}
					closeOnSelect={false}
					slots={{ textField: () => null }}
					slotProps={{
						actionBar: { actions: ['accept', 'cancel'] },
						popper: {
							anchorEl: anchorRef.current,
							disablePortal: true,
							modifiers: [
								{ name: 'preventOverflow', options: { boundary: 'viewport', altAxis: true } },
								{ name: 'flip', options: { fallbackPlacements: ['bottom', 'top', 'right', 'left'] } },
							],
						},
					}}
					{...rest}
				/>
			</div>
		</LocalizationProvider>
	);
}
