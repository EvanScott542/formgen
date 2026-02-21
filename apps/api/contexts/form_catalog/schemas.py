from __future__ import annotations
from typing import Optional
from pydantic import BaseModel
from shared.renderable_form import RenderableForm


class PublishedForm(BaseModel):
    id: str
    draft_id: str
    name: str
    description: Optional[str] = None
    published_at: str
    renderable: RenderableForm


class CatalogEntry(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    published_at: str
