
export type MetaStatus = 'idle' | 'loading' | 'success' | 'error';

export type ValidatorParams = {
  value: any;
  name: string;
  label?: string;
  opts?: Record<string, any>;
};

export type FieldValidator = (p: ValidatorParams) => string;

export type MirrorWhen = 'valid' | 'always';

export type InputType =
  | 'text' | 'email' | 'password' | 'tel' | 'number'
  | 'textarea' | 'select' | 'date' | 'time' | 'datetime'
  | 'checkbox' | 'radio'
  | (string & {})

export type BaseField = {
  error: string;
  touched: boolean;
  focused: boolean;
  required: boolean;
  validator?: FieldValidator;
  type: InputType;
  minLength?: number;
  maxLength?: number;
  label?: string;

  // mirror
  mirrorOf?: string;
  mirrorWhen?: MirrorWhen;
  mirrorIfEmptyOnly?: boolean;

  // radio
  radioGroup?: string;

  [key: string]: any;
};

export type FieldState = BaseField & { value: any };
export type FormState = Record<string, FieldState>;

export type ComputedForm = {
  values: Record<string, any>;
  errors: Record<string, string>;
  isValid: boolean;
};

export type FormsMeta = Record<string, { status: MetaStatus; serverErrors?: Record<string, string> }>;
