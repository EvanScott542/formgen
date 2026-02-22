import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FormDraft, DraftSummary, GenerationRequest, DraftUpdateRequest,
} from '../models/form-draft';

const API = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class FormDesignApiService {
  constructor(private http: HttpClient) {}

  generate(request: GenerationRequest): Observable<FormDraft> {
    return this.http.post<FormDraft>(`${API}/design/generate`, request);
  }

  listDrafts(): Observable<DraftSummary[]> {
    return this.http.get<DraftSummary[]>(`${API}/design/drafts`);
  }

  getDraft(id: string): Observable<FormDraft> {
    return this.http.get<FormDraft>(`${API}/design/drafts/${id}`);
  }

  updateDraft(id: string, update: DraftUpdateRequest): Observable<FormDraft> {
    return this.http.patch<FormDraft>(`${API}/design/drafts/${id}`, update);
  }

  deleteDraft(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/design/drafts/${id}`);
  }
}
