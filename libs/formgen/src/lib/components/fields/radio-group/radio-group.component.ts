import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { RenderableField } from '../../../types/renderable-form';

@Component({
  selector: 'formgen-radio-group',
  standalone: true,
  imports: [ReactiveFormsModule, MatRadioModule],
  template: `
    <div class="formgen-radio-wrapper">
      <span class="formgen-radio-label">{{ field.label }}</span>
      <mat-radio-group [formControl]="asFormControl" class="formgen-radio-group" [attr.aria-label]="field.label">
        @for (option of field.options; track option.value) {
          <mat-radio-button [value]="option.value">{{ option.label }}</mat-radio-button>
        }
      </mat-radio-group>
      @if (field.hint) {
        <div class="formgen-field-hint">{{ field.hint }}</div>
      }
    </div>
  `,
  styles: [
    `.formgen-radio-wrapper { display: flex; flex-direction: column; padding: 8px 0; }`,
    `.formgen-radio-label { font-size: 14px; color: var(--mat-sys-on-surface-variant); margin-bottom: 8px; }`,
    `.formgen-radio-group { display: flex; flex-direction: column; gap: 4px; }`,
    `.formgen-field-hint { font-size: 12px; color: var(--mat-sys-on-surface-variant); margin-top: 4px; }`,
  ],
})
export class RadioGroupComponent {
  @Input() field!: RenderableField;
  @Input() control!: AbstractControl;

  get asFormControl() {
    return this.control as import('@angular/forms').FormControl;
  }
}
