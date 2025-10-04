import React, { useRef, useEffect } from 'react';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid } from 'date-fns';
import { useFormStore } from '../../../../components/Form/store/formsStore';
import BaseInput from '../BaseInput';

export function FormTimePicker({ formId, name, label = '', required = false, className = '', ...rest }) {
	useEffect(() => {
		useFormStore.getState().registerField({
			formId,
			name,
			label,
			options: { type: 'text', required, initialValue: '' },
		});
	}, [formId, name, label, required]);

	const value = useFormStore((s) => s.forms[formId]?.[name]?.value);
	const setField = useFormStore((s) => s.setFieldValue);
	const validateField = useFormStore((s) => s.validateField);

	const timeValue = React.useMemo(() => {
		if (typeof value !== 'string' || !value) return null;
		const [hours, minutes] = value.split(':').map(Number);
		if (!Number.isFinite(hours) || !Number.isFinite(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
		const d = new Date();
		d.setHours(hours, minutes, 0, 0);
		return isValid(d) ? d : null;
	}, [value]);

	const [pickerOpen, setPickerOpen] = React.useState(false);
	const anchorRef = useRef<HTMLDivElement>(null);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<div ref={anchorRef}>
				<BaseInput
					formId={formId}
					name={name}
					label={label}
					required={required}
					readOnly
					className={'time-input ' + className}
					icon='clock'
					value={timeValue ? format(timeValue, 'HH:mm') : ''}
					onClick={() => setPickerOpen(true)}
					tabIndex={0}
					blurValidate={false}
					hideErrorOnFocus={false}
					autoComplete='off'
					{...rest}
				/>
				<MuiTimePicker
					// disablePast
					enableAccessibleFieldDOMStructure={false}
					open={pickerOpen}
					onOpen={() => setPickerOpen(true)}
					onClose={() => {
						setPickerOpen(false);
						validateField({ formId, name });
					}}
					value={timeValue}
					onChange={(date) => setField(formId, name, date instanceof Date && isValid(date) ? format(date, 'HH:mm') : '')}
					onAccept={() => setPickerOpen(false)}
					slots={{
						textField: () => null,
					}}
					slotProps={{
						actionBar: { actions: ['accept', 'cancel'] },
						popper: {
							anchorEl: anchorRef.current,
							modifiers: [
								{
									name: 'preventOverflow',
									options: {
										boundary: 'viewport',
										altAxis: true,
									},
								},
								{
									name: 'flip',
									options: {
										fallbackPlacements: ['bottom', 'top', 'right', 'left'],
									},
								},
							],
						},
					}}
					ampm={false}
					closeOnSelect={false}
					{...rest}
				/>
			</div>
		</LocalizationProvider>
	);
}
