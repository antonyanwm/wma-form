import { createContext, useContext } from 'react';

const FormIdContext = createContext<string | null>(null);

export const useFormId = () => {
	const id = useContext(FormIdContext);
	if (!id) throw new Error('FormIdContext not found');
	return id;
};

export const FormProvider = ({ formId, children }: { formId: string; children: React.ReactNode }) => {
	return <FormIdContext.Provider value={formId}>{children}</FormIdContext.Provider>;
};
