export type FieldType =
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  | 'textarea' | 'select' | 'checkbox' | 'radio'
  | 'date' | 'slider' | 'toggle';

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface ValidatorConfig {
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email';
  value?: unknown;
  message?: string;
}

export interface RenderableLayout {
  columns: 1 | 2 | 3 | 4;
  gap: string;
  breakpoints: {
    sm: { columns: number };
    md: { columns: number };
  };
}

export interface RenderableField {
  key: string;
  type: FieldType;
  label: string;
  placeholder: string;
  hint: string;
  default_value?: unknown;
  validators: ValidatorConfig[];
  options: FieldOption[];
  col_span: number;
  order: number;
  css_class: string;
}

export interface RenderableAction {
  type: 'submit' | 'reset' | 'custom';
  label: string;
  color: 'primary' | 'accent' | 'warn';
  css_class: string;
}

export interface RenderableForm {
  id: string;
  name: string;
  layout: RenderableLayout;
  fields: RenderableField[];
  actions: RenderableAction[];
  css_overrides?: string;
}
