import uuid as uuid
from datetime import datetime

from pytz import timezone

from . import config
from sqlalchemy import create_engine, inspect, Column, Boolean
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session

DATABASE_USERNAME = config.DATABASE_USERNAME
DATABASE_PASSWORD = config.DATABASE_PASSWORD
DATABASE_HOST = config.DATABASE_HOST
DATABASE_NAME = config.DATABASE_NAME

SQLALCHEMY_DATABASE_URL = f"postgresql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}/{DATABASE_NAME}"

UTC = timezone('UTC')


def time_now():
    return datetime.now(UTC)


class Base(DeclarativeBase):
    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    created_at = Column(TIMESTAMP(timezone=True), default=time_now, nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), default=None, onupdate=time_now, nullable=False)
    is_deleted = Column(Boolean, default=False)

    @property
    def _asdict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}

    @classmethod
    def get_by_id(cls, id: uuid.UUID):
        db = SessionLocal()
        try:
            return db.query(cls).filter(cls.id == id, cls.is_deleted.is_(False)).first()
        finally:
            db.close()


engine = create_engine(SQLALCHEMY_DATABASE_URL)
Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
