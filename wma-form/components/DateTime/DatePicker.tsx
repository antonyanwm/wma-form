import React, { useRef, useEffect } from 'react';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid } from 'date-fns';
import { useFormStore } from '../../../../components/Form/store/formsStore';
import BaseInput from '../BaseInput';

export function FormDatePicker({ formId, name, label = '', required = false, className = '', ...rest }) {
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

	const dateValue = React.useMemo(() => {
		if (typeof value !== 'string' || !value) return null;
		const [year, month, day] = value.split('-').map(Number);
		if (!year || !month || !day) return null;
		const d = new Date(year, month - 1, day);
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
					className={'date-input ' + className}
					icon='calendar'
					value={dateValue ? format(dateValue, 'dd.MM.yyyy') : ''}
					onClick={() => setPickerOpen(true)}
					tabIndex={0}
					blurValidate={false}
					hideErrorOnFocus={false}
					autoComplete='off'
					{...rest}
				/>
				<MuiDatePicker
					disablePast
					enableAccessibleFieldDOMStructure={false}
					open={pickerOpen}
					onOpen={() => setPickerOpen(true)}
					onClose={() => {
						setPickerOpen(false);
						validateField({ formId, name });
					}}
					value={dateValue}
					onChange={(date) => setField(formId, name, date instanceof Date && isValid(date) ? format(date, 'yyyy-MM-dd') : '')}
					onAccept={() => setPickerOpen(false)}
					slots={{
						textField: () => null,
					}}
					// slotProps={{
					// 	actionBar: { actions: ['accept', 'cancel'] },
					// 	popper: { anchorEl: anchorRef.current },
					// }}

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
					closeOnSelect={false}
				/>
			</div>
		</LocalizationProvider>
	);
}
