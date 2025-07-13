from databases.models import User, UserParameters, Feedback
from databases.relational_db import SessionLocal
from sqlalchemy.future import select
from sqlalchemy import update, insert
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

    async def add_feedback(self, action_type: str, feedback_type: str):
        result = await self.db.execute(
            select(Feedback).where(
                Feedback.action_type == action_type,
                Feedback.feedback_type == feedback_type
            )
        )
        feedback = result.scalar_one_or_none()

        if feedback:
            stmt = (
                update(Feedback)
                .where(Feedback.id == feedback.id)
                .values(count=feedback.count + 1)
            )
            await self.db.execute(stmt)
        else:
            stmt = insert(Feedback).values(
                action_type=action_type,
                feedback_type=feedback_type,
                count=1
            )
            await self.db.execute(stmt)

        await self.db.commit()

    async def get_statistics(self):
        result = await self.db.execute(select(Feedback))
        rows = result.scalars().all()

        stats = {}
        for row in rows:
            if row.action_type not in stats:
                stats[row.action_type] = {"like": 0, "dislike": 0}
            stats[row.action_type][row.feedback_type] = row.count

        return stats
