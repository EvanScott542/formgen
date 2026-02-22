from pydantic import BaseModel


class FieldValidationError(BaseModel):
    field: str
    message: str


class DraftValidationError(Exception):
    def __init__(self, errors: list[FieldValidationError]):
        self.errors = errors
        super().__init__(f"Draft validation failed: {[e.model_dump() for e in errors]}")


class GenerationOutputError(Exception):
    """Raised when the LLM returns output that cannot be parsed into LLMFormOutput."""
    def __init__(self, message: str):
        self.errors = [FieldValidationError(field="llm_output", message=message)]
        super().__init__(message)
