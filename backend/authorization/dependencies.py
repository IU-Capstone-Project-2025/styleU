from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, Security
from jose import jwt, JWTError
from starlette.status import HTTP_401_UNAUTHORIZED
from typing import Optional
from config import SECRET_KEY

ALGORITHM = "HS256"

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

async def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme_optional)) -> Optional[str]:
    if token is None:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")
