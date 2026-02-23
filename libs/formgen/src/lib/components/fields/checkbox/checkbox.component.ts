import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RenderableField } from '../../../types/renderable-form';

@Component({
  selector: 'formgen-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule],
  template: `
    <div class="formgen-checkbox-wrapper">
      <mat-checkbox [formControl]="asFormControl">
        {{ field.label }}
      </mat-checkbox>
      @if (field.hint) {
        <div class="formgen-field-hint">{{ field.hint }}</div>
      }
    </div>
  `,
  styles: [
    `.formgen-checkbox-wrapper { display: flex; flex-direction: column; padding: 8px 0; }`,
    `.formgen-field-hint { font-size: 12px; color: var(--mat-sys-on-surface-variant); margin-top: 4px; padding-left: 4px; }`,
  ],
})
export class CheckboxComponent {
  @Input() field!: RenderableField;
  @Input() control!: AbstractControl;

  get asFormControl() {
    return this.control as import('@angular/forms').FormControl;
  }
}
