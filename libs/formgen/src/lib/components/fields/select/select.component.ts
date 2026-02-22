import { Component, Input, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RenderableField } from '../../../types/renderable-form';
import { ValidatorFactoryService } from '../../../services/validator-factory.service';
import { getFirstError } from '../field-errors';

@Component({
  selector: 'formgen-select',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  template: `
    <mat-form-field appearance="outline" class="formgen-field-full-width">
      <mat-label>{{ field.label }}</mat-label>
      <mat-select [formControl]="asFormControl" [placeholder]="field.placeholder">
        @for (option of field.options; track option.value) {
          <mat-option [value]="option.value">{{ option.label }}</mat-option>
        }
      </mat-select>
      @if (field.hint) {
        <mat-hint>{{ field.hint }}</mat-hint>
      }
      @if (errorMessage) {
        <mat-error>{{ errorMessage }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: [`.formgen-field-full-width { width: 100%; }`],
})
export class SelectComponent {
  @Input() field!: RenderableField;
  @Input() control!: AbstractControl;

  private validatorFactory = inject(ValidatorFactoryService);

  get asFormControl() {
    return this.control as import('@angular/forms').FormControl;
  }

  get errorMessage(): string | null {
    return getFirstError(this.control, this.field.validators, this.validatorFactory);
  }
}
