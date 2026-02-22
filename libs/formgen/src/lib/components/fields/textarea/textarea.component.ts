import { Component, Input, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RenderableField } from '../../../types/renderable-form';
import { ValidatorFactoryService } from '../../../services/validator-factory.service';
import { getFirstError } from '../field-errors';

@Component({
  selector: 'formgen-textarea',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline" class="formgen-field-full-width">
      <mat-label>{{ field.label }}</mat-label>
      <textarea
        matInput
        [placeholder]="field.placeholder"
        [formControl]="asFormControl"
        rows="4"
      ></textarea>
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
export class TextareaComponent {
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
