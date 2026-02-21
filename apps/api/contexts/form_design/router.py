from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from shared.database import get_db
from shared.errors import DraftValidationError
from contexts.form_design.schemas import (
    FormDraft, GenerationRequest, DraftUpdateRequest, DraftSummary,
)
from contexts.form_design.service import FormDesignService

router = APIRouter(prefix="/design", tags=["Form Design"])


def get_service(db: Session = Depends(get_db)) -> FormDesignService:
    return FormDesignService(db)


@router.post("/generate", response_model=FormDraft)
def generate_form(request: GenerationRequest, service: FormDesignService = Depends(get_service)):
    try:
        return service.generate(request)
    except DraftValidationError as e:
        raise HTTPException(status_code=422, detail=[err.model_dump() for err in e.errors])


@router.get("/drafts", response_model=list[DraftSummary])
def list_drafts(service: FormDesignService = Depends(get_service)):
    return service.list_drafts()


@router.get("/drafts/{draft_id}", response_model=FormDraft)
def get_draft(draft_id: str, service: FormDesignService = Depends(get_service)):
    draft = service.get_draft(draft_id)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    return draft


@router.patch("/drafts/{draft_id}", response_model=FormDraft)
def update_draft(
    draft_id: str,
    update: DraftUpdateRequest,
    service: FormDesignService = Depends(get_service),
):
    try:
        draft = service.update_draft(draft_id, update)
    except DraftValidationError as e:
        raise HTTPException(status_code=422, detail=[err.model_dump() for err in e.errors])
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    return draft


@router.delete("/drafts/{draft_id}", status_code=204)
def delete_draft(draft_id: str, service: FormDesignService = Depends(get_service)):
    if not service.delete_draft(draft_id):
        raise HTTPException(status_code=404, detail="Draft not found")
