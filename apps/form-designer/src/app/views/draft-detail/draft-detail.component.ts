import { Component, OnInit, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RenderableForm } from '@formgen/ui';
import { FormDesignApiService } from '../../services/form-design-api.service';
import { RenderableFormMapperService } from '../../services/renderable-form-mapper.service';
import { FormDraft, ApiValidationError } from '../../models/form-draft';
import { PreviewPanelComponent } from '../preview-panel/preview-panel.component';

@Component({
  selector: 'app-draft-detail',
  standalone: true,
  imports: [
    NgTemplateOutlet, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule, MatDividerModule,
    MatChipsModule, MatTabsModule, DragDropModule,
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

  form!: FormGroup;
  readonly columnOptions = [1, 2, 3, 4];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(FormDesignApiService);
  private mapper = inject(RenderableFormMapperService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 1023px)').pipe(
      map(result => result.matches)
    ),
    { initialValue: false }
  );

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

    this.form.valueChanges.subscribe(() => this.updatePreview());
  }

  get fieldsArray(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  fieldGroup(i: number): FormGroup {
    return this.fieldsArray.at(i) as FormGroup;
  }

  dropField(event: CdkDragDrop<unknown[]>): void {
    const current = this.draft()!;
    const fields = [...current.fields];
    moveItemInArray(fields, event.previousIndex, event.currentIndex);
    this.draft.set({ ...current, fields });

    const ctrl = this.fieldsArray.at(event.previousIndex);
    this.fieldsArray.removeAt(event.previousIndex);
    this.fieldsArray.insert(event.currentIndex, ctrl);

    this.updatePreview();
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
        this.snackBar.open('Saved', undefined, { duration: 2000 });
      },
      error: (err) => {
        this.saving.set(false);
        let message = 'Save failed. Please try again.';
        if (err.status === 422 && err.error?.detail) {
          const detail = err.error.detail as ApiValidationError[];
          message = 'Save failed: ' + detail.map(e => e.message).join(' ');
        }
        this.snackBar.open(message, 'Retry', { duration: 6000 });
      },
    });
  }
}
