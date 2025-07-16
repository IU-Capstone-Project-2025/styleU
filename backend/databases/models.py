from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .relational_db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    parameters = relationship("UserParameters", back_populates="owner")


class UserParameters(Base):
    __tablename__ = "user_parameters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    height = Column(Float, nullable=True)
    bust = Column(Float, nullable=True)
    waist = Column(Float, nullable=True)
    hips = Column(Float, nullable=True)
    body_type = Column(String, nullable=True)
    color_type = Column(String, nullable=True)

    owner = relationship("User", back_populates="parameters")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    action_type = Column(String, index=True)
    feedback_type = Column(String, index=True)
    count = Column(Integer, default=1)
