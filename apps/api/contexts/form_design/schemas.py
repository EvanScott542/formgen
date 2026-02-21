from __future__ import annotations
from typing import Literal, Optional, Any
from pydantic import BaseModel
from shared.renderable_form import FieldType, ValidatorConfig, FieldOption


class FormLayoutDraft(BaseModel):
    columns: Literal[1, 2, 3, 4] = 1
    gap: Optional[str] = None
    breakpoints: Optional[dict[str, dict[str, int]]] = None


class FormFieldLayout(BaseModel):
    col_span: Optional[int] = None
    order: Optional[int] = None


class ConditionalConfig(BaseModel):
    field: str
    operator: Literal["==", "!=", "in"]
    value: Any


class FormFieldDraft(BaseModel):
    key: str
    type: FieldType
    label: str
    placeholder: Optional[str] = None
    hint: Optional[str] = None
    default_value: Optional[Any] = None
    validators: list[ValidatorConfig] = []
    options: list[FieldOption] = []
    layout: Optional[FormFieldLayout] = None
    conditional: Optional[ConditionalConfig] = None


class FormActionDraft(BaseModel):
    type: Literal["submit", "reset", "custom"] = "submit"
    label: str = "Submit"
    color: Optional[Literal["primary", "accent", "warn"]] = None


class FormDraft(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    prompt: str
    version: int = 1
    status: Literal["draft", "saved"] = "draft"
    created_at: str
    updated_at: str
    fields: list[FormFieldDraft]
    layout: FormLayoutDraft
    actions: list[FormActionDraft] = []
    css_overrides: Optional[str] = None


class GenerationRequest(BaseModel):
    prompt: str


class DraftUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    fields: Optional[list[FormFieldDraft]] = None
    layout: Optional[FormLayoutDraft] = None
    actions: Optional[list[FormActionDraft]] = None
    css_overrides: Optional[str] = None


class DraftSummary(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: str
    version: int
    created_at: str
    updated_at: str
