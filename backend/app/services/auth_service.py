"""Authentication service — signup, login, and current-user retrieval."""

from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestError, UnauthorizedError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


def signup(db: Session, data: UserCreate) -> User:
    """Register a new user. Raises on duplicate email."""
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise BadRequestError(
            detail="A user with this email already exists",
            error_code="DUPLICATE_EMAIL",
        )

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login(db: Session, email: str, password: str) -> str:
    """Authenticate and return a signed JWT. Raises on bad credentials."""
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise UnauthorizedError(
            detail="Invalid email or password",
            error_code="INVALID_CREDENTIALS",
        )
    return create_access_token(subject=str(user.id))
