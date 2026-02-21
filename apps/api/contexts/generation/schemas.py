from __future__ import annotations
from typing import Optional, Any
from pydantic import BaseModel


class LLMFieldOption(BaseModel):
    label: str
    value: str


class LLMField(BaseModel):
    key: str
    type: str
    label: str
    placeholder: Optional[str] = None
    hint: Optional[str] = None
    required: Optional[bool] = None
    options: Optional[list[LLMFieldOption]] = None


class LLMLayout(BaseModel):
    columns: Optional[int] = None


class LLMFormOutput(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    fields: list[LLMField]
    layout: Optional[LLMLayout] = None
