import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogEntry } from '../models/catalog';
import { RenderableForm } from '@formgen/ui';

const API = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class FormCatalogApiService {
  private http = inject(HttpClient);

  listForms(): Observable<CatalogEntry[]> {
    return this.http.get<CatalogEntry[]>(`${API}/catalog/forms`);
  }

  getForm(id: string): Observable<RenderableForm> {
    return this.http.get<RenderableForm>(`${API}/catalog/forms/${id}`);
  }
}
