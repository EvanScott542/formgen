import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { FormDesignApiService } from '../../services/form-design-api.service';
import { DraftSummary } from '../../models/form-draft';

@Component({
  selector: 'app-draft-list-view',
  standalone: true,
  imports: [
    RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatChipsModule,
  ],
  templateUrl: './draft-list-view.component.html',
  styleUrl: './draft-list-view.component.scss',
})
export class DraftListViewComponent implements OnInit {
  drafts = signal<DraftSummary[]>([]);
  loading = signal(true);
  deletingId = signal<string | null>(null);

  constructor(private api: FormDesignApiService) {}

  ngOnInit(): void {
    this.loadDrafts();
  }

  private loadDrafts(): void {
    this.loading.set(true);
    this.api.listDrafts().subscribe({
      next: (drafts) => { this.drafts.set(drafts); this.loading.set(false); },
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
