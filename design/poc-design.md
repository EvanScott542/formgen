# FormGen POC — Execution Prompt

You are implementing the FormGen POC described in `formgen-poc-plan.md`, which lives alongside this file in the `design/` directory. Read that document in full before doing anything else.

---

## Your Operating Rules

- **Ask before you act.** Block 1 is decisions only — confirm all answers before running a single command.
- **One block at a time.** Complete and validate each block before moving to the next. Do not chain blocks automatically.
- **Validate after every critical step.** After each step marked ✅ in the checklist below, run the validation commands for that step and confirm they pass before continuing. If validation fails, fix it before moving on.
- **Update the checklist as you go.** After each ✅ step completes successfully, mark it `[x]` in the checklist.
- **Never leave the workspace root.** All paths are relative to the directory where you are running. Nothing is created outside it.
- **Surface blockers immediately.** If a command fails or a decision is ambiguous, stop and ask rather than guessing.

---

## Execution Checklist

### Phase 0 — Scaffolding

- [x] ✅ **0.1** Block 1 decisions confirmed (package manager, Angular version, Node version, Python version, Postgres approach, app names, library scope)
- [x] ✅ **0.2** Configurator Nx app created and `ng serve` renders Angular shell at `http://localhost:4200`
- [x] ✅ **0.3** Angular Material added to Configurator app — theme compiles with no errors
- [x] ✅ **0.4** Formgen library scaffolded and `ng build` produces a `dist/` folder with no errors
- [x] ✅ **0.5** Playground Nx app created and `ng serve` renders Angular shell at `http://localhost:4201`
- [x] ✅ **0.6** Angular Material added to Playground app — theme compiles with no errors
- [x] ✅ **0.7** Formgen library linked to Playground via tsconfig path alias — Playground builds with no errors
- [x] ✅ **0.8** FastAPI backend scaffolded — context folder structure exists, `uvicorn main:app --reload` starts with no errors and Swagger UI is reachable at `http://localhost:8000/docs`
- [x] ✅ **0.9** Postgres running via Docker Compose — `docker-compose ps` shows container healthy
- [x] ✅ **0.10** Alembic initialised — `alembic upgrade head` runs with no errors

---

### Phase 1 — Shared Kernel (RenderableForm)

- [x] ✅ **1.1** `shared/renderable_form.py` defined — Pydantic schema imports cleanly, no errors on `python -c "from shared.renderable_form import RenderableForm"`
- [x] **1.2** `RenderableForm` TypeScript interfaces defined in formgen library
- [x] **1.3** `FormBuilderService` implemented — takes `RenderableForm`, returns `FormGroup`
- [x] **1.4** `ValidatorFactoryService` implemented — maps `ValidatorConfig[]` → Angular `Validators`
- [x] ✅ **1.5** `FormgenFormComponent` built — accepts `[config]: RenderableForm`, renders inside a MatCard with no compilation errors
- [x] **1.6** Field components built: `text`, `textarea`, `select`, `checkbox`, `radio`
- [x] **1.7** `FormFieldFactory` implemented — resolves field type to component dynamically
- [x] **1.8** `CssSelectorGeneratorService` implemented
- [x] **1.9** `LayoutEngine` implemented — CSS Grid from `RenderableLayout`
- [x] **1.10** Form actions implemented — submit/reset buttons emit value via `@Output`
- [x] ✅ **1.11** Formgen library builds cleanly — `ng build` produces `dist/` with no errors; hardcoded `RenderableForm` fixture renders a visible form in the Playground app

---

### Phase 2 — FastAPI Backend

- [x] ✅ **2.1** Context folder structure confirmed — `form_design/`, `generation/`, `form_catalog/`, `shared/` all present with correct files
- [x] **2.2** `RenderableForm` Pydantic schema in `shared/` — matches TypeScript interfaces
- [x] **2.3** `FormDraft` schemas defined in `form_design/`
- [x] **2.4** `LLMFormOutput` schemas and ACL translator defined in `generation/`
- [x] **2.5** `PublishedForm` schemas and catalog translator defined in `form_catalog/`
- [x] ✅ **2.6** `FormDraftValidator` implemented — all five invariants present and covered by unit tests; `pytest contexts/form_design/test_validator.py` passes (13/13)
- [x] **2.7** SQLAlchemy models defined — `form_drafts` and `published_forms` tables
- [x] ✅ **2.8** Alembic migration applied — `alembic upgrade head` runs cleanly; both tables visible in Postgres
- [x] ✅ **2.9** `FormDesignService` implemented — stub generation, CRUD, validator on every write, auto-publish trigger; all routes respond correctly in Swagger UI
- [x] ✅ **2.10** `FormCatalogService` implemented — `GET /catalog/forms` returns `CatalogEntry[]`; `GET /catalog/forms/{id}` returns a `RenderableForm`
- [x] ✅ **2.11** All routers mounted, CORS configured — Configurator and Playground can reach the API from `localhost:4200` and `localhost:4201` without CORS errors
- [x] **2.12** Seed script run — 3 sample `PublishedForm` records seeded; `GET /catalog/forms` returns 4 entries

---

### Phase 3 — Generation Context (LLM Integration)

- [x] **3.1** `GenerationService` implemented — calls LLM API (Anthropic claude-haiku-4-5), returns raw `LLMFormOutput`; falls back to deterministic stub when no API key is set
- [x] **3.2** ACL translator implemented — coerces `LLMFormOutput` → `FormDraft` (type coercion, required→ValidatorConfig, column clamping, default submit action)
- [x] **3.3** System prompt written — instructs LLM to return valid `LLMFormOutput` JSON with field rules and layout hints
- [x] ✅ **3.4** End-to-end generation works — `POST /design/generate` returns a valid `FormDraft`; draft passes validator and is auto-published; `GET /catalog/forms` shows the new entry
- [x] **3.5** Malformed LLM output handled — `json.JSONDecodeError` and Pydantic `ValidationError` both caught and re-raised as `GenerationOutputError`; router returns 422 with `{"field": "llm_output", "message": "..."}`, not a 500

---

### Phase 4 — Configurator App

- [x] **4.1** `PromptView` built — textarea + submit, calls `POST /design/generate`, navigates to `/drafts/:id` on success
- [x] **4.2** `FormDesignApiService` built — typed client for `/design/*` (generate, list, get, update, delete)
- [x] **4.3** `RenderableFormMapper` implemented — maps `FormDraft` → `RenderableForm` client-side (mirrors catalog translator defaults)
- [x] ✅ **4.4** `PreviewPanel` renders a form — mapped `RenderableForm` → `FormgenFormComponent` with no console errors
- [x] **4.5** `DraftDetail` editor built — form-over-data view: name, layout columns, per-field label editing
- [x] ✅ **4.6** Manual edit loop works end-to-end — edits update preview live via `form.valueChanges`; Save calls `PATCH`; 422 errors surface inline; success banner shown
- [x] **4.7** `DraftListView` built — lists drafts with version/status, Edit link, Delete button with loading state
- [x] ✅ **4.8** Full Configurator flow stable — `nx build form-designer` succeeds; all views lazy-loaded; prompt → generate → preview → edit → save → re-render wired end-to-end

---

### Phase 5 — Playground App

- [ ] **5.1** `FormCatalogApiService` built — typed client for `/catalog/*`
- [ ] **5.2** `CatalogBrowser` built — fetches and lists `CatalogEntry[]` with search
- [ ] ✅ **5.3** `FormPreviewPanel` renders a catalog form — select a form from the browser, fetch by ID, render via formgen with no console errors
- [ ] **5.4** `ThemePicker` built — toggles between at least two Material themes; form re-renders correctly under each
- [ ] **5.5** Generated CSS selectors displayed alongside the rendered form
- [ ] ✅ **5.6** Full Playground flow stable — browse catalog, select form, render, switch theme; no console errors; CSS selectors visible

---

## Validation Commands by Step

Reference these when a ✅ step completes.

```bash
# 0.2 — Configurator shell
cd apps/configurator && npx nx serve <configurator-app-name>
# → http://localhost:4200 renders without errors

# 0.4 — Formgen library build
cd libs/formgen/formgen-workspace && ng build <formgen-lib-name>
# → dist/ produced, no errors

# 0.5 — Playground shell
cd apps/playground && npx nx serve <playground-app-name> --port 4201
# → http://localhost:4201 renders without errors

# 0.8 — FastAPI starts
cd apps/api && source .venv/bin/activate && uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs shows Swagger UI with /design/* and /catalog/* route groups

# 0.9 — Postgres healthy
docker compose ps
# → postgres container status: healthy

# 0.10 / 2.8 — Alembic migration
cd apps/api && source .venv/bin/activate && alembic upgrade head
# → no errors; form_drafts and published_forms tables exist

# 1.1 — RenderableForm schema import
cd apps/api && source .venv/bin/activate
python -c "from shared.renderable_form import RenderableForm; print('OK')"

# 2.6 — Validator unit tests
cd apps/api && source .venv/bin/activate && pytest contexts/form_design/test_validator.py -v
# → all five invariant tests pass

# 3.4 — End-to-end generation
curl -X POST http://localhost:8000/design/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A simple contact form with name, email, and message"}'
# → returns a FormDraft; GET /catalog/forms shows the new entry
```

---

## Starting Instruction

Begin with Block 1. Ask all decision questions before running any commands. Do not proceed to Block 2 until every question in Block 1 has a confirmed answer.
