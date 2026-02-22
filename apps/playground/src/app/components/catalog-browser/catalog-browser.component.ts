import { Component, OnInit, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormCatalogApiService } from '../../services/form-catalog-api.service';
import { CatalogEntry } from '../../models/catalog';

@Component({
  selector: 'app-catalog-browser',
  standalone: true,
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule,
    MatListModule, MatProgressSpinnerModule, MatIconModule,
  ],
  templateUrl: './catalog-browser.component.html',
  styleUrl: './catalog-browser.component.scss',
})
export class CatalogBrowserComponent implements OnInit {
  @Output() formSelected = new EventEmitter<string>();

  private allEntries = signal<CatalogEntry[]>([]);
  searchQuery = signal('');
  loading = signal(true);
  selectedId = signal<string | null>(null);

  filteredEntries = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.allEntries().filter(e =>
      !q || e.name.toLowerCase().includes(q) || (e.description ?? '').toLowerCase().includes(q)
    );
  });

  private api = inject(FormCatalogApiService);

  ngOnInit(): void {
    this.api.listForms().subscribe({
      next: (entries) => { this.allEntries.set(entries); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  select(entry: CatalogEntry): void {
    this.selectedId.set(entry.id);
    this.formSelected.emit(entry.id);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  }
}
