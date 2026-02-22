import { FieldType, FieldOption, ValidatorConfig } from '@formgen/ui';

export interface FormFieldLayout {
  col_span?: number;
  order?: number;
}

export interface FormFieldDraft {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  hint?: string;
  default_value?: unknown;
  validators: ValidatorConfig[];
  options: FieldOption[];
  layout?: FormFieldLayout;
}

export interface FormLayoutDraft {
  columns: 1 | 2 | 3 | 4;
  gap?: string;
  breakpoints?: Record<string, Record<string, number>>;
}

export interface FormActionDraft {
  type: 'submit' | 'reset' | 'custom';
  label: string;
  color?: 'primary' | 'accent' | 'warn';
}

export interface FormDraft {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  version: number;
  status: 'draft' | 'saved';
  created_at: string;
  updated_at: string;
  fields: FormFieldDraft[];
  layout: FormLayoutDraft;
  actions: FormActionDraft[];
  css_overrides?: string;
}

export interface DraftSummary {
  id: string;
  name: string;
  description?: string;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface GenerationRequest {
  prompt: string;
}

export interface DraftUpdateRequest {
  name?: string;
  description?: string;
  fields?: FormFieldDraft[];
  layout?: FormLayoutDraft;
  actions?: FormActionDraft[];
}

export interface ApiValidationError {
  field: string;
  message: string;
}
