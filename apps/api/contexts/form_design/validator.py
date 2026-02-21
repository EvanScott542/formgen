from contexts.form_design.schemas import FormDraft
from shared.errors import DraftValidationError, FieldValidationError


class FormDraftValidator:
    """Enforces domain invariants on FormDraft. Runs on every write — source agnostic."""

    def validate(self, draft: FormDraft) -> None:
        errors: list[FieldValidationError] = []

        # Invariant 1: Draft must have a non-empty name
        if not draft.name or not draft.name.strip():
            errors.append(FieldValidationError(field="name", message="Draft name must not be empty."))

        # Invariant 2: All field key values must be unique within the draft
        keys = [f.key for f in draft.fields]
        seen = set()
        duplicates = set()
        for key in keys:
            if key in seen:
                duplicates.add(key)
            seen.add(key)
        if duplicates:
            errors.append(FieldValidationError(
                field="fields",
                message=f"Duplicate field keys found: {sorted(duplicates)}",
            ))

        # Invariant 3: Each field's col_span must not exceed draft's layout.columns
        for field in draft.fields:
            col_span = field.layout.col_span if field.layout and field.layout.col_span else 1
            if col_span > draft.layout.columns:
                errors.append(FieldValidationError(
                    field=f"fields.{field.key}.layout.col_span",
                    message=(
                        f"Field '{field.key}' col_span ({col_span}) exceeds "
                        f"layout columns ({draft.layout.columns})."
                    ),
                ))

        # Invariant 4: Fields of type select or radio must have at least one option
        for field in draft.fields:
            if field.type in ("select", "radio") and not field.options:
                errors.append(FieldValidationError(
                    field=f"fields.{field.key}.options",
                    message=f"Field '{field.key}' of type '{field.type}' must have at least one option.",
                ))

        # Invariant 5: Draft must have at least one action
        if not draft.actions:
            errors.append(FieldValidationError(
                field="actions",
                message="Draft must have at least one action.",
            ))

        if errors:
            raise DraftValidationError(errors)
