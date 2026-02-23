import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormCatalogApiService } from '../../services/form-catalog-api.service';
import { CatalogEntry } from '../../models/catalog';

@Component({
  selector: 'app-catalog-browser',
  standalone: true,
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule,
    MatListModule, MatProgressSpinnerModule, MatIconModule, MatTooltipModule,
  ],
  templateUrl: './catalog-browser.component.html',
  styleUrl: './catalog-browser.component.scss',
})
export class CatalogBrowserComponent implements OnInit {
  @Output() formSelected = new EventEmitter<string>();
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

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

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    if (event.key === '/' && !inInput) {
      event.preventDefault();
      this.searchInputRef?.nativeElement.focus();
    }
  }
}
