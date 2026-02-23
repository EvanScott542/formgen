import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormDesignApiService } from '../../services/form-design-api.service';
import { DraftSummary } from '../../models/form-draft';
import { EmptyStateComponent, StatusChipComponent, LoadingBarDirective } from '@formgen/ui';

@Component({
  selector: 'app-draft-list-view',
  standalone: true,
  imports: [
    RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatProgressBarModule,
    EmptyStateComponent, StatusChipComponent, LoadingBarDirective,
  ],
  templateUrl: './draft-list-view.component.html',
  styleUrl: './draft-list-view.component.scss',
})
export class DraftListViewComponent implements OnInit {
  drafts = signal<DraftSummary[]>([]);
  loading = signal(true);
  deletingId = signal<string | null>(null);

  private api = inject(FormDesignApiService);

  ngOnInit(): void {
    this.loadDrafts();
  }

  private loadDrafts(): void {
    this.loading.set(true);
    this.api.listDrafts().subscribe({
      next: (drafts) => {
        const sorted = [...drafts].sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        this.drafts.set(sorted);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  delete(id: string): void {
    this.deletingId.set(id);
    this.api.deleteDraft(id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.drafts.update(d => d.filter(x => x.id !== id));
      },
      error: () => this.deletingId.set(null),
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  }
}
