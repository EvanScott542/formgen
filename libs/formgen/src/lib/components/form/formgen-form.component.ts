import {
  Component, Input, Output, EventEmitter, OnChanges,
  SimpleChanges, computed, signal,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NgComponentOutlet, NgStyle } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RenderableForm, RenderableField } from '../../types/renderable-form';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormFieldFactoryService } from '../../services/form-field-factory.service';
import { LayoutEngineService } from '../../services/layout-engine.service';
import { CssSelectorGeneratorService } from '../../services/css-selector-generator.service';

@Component({
  selector: 'formgen-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgComponentOutlet, NgStyle, MatCardModule, MatButtonModule],
  templateUrl: './formgen-form.component.html',
  styleUrl: './formgen-form.component.scss',
})
export class FormgenFormComponent implements OnChanges {
  @Input() config!: RenderableForm;
  @Output() formSubmit = new EventEmitter<Record<string, unknown>>();

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilderService,
    public fieldFactory: FormFieldFactoryService,
    public layoutEngine: LayoutEngineService,
    public selectorGenerator: CssSelectorGeneratorService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.form = this.formBuilder.build(this.config);
    }
  }

  get sortedFields(): RenderableField[] {
    return [...this.config.fields].sort((a, b) => a.order - b.order);
  }

  get gridContainerStyles(): Record<string, string> {
    return this.layoutEngine.gridContainerStyles(this.config.layout);
  }

  fieldStyles(field: RenderableField): Record<string, string> {
    return this.layoutEngine.fieldStyles(field, this.config.layout.columns);
  }

  fieldInputs(field: RenderableField): Record<string, unknown> {
    return {
      field,
      control: this.form.get(field.key)!,
    };
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value as Record<string, unknown>);
    }
  }

  onReset(): void {
    this.form.reset();
  }
}
