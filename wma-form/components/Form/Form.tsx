import React, { FormEvent, useId, useMemo, useCallback } from 'react';
import { useFormStore } from '../../store/formsStore';
import { FormProvider } from '../FormProvider';
import BaseInput from '../BaseInput';
import './zero.css';
import './FormStyle.css';
import { focusFirstErrors } from '../../utils';

type MaybePromise<T> = T | Promise<T>;

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
	formId?: string;
	onValidSubmit: (args: { values: Record<string, any>; fields: Record<string, any> }) => MaybePromise<void>;
	onInvalidSubmit?: (arg: { errors: Record<string, string>; values: Record<string, any>; data: Record<string, any> }) => void;
	children?: React.ReactNode;
	fields?: any[];
	focusFirstError?: boolean;
	resetOnSuccess?: boolean;
	except?: string[];
}

const Form: React.FC<FormProps> = ({ formId, onValidSubmit, onInvalidSubmit, children, fields, focusFirstError = true, resetOnSuccess = false, except = [], ...props }) => {
	const reactId = useId();
	const id = useMemo(() => formId || `f_${reactId}`, [formId, reactId]);

	const validateForm = useFormStore((s) => s.validateForm);
	const getFormAllFieldData = useFormStore((s) => s.getFormAllFieldData);
	const resetForm = useFormStore((s) => s.resetForm);
	const setFieldTouched = useFormStore((s) => s.setFieldTouched);
	const getFormData = useFormStore((s) => s.getFormData);
	const beginSubmit = useFormStore((s) => s.beginSubmit);
	const submitSuccess = useFormStore((s) => s.submitSuccess);
	const submitError = useFormStore((s) => s.submitError);
	const formStatus = useFormStore((s) => s.formsMeta[id]?.status || 'idle');

	const handleSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			// Prevent multiple submissions
			if (formStatus === 'loading') return;

			const formEl = e.currentTarget;

			// mark all touched
			const formData = getFormData({ formId: id });
			Object.keys(formData).forEach((name) => setFieldTouched(id, name, true));

			const isValid = validateForm({ formId: id });
			const allFieldData = getFormAllFieldData({ formId: id }) || {};

			if (!isValid) {
				const errors = Object.fromEntries(
					Object.entries(allFieldData)
						.filter(([, f]: any) => f.error)
						.map(([k, f]: any) => [k, f.error])
				) as Record<string, string>;

				if (focusFirstError) {
					focusFirstErrors(formEl, Object.keys(errors)[0]);
				}

				onInvalidSubmit?.({
					errors,
					values: Object.fromEntries(Object.entries(allFieldData).map(([k, f]: any) => [k, f.value])),
					data: allFieldData,
				});
				return;
			}

			// Start loading
			beginSubmit(id);

			try {
				// success
				await onValidSubmit({
					values: Object.fromEntries(Object.entries(allFieldData).map(([k, f]: any) => [k, f.value])),
					fields: allFieldData,
				});

				// Mark as success
				submitSuccess(id);

				if (resetOnSuccess) {
					resetForm({ formId: id, except });
				}
			} catch (error) {
				// Mark as error
				submitError(id);
				throw error; // Re-throw to let parent handle the error
			}
		},
		[
			id,
			getFormData,
			setFieldTouched,
			validateForm,
			getFormAllFieldData,
			onInvalidSubmit,
			onValidSubmit,
			focusFirstError,
			resetOnSuccess,
			except,
			resetForm,
			beginSubmit,
			submitSuccess,
			submitError,
			formStatus,
		]
	);

	return (
		<FormProvider formId={id}>
			<form
				className={['root', props.className].filter(Boolean).join(' ')}
				id={id}
				onSubmit={handleSubmit}
				noValidate
				data-loading={formStatus === 'loading'}
				{...props}>
				{fields?.map((field) => (
					<BaseInput
						key={field.name}
						{...field}
					/>
				))}
				{children}
			</form>
		</FormProvider>
	);
};

export default Form;
