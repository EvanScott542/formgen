import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RenderableForm } from '@formgen/ui';
import { FormDesignApiService } from '../../services/form-design-api.service';
import { RenderableFormMapperService } from '../../services/renderable-form-mapper.service';
import { FormDraft, ApiValidationError } from '../../models/form-draft';
import { PreviewPanelComponent } from '../preview-panel/preview-panel.component';

@Component({
  selector: 'app-draft-detail',
  standalone: true,
  imports: [
    RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule, MatDividerModule,
    PreviewPanelComponent,
  ],
  templateUrl: './draft-detail.component.html',
  styleUrl: './draft-detail.component.scss',
})
export class DraftDetailComponent implements OnInit {
  draft = signal<FormDraft | null>(null);
  renderableForm = signal<RenderableForm | null>(null);
  loading = signal(true);
  saving = signal(false);
  errors = signal<ApiValidationError[]>([]);
  saveSuccess = signal(false);

  form!: FormGroup;

  readonly columnOptions = [1, 2, 3, 4];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: FormDesignApiService,
    private mapper: RenderableFormMapperService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getDraft(id).subscribe({
      next: (draft) => {
        this.draft.set(draft);
        this.renderableForm.set(this.mapper.map(draft));
        this.buildForm(draft);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/drafts']);
      },
    });
  }

  private buildForm(draft: FormDraft): void {
    this.form = this.fb.group({
      name: [draft.name, Validators.required],
      columns: [draft.layout.columns],
      fields: this.fb.array(
        draft.fields.map(f => this.fb.group({ label: [f.label, Validators.required] }))
      ),
    });

    // Live preview: remap on every value change
    this.form.valueChanges.subscribe(() => this.updatePreview());
  }

  get fieldsArray(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  fieldGroup(i: number): FormGroup {
    return this.fieldsArray.at(i) as FormGroup;
  }

  private updatePreview(): void {
    const current = this.draft();
    if (!current || !this.form) return;

    const v = this.form.getRawValue();
    const updated: FormDraft = {
      ...current,
      name: v.name,
      layout: { ...current.layout, columns: v.columns as 1|2|3|4 },
      fields: current.fields.map((f, i) => ({
        ...f,
        label: v.fields[i]?.label ?? f.label,
      })),
    };
    this.renderableForm.set(this.mapper.map(updated));
  }

  save(): void {
    if (this.form.invalid || this.saving()) return;
    const current = this.draft()!;
    const v = this.form.getRawValue();

    const updatedFields = current.fields.map((f, i) => ({
      ...f,
      label: v.fields[i]?.label ?? f.label,
    }));

    this.saving.set(true);
    this.errors.set([]);
    this.saveSuccess.set(false);

    this.api.updateDraft(current.id, {
      name: v.name,
      layout: { ...current.layout, columns: v.columns as 1|2|3|4 },
      fields: updatedFields,
      actions: current.actions,
    }).subscribe({
      next: (updated) => {
        this.draft.set(updated);
        this.renderableForm.set(this.mapper.map(updated));
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 2500);
      },
      error: (err) => {
        this.saving.set(false);
        if (err.status === 422 && err.error?.detail) {
          this.errors.set(err.error.detail as ApiValidationError[]);
        } else {
          this.errors.set([{ field: 'form', message: 'Save failed. Please try again.' }]);
        }
      },
    });
  }
}
