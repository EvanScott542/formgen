"""Catalog Translator: resolves all optional fields on FormDraft → RenderableForm.
Consumers of RenderableForm never need to null-check."""
import re
import uuid
from contexts.form_design.schemas import FormDraft
from shared.renderable_form import (
    RenderableForm, RenderableField, RenderableLayout, RenderableAction,
    ValidatorConfig, FieldOption,
)


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


class CatalogTranslator:
    def to_renderable(self, draft: FormDraft) -> RenderableForm:
        layout = RenderableLayout(
            columns=draft.layout.columns,
            gap=draft.layout.gap or "16px",
            breakpoints=draft.layout.breakpoints or {
                "sm": {"columns": 1},
                "md": {"columns": min(2, draft.layout.columns)},
            },
        )

        fields = [self._resolve_field(f, i) for i, f in enumerate(draft.fields)]
        actions = [self._resolve_action(a) for a in draft.actions]

        return RenderableForm(
            id=draft.id,
            name=draft.name,
            layout=layout,
            fields=fields,
            actions=actions,
            css_overrides=draft.css_overrides,
        )

    def _resolve_field(self, field, index: int) -> RenderableField:
        col_span = 1
        order = index
        if field.layout:
            if field.layout.col_span is not None:
                col_span = field.layout.col_span
            if field.layout.order is not None:
                order = field.layout.order

        return RenderableField(
            key=field.key,
            type=field.type,
            label=field.label,
            placeholder=field.placeholder or "",
            hint=field.hint or "",
            default_value=field.default_value,
            validators=field.validators,
            options=field.options,
            col_span=col_span,
            order=order,
            css_class=f"formgen-field--{_slugify(field.key)}",
        )

    def _resolve_action(self, action) -> RenderableAction:
        return RenderableAction(
            type=action.type,
            label=action.label,
            color=action.color or "primary",
            css_class=f"formgen-action--{_slugify(action.type)}",
        )
