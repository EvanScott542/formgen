import { Injectable } from '@angular/core';
import { RenderableForm, RenderableField } from '../types/renderable-form';

export interface FormSelectors {
  form: string;
  fields: Record<string, FieldSelectors>;
  actions: Record<string, string>;
}

export interface FieldSelectors {
  wrapper: string;
  type: string;
  matField: string;
}

@Injectable({ providedIn: 'root' })
export class CssSelectorGeneratorService {
  generate(config: RenderableForm): FormSelectors {
    const fields: Record<string, FieldSelectors> = {};
    for (const field of config.fields) {
      fields[field.key] = this.fieldSelectors(field);
    }

    const actions: Record<string, string> = {};
    for (const action of config.actions) {
      actions[action.type] = action.css_class;
    }

    return {
      form: `formgen-form--${this.slugify(config.name)}`,
      fields,
      actions,
    };
  }

  private fieldSelectors(field: RenderableField): FieldSelectors {
    return {
      wrapper: field.css_class,
      type: `formgen-type--${field.type}`,
      matField: `${field.css_class} .mat-mdc-form-field`,
    };
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
