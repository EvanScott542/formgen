from __future__ import annotations
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from contexts.form_design.schemas import (
    FormDraft, FormFieldDraft, FormLayoutDraft, FormActionDraft,
    GenerationRequest, DraftUpdateRequest, DraftSummary,
)
from contexts.form_design.models import FormDraftModel
from contexts.form_design.validator import FormDraftValidator
from contexts.generation.service import GenerationService
from contexts.generation.translator import LLMTranslator
from contexts.form_catalog.service import FormCatalogService


class FormDesignService:
    def __init__(self, db: Session):
        self.db = db
        self.validator = FormDraftValidator()
        self.generation_service = GenerationService()
        self.translator = LLMTranslator()
        self.catalog_service = FormCatalogService(db)

    def generate(self, request: GenerationRequest) -> FormDraft:
        llm_output = self.generation_service.generate(request.prompt)
        draft = self.translator.translate(llm_output, prompt=request.prompt)
        self.validator.validate(draft)
        self._save(draft)
        self.catalog_service.publish(draft)
        return draft

    def get_draft(self, draft_id: str) -> FormDraft | None:
        model = self.db.get(FormDraftModel, draft_id)
        return self._to_schema(model) if model else None

    def list_drafts(self) -> list[DraftSummary]:
        models = self.db.query(FormDraftModel).order_by(FormDraftModel.created_at.desc()).all()
        return [
            DraftSummary(
                id=m.id,
                name=m.name,
                description=m.description,
                status=m.status,
                version=m.version,
                created_at=m.created_at.isoformat(),
                updated_at=m.updated_at.isoformat(),
            )
            for m in models
        ]

    def update_draft(self, draft_id: str, update: DraftUpdateRequest) -> FormDraft | None:
        model = self.db.get(FormDraftModel, draft_id)
        if not model:
            return None

        current = self._to_schema(model)
        updated = current.model_copy(update={
            k: v for k, v in update.model_dump(exclude_none=True).items()
        })
        updated = updated.model_copy(update={
            "version": current.version + 1,
            "status": "saved",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

        self.validator.validate(updated)

        model.name = updated.name
        model.description = updated.description
        model.version = updated.version
        model.status = updated.status
        model.fields = [f.model_dump() for f in updated.fields]
        model.layout = updated.layout.model_dump()
        model.actions = [a.model_dump() for a in updated.actions]
        model.css_overrides = updated.css_overrides
        model.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(model)

        self.catalog_service.publish(updated)
        return updated

    def delete_draft(self, draft_id: str) -> bool:
        model = self.db.get(FormDraftModel, draft_id)
        if not model:
            return False
        self.db.delete(model)
        self.db.commit()
        return True

    def _save(self, draft: FormDraft) -> None:
        model = FormDraftModel(
            id=draft.id,
            name=draft.name,
            description=draft.description,
            prompt=draft.prompt,
            version=draft.version,
            status=draft.status,
            fields=[f.model_dump() for f in draft.fields],
            layout=draft.layout.model_dump(),
            actions=[a.model_dump() for a in draft.actions],
            css_overrides=draft.css_overrides,
            created_at=datetime.fromisoformat(draft.created_at),
            updated_at=datetime.fromisoformat(draft.updated_at),
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)

    def _to_schema(self, model: FormDraftModel) -> FormDraft:
        return FormDraft(
            id=model.id,
            name=model.name,
            description=model.description,
            prompt=model.prompt,
            version=model.version,
            status=model.status,
            created_at=model.created_at.isoformat(),
            updated_at=model.updated_at.isoformat(),
            fields=[FormFieldDraft(**f) for f in model.fields],
            layout=FormLayoutDraft(**model.layout),
            actions=[FormActionDraft(**a) for a in model.actions],
            css_overrides=model.css_overrides,
        )
