import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RenderableForm } from '../types/renderable-form';
import { ValidatorFactoryService } from './validator-factory.service';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
  private validatorFactory = inject(ValidatorFactoryService);

  build(config: RenderableForm): FormGroup {
    const controls: Record<string, FormControl> = {};
    for (const field of config.fields) {
      const validators = this.validatorFactory.build(field.validators);
      controls[field.key] = new FormControl(
        field.default_value ?? null,
        validators,
      );
    }
    return new FormGroup(controls);
  }
}
