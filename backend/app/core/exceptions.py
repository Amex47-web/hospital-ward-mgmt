"""Custom exception classes and FastAPI exception handlers.

Every service-layer error is raised as one of these typed exceptions.
Handlers registered in main.py convert them into a consistent JSON shape:
  {"detail": "...", "error_code": "..."}
"""

from fastapi import Request
from fastapi.responses import JSONResponse


# ---------------------------------------------------------------------------
# Exception classes
# ---------------------------------------------------------------------------

class AppException(Exception):
    """Base exception for application-level errors."""

    def __init__(self, detail: str, error_code: str, status_code: int = 400):
        self.detail = detail
        self.error_code = error_code
        self.status_code = status_code


class NotFoundError(AppException):
    def __init__(self, detail: str = "Resource not found", error_code: str = "NOT_FOUND"):
        super().__init__(detail=detail, error_code=error_code, status_code=404)


class ForbiddenError(AppException):
    def __init__(self, detail: str = "Forbidden", error_code: str = "FORBIDDEN"):
        super().__init__(detail=detail, error_code=error_code, status_code=403)


class ConflictError(AppException):
    def __init__(self, detail: str = "Conflict", error_code: str = "CONFLICT"):
        super().__init__(detail=detail, error_code=error_code, status_code=409)


class BadRequestError(AppException):
    def __init__(self, detail: str = "Bad request", error_code: str = "BAD_REQUEST"):
        super().__init__(detail=detail, error_code=error_code, status_code=400)


class UnauthorizedError(AppException):
    def __init__(self, detail: str = "Unauthorized", error_code: str = "UNAUTHORIZED"):
        super().__init__(detail=detail, error_code=error_code, status_code=401)


# ---------------------------------------------------------------------------
# Exception handler (registered in main.py)
# ---------------------------------------------------------------------------

async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "error_code": exc.error_code},
    )
