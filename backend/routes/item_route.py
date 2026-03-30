from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.services.item_service import ItemService
from backend.schemas.item_schema import ItemAddRequest, ItemUpdateRequest, ItemResponse, ItemListResponse
from backend.common.db import get_db
from backend.common.response import success_response
from backend.common.exceptions import handle_exceptions

router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=dict)
@handle_exceptions
def get_items(
    kakao_user_id: str = Query(..., description="카카오 사용자 ID"),
    db: Session = Depends(get_db)
):
    item_service = ItemService(db)
    result = item_service.get_items(kakao_user_id)
    return success_response(data=result.dict())


@router.post("", response_model=dict)
@handle_exceptions
def add_item(
    request: ItemAddRequest,
    db: Session = Depends(get_db)
):
    item_service = ItemService(db)
    result = item_service.add_item(
        kakao_user_id=request.kakao_user_id,
        name=request.name,
        label_id=request.label_id
    )
    return success_response(data=result.dict())


@router.patch("/{item_id}", response_model=dict)
@handle_exceptions
def update_item(
    item_id: int,
    request: ItemUpdateRequest,
    db: Session = Depends(get_db)
):
    item_service = ItemService(db)
    result = item_service.update_item(
        item_id=item_id,
        kakao_user_id=request.kakao_user_id,
        name=request.name,
        label_id=request.label_id
    )
    return success_response(data=result.dict())


@router.delete("/{item_id}", response_model=dict)
@handle_exceptions
def delete_item(
    item_id: int,
    kakao_user_id: str = Query(..., description="카카오 사용자 ID"),
    db: Session = Depends(get_db)
):
    item_service = ItemService(db)
    result = item_service.delete_item(item_id, kakao_user_id)
    return success_response(data={"deleted": result})