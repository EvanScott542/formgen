from __future__ import annotations
from typing import Literal, Optional, Any
from pydantic import BaseModel


FieldType = Literal[
    "text", "email", "password", "number", "tel", "url",
    "textarea", "select", "checkbox", "radio",
    "date", "slider", "toggle",
]


class FieldOption(BaseModel):
    label: str
    value: str | int


class ValidatorConfig(BaseModel):
    type: Literal["required", "minLength", "maxLength", "min", "max", "pattern", "email"]
    value: Optional[Any] = None
    message: Optional[str] = None


class RenderableLayout(BaseModel):
    columns: Literal[1, 2, 3, 4]
    gap: str
    breakpoints: dict[str, dict[str, int]]


class RenderableField(BaseModel):
    key: str
    type: FieldType
    label: str
    placeholder: str
    hint: str
    default_value: Optional[Any] = None
    validators: list[ValidatorConfig]
    options: list[FieldOption]
    col_span: int
    order: int
    css_class: str


class RenderableAction(BaseModel):
    type: Literal["submit", "reset", "custom"]
    label: str
    color: Literal["primary", "accent", "warn"]
    css_class: str


class RenderableForm(BaseModel):
    id: str
    name: str
    layout: RenderableLayout
    fields: list[RenderableField]
    actions: list[RenderableAction]
    css_overrides: Optional[str] = None
