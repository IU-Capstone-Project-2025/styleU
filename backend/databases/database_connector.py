from databases.models import User, UserParameters, Feedback
from databases.relational_db import SessionLocal
from sqlalchemy.future import select
from sqlalchemy import update, insert
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson.binary import Binary
from authorization.auth_utils import get_password_hash
from config import MONGO_URL, MONGO_DB


class DatabaseConnector:
    def __init__(self):
        self.session = SessionLocal()
        self.mongo_client = AsyncIOMotorClient(MONGO_URL)
        self.mongo_db = self.mongo_client[MONGO_DB]

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
        result = await self.db.execute(
            select(UserParameters)
            .where(UserParameters.user_id == user_id)
            .order_by(UserParameters.id.desc())
            .limit(1)
        )
        existing = result.scalar_one_or_none()

        if existing:
            for key, value in kwargs.items():
                setattr(existing, key, value)
        else:
            self.db.add(UserParameters(user_id=user_id, **kwargs))

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

    async def get_user_features(self, username: str) -> dict:
        user = await self.get_user_by_username(username)
        if not user:
            raise ValueError("User not found")

        result = await self.db.execute(
            select(UserParameters).where(UserParameters.user_id == user.id)
        )
        params_list = result.scalars().all()

        if not params_list:
            raise ValueError("User parameters not found")

        params = params_list[-1]

        return {
            "sex": params.sex,
            "height": params.height,
            "body_type": params.body_type,
            "body_type_recommendation": params.body_type_recommendation,
            "color_type": params.color_type,
            "color_type_recommendation": params.color_type_recommendation,
        }

    async def save_user_photo(self, username: str, file_path: str):
        with open(file_path, "rb") as f:
            photo_data = Binary(f.read())
            await self.mongo_db.user_photos.replace_one(
                {"username": username},
                {"username": username, "photo": photo_data},
                upsert=True,
            )

    async def get_user_photo(self, username: str) -> bytes:
        doc = await self.mongo_db.user_photos.find_one({"username": username})
        if not doc or "photo" not in doc:
            raise ValueError("User photo not found")
        return doc["photo"]

    async def save_avatar(self, username: str, image_bytes: bytes):
        await self.mongo_db.avatars.update_one(
            {"username": username},
            {"$set": {"image": image_bytes}},
            upsert=True,
        )

    async def get_saved_avatar(self, username: str) -> Optional[bytes]:
        doc = await self.mongo_db.avatars.find_one({"username": username})
        if doc and "image" in doc:
            return doc["image"]
        return None

    async def delete_avatar(self, username: str):
        await self.mongo_db.avatars.delete_one({"username": username})
