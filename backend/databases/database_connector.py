from databases.models import User, UserParameters
from databases.relational_db import SessionLocal
from sqlalchemy.future import select
from authorization.auth_utils import get_password_hash


class DatabaseConnector:
    def __init__(self):
        self.session = SessionLocal()

    async def __aenter__(self):
        self.db = await self.session.__aenter__()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.session.__aexit__(exc_type, exc_val, exc_tb)

    async def get_user_by_username(self, username: str) -> User | None:
        result = await self.db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    async def get_user_id(self, username: str) -> int:
        user = await self.get_user_by_username(username)
        if not user:
            raise ValueError("User not found")
        return user.id

    async def register_user(self, username: str, password: str) -> User:
        if await self.get_user_by_username(username):
            raise ValueError("Username already registered")
        user = User(username=username, hashed_password=get_password_hash(password))
        self.db.add(user)
        await self.db.commit()
        return user

    async def add_user_parameters(self, user_id: int, **kwargs):
        self.db.add(UserParameters(user_id=user_id, **kwargs))
        await self.db.commit()

    async def set_color_type(self, user_id: int, color_type: str):
        self.db.add(UserParameters(user_id=user_id, color_type=color_type))
        await self.db.commit()
