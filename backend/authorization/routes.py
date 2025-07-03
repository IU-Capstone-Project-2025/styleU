from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from authorization.auth_utils import verify_password, create_access_token
from authorization.schemas import UserCreate
from databases.database_connector import DatabaseConnector

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register(user_in: UserCreate):
    try:
        async with DatabaseConnector() as connector:
            user = await connector.register_user(user_in.username, user_in.password)
            return {"access_token": create_access_token({"sub": user.username})}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    async with DatabaseConnector() as connector:
        user = await connector.get_user_by_username(form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        return {"access_token": create_access_token({"sub": user.username})}
