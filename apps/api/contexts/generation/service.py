import json
import os
import anthropic
from contexts.generation.schemas import LLMFormOutput

SYSTEM_PROMPT = """You are a form schema generator. Given a plain English description of a form, return a JSON object matching this schema exactly (no markdown, no commentary — raw JSON only):

{
  "name": "string — short descriptive name for the form",
  "description": "string — one sentence describing the form's purpose",
  "fields": [
    {
      "key": "snake_case_unique_key",
      "type": "one of: text, email, password, number, tel, url, textarea, select, checkbox, radio, date, slider, toggle",
      "label": "Human-readable label",
      "placeholder": "optional placeholder text",
      "hint": "optional helper text shown below the field",
      "required": true or false,
      "options": [{"label": "Display", "value": "value"}]  // only for select or radio fields
    }
  ],
  "layout": {
    "columns": 1, 2, 3, or 4
  }
}

Rules:
- Every field key must be unique and in snake_case
- Select and radio fields MUST have at least one option
- Use 1 column for simple forms, 2 for medium, 3-4 for complex/wide forms
- Always include an email field for contact forms
- Return ONLY the JSON object — no other text
"""


class GenerationService:
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        self.client = anthropic.Anthropic(api_key=api_key) if api_key else None

    def generate(self, prompt: str) -> LLMFormOutput:
        if not self.client:
            return self._stub(prompt)

        message = self.client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = message.content[0].text.strip()
        data = json.loads(raw)
        return LLMFormOutput(**data)

    def _stub(self, prompt: str) -> LLMFormOutput:
        """Returns a deterministic stub when no API key is configured."""
        return LLMFormOutput(
            name="Contact Form",
            description="A simple contact form generated from prompt: " + prompt[:60],
            fields=[
                {"key": "full_name", "type": "text", "label": "Full Name", "placeholder": "Your name", "required": True},
                {"key": "email", "type": "email", "label": "Email Address", "placeholder": "you@example.com", "required": True},
                {"key": "message", "type": "textarea", "label": "Message", "placeholder": "Write your message here...", "required": True},
            ],
            layout={"columns": 1},
        )
