from __future__ import annotations
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from contexts.form_catalog.models import PublishedFormModel
from contexts.form_catalog.schemas import PublishedForm, CatalogEntry
from contexts.form_catalog.translator import CatalogTranslator
from contexts.form_design.schemas import FormDraft
from shared.renderable_form import RenderableForm


class FormCatalogService:
    def __init__(self, db: Session):
        self.db = db
        self.translator = CatalogTranslator()

    def publish(self, draft: FormDraft) -> PublishedForm:
        renderable = self.translator.to_renderable(draft)

        # Upsert: replace existing published form for this draft
        existing = self.db.query(PublishedFormModel).filter_by(draft_id=draft.id).first()
        now = datetime.now(timezone.utc)

        if existing:
            existing.name = draft.name
            existing.description = draft.description
            existing.published_at = now
            existing.renderable = renderable.model_dump()
            self.db.commit()
            self.db.refresh(existing)
            model = existing
        else:
            model = PublishedFormModel(
                id=str(uuid.uuid4()),
                draft_id=draft.id,
                name=draft.name,
                description=draft.description,
                published_at=now,
                renderable=renderable.model_dump(),
            )
            self.db.add(model)
            self.db.commit()
            self.db.refresh(model)

        return PublishedForm(
            id=model.id,
            draft_id=model.draft_id,
            name=model.name,
            description=model.description,
            published_at=model.published_at.isoformat(),
            renderable=renderable,
        )

    def list_catalog(self) -> list[CatalogEntry]:
        models = self.db.query(PublishedFormModel).order_by(PublishedFormModel.published_at.desc()).all()
        return [
            CatalogEntry(
                id=m.id,
                name=m.name,
                description=m.description,
                published_at=m.published_at.isoformat(),
            )
            for m in models
        ]

    def get_renderable(self, published_id: str) -> RenderableForm | None:
        model = self.db.get(PublishedFormModel, published_id)
        if not model:
            return None
        return RenderableForm(**model.renderable)
