import { Injectable } from '@angular/core';
import { RenderableForm, RenderableField, RenderableLayout, RenderableAction } from '@formgen/ui';
import { FormDraft, FormFieldDraft, FormActionDraft } from '../models/form-draft';

@Injectable({ providedIn: 'root' })
export class RenderableFormMapperService {
  map(draft: FormDraft): RenderableForm {
    const layout: RenderableLayout = {
      columns: draft.layout.columns,
      gap: draft.layout.gap ?? '16px',
      breakpoints: (draft.layout.breakpoints as { sm: { columns: number }; md: { columns: number } }) ?? {
        sm: { columns: 1 },
        md: { columns: Math.min(2, draft.layout.columns) },
      },
    };

    const fields: RenderableField[] = draft.fields.map((f, i) => this.mapField(f, i));
    const actions: RenderableAction[] = draft.actions.map(a => this.mapAction(a));

    return { id: draft.id, name: draft.name, layout, fields, actions, css_overrides: draft.css_overrides };
  }

  private mapField(f: FormFieldDraft, index: number): RenderableField {
    const colSpan = f.layout?.col_span ?? 1;
    const order   = f.layout?.order   ?? index;
    return {
      key: f.key,
      type: f.type,
      label: f.label,
      placeholder: f.placeholder ?? '',
      hint: f.hint ?? '',
      default_value: f.default_value,
      validators: f.validators,
      options: f.options,
      col_span: colSpan,
      order,
      css_class: `formgen-field--${this.slugify(f.key)}`,
    };
  }

  private mapAction(a: FormActionDraft): RenderableAction {
    return {
      type: a.type,
      label: a.label,
      color: a.color ?? 'primary',
      css_class: `formgen-action--${this.slugify(a.type)}`,
    };
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
