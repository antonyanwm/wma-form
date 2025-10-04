import { useFormStore } from '../store/formsStore';

export const useFormStatus = (formId: string) => {
	const status = useFormStore((s) => s.formsMeta[formId]?.status || 'idle');
	const isLoading = status === 'loading';
	const isSuccess = status === 'success';
	const isError = status === 'error';
	const isIdle = status === 'idle';

	return {
		status,
		isLoading,
		isSuccess,
		isError,
		isIdle,
	};
};
