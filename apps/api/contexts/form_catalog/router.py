from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from shared.database import get_db
from contexts.form_catalog.schemas import CatalogEntry
from contexts.form_catalog.service import FormCatalogService
from shared.renderable_form import RenderableForm

router = APIRouter(prefix="/catalog", tags=["Form Catalog"])


def get_service(db: Session = Depends(get_db)) -> FormCatalogService:
    return FormCatalogService(db)


@router.get("/forms", response_model=list[CatalogEntry])
def list_forms(service: FormCatalogService = Depends(get_service)):
    return service.list_catalog()


@router.get("/forms/{published_id}", response_model=RenderableForm)
def get_form(published_id: str, service: FormCatalogService = Depends(get_service)):
    form = service.get_renderable(published_id)
    if not form:
        raise HTTPException(status_code=404, detail="Published form not found")
    return form
