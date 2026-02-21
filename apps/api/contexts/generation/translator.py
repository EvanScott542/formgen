"""ACL Translator: coerces LLMFormOutput → FormDraft (LLM-specific concerns only)."""
import uuid
from datetime import datetime, timezone
from contexts.generation.schemas import LLMFormOutput
from contexts.form_design.schemas import (
    FormDraft, FormFieldDraft, FormLayoutDraft, FormActionDraft, FormFieldLayout,
)
from shared.renderable_form import FieldType, ValidatorConfig, FieldOption

VALID_FIELD_TYPES: set[str] = {
    "text", "email", "password", "number", "tel", "url",
    "textarea", "select", "checkbox", "radio",
    "date", "slider", "toggle",
}


class LLMTranslator:
    def translate(self, output: LLMFormOutput, prompt: str) -> FormDraft:
        now = datetime.now(timezone.utc).isoformat()

        fields = [self._translate_field(f, i) for i, f in enumerate(output.fields)]

        columns = 1
        if output.layout and output.layout.columns:
            columns = max(1, min(4, output.layout.columns))

        return FormDraft(
            id=str(uuid.uuid4()),
            name=output.name or "Untitled Form",
            description=output.description,
            prompt=prompt,
            version=1,
            status="draft",
            created_at=now,
            updated_at=now,
            fields=fields,
            layout=FormLayoutDraft(columns=columns),
            actions=[FormActionDraft(type="submit", label="Submit", color="primary")],
        )

    def _translate_field(self, llm_field, index: int) -> FormFieldDraft:
        field_type: FieldType = llm_field.type if llm_field.type in VALID_FIELD_TYPES else "text"

        validators: list[ValidatorConfig] = []
        if llm_field.required:
            validators.append(ValidatorConfig(type="required"))

        options: list[FieldOption] = []
        if llm_field.options:
            options = [FieldOption(label=o.label, value=o.value) for o in llm_field.options]

        return FormFieldDraft(
            key=llm_field.key,
            type=field_type,
            label=llm_field.label,
            placeholder=llm_field.placeholder,
            hint=llm_field.hint,
            validators=validators,
            options=options,
            layout=FormFieldLayout(order=index, col_span=1),
        )
