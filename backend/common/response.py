from typing import Any, Optional, Dict
from pydantic import BaseModel


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


def success_response(message: str = "Success", data: Any = None) -> Dict[str, Any]:
    return {
        "success": True,
        "message": message,
        "data": data
    }


def error_response(message: str = "Error", data: Any = None) -> Dict[str, Any]:
    return {
        "success": False,
        "message": message,
        "data": data
    }