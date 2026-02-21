"""Seed script — inserts sample published forms directly via FormDesignService.
Run with: python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from shared.database import SessionLocal
from contexts.form_design.schemas import (
    FormDraft, FormFieldDraft, FormLayoutDraft, FormActionDraft, FormFieldLayout,
    GenerationRequest,
)
from contexts.form_design.service import FormDesignService
from contexts.generation.schemas import LLMFormOutput, LLMField, LLMLayout
from shared.renderable_form import FieldOption

SAMPLES = [
    LLMFormOutput(
        name="Job Application",
        description="Apply for an open position at our company.",
        fields=[
            LLMField(key="full_name", type="text", label="Full Name", placeholder="Jane Smith", required=True),
            LLMField(key="email", type="email", label="Email Address", placeholder="jane@example.com", required=True),
            LLMField(key="phone", type="tel", label="Phone Number", placeholder="+1 555 000 0000"),
            LLMField(
                key="position",
                type="select",
                label="Position Applied For",
                required=True,
                options=[
                    {"label": "Software Engineer", "value": "swe"},
                    {"label": "Product Designer", "value": "design"},
                    {"label": "Product Manager", "value": "pm"},
                ],
            ),
            LLMField(key="cover_letter", type="textarea", label="Cover Letter",
                     placeholder="Tell us why you'd be a great fit...", required=True),
        ],
        layout=LLMLayout(columns=2),
    ),
    LLMFormOutput(
        name="Event Registration",
        description="Register your attendance for our upcoming event.",
        fields=[
            LLMField(key="first_name", type="text", label="First Name", required=True),
            LLMField(key="last_name", type="text", label="Last Name", required=True),
            LLMField(key="email", type="email", label="Email Address", required=True),
            LLMField(
                key="ticket_type",
                type="radio",
                label="Ticket Type",
                required=True,
                options=[
                    {"label": "General Admission", "value": "general"},
                    {"label": "VIP", "value": "vip"},
                    {"label": "Student (with valid ID)", "value": "student"},
                ],
            ),
            LLMField(key="dietary", type="textarea", label="Dietary Requirements",
                     placeholder="e.g. vegetarian, nut allergy..."),
            LLMField(key="newsletter", type="checkbox", label="Send me event updates"),
        ],
        layout=LLMLayout(columns=2),
    ),
    LLMFormOutput(
        name="Customer Feedback",
        description="Share your experience with our product.",
        fields=[
            LLMField(key="name", type="text", label="Your Name", placeholder="Optional"),
            LLMField(key="email", type="email", label="Email Address"),
            LLMField(
                key="rating",
                type="select",
                label="Overall Rating",
                required=True,
                options=[
                    {"label": "⭐ Poor", "value": "1"},
                    {"label": "⭐⭐ Fair", "value": "2"},
                    {"label": "⭐⭐⭐ Good", "value": "3"},
                    {"label": "⭐⭐⭐⭐ Very Good", "value": "4"},
                    {"label": "⭐⭐⭐⭐⭐ Excellent", "value": "5"},
                ],
            ),
            LLMField(key="comments", type="textarea", label="Comments",
                     placeholder="Tell us what you loved or how we can improve...", required=True),
        ],
        layout=LLMLayout(columns=1),
    ),
]


def run():
    from contexts.generation.translator import LLMTranslator
    from contexts.form_catalog.service import FormCatalogService

    db = SessionLocal()
    translator = LLMTranslator()
    catalog_service = FormCatalogService(db)
    validator_cls = __import__(
        "contexts.form_design.validator", fromlist=["FormDraftValidator"]
    ).FormDraftValidator
    validator = validator_cls()

    for i, llm_output in enumerate(SAMPLES):
        prompt = f"Seed: {llm_output.name}"
        draft = translator.translate(llm_output, prompt=prompt)
        validator.validate(draft)

        # Persist draft
        from contexts.form_design.models import FormDraftModel
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
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
        db.merge(model)
        db.commit()

        # Publish to catalog
        catalog_service.publish(draft)
        print(f"  ✓ Seeded '{draft.name}' (id={draft.id[:8]}...)")

    db.close()
    print(f"\nDone — {len(SAMPLES)} forms seeded.")


if __name__ == "__main__":
    run()
