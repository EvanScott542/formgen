import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormDesignApiService } from '../../services/form-design-api.service';
import { ApiValidationError } from '../../models/form-draft';

@Component({
  selector: 'app-prompt-view',
  standalone: true,
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule, MatCardModule,
  ],
  templateUrl: './prompt-view.component.html',
  styleUrl: './prompt-view.component.scss',
})
export class PromptViewComponent {
  prompt = '';
  loading = signal(false);

  private api = inject(FormDesignApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  submit(): void {
    if (!this.prompt.trim() || this.loading()) return;
    this.loading.set(true);

    this.api.generate({ prompt: this.prompt }).subscribe({
      next: (draft) => {
        this.loading.set(false);
        this.router.navigate(['/drafts', draft.id]);
      },
      error: (err) => {
        this.loading.set(false);
        let message = 'Generation failed. Please try again.';
        if (err.status === 422 && err.error?.detail) {
          const detail = err.error.detail as ApiValidationError[];
          message = detail.map((e) => e.message).join(' ');
        }
        this.snackBar.open(message, 'Dismiss', { duration: 5000 });
      },
    });
  }
}
