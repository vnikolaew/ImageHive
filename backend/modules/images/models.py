from pgvector.sqlalchemy import Vector
from sqlalchemy import Text, Column, Integer, TIMESTAMP, ARRAY, UUID, Boolean, String, text, func
from sqlalchemy.dialects.postgresql import JSONB

from modules.db import Base


class Image(Base):
    __tablename__ = 'Image'

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"), nullable=False)
    file_format = Column(Text, nullable=False)
    tags = Column(ARRAY(Text))
    image_metadata = Column("metadata", JSONB, nullable=False)
    userId = Column(Text, nullable=False)
    absolute_url = Column(Text, nullable=False)
    dimensions_set = Column(ARRAY(Text))
    original_file_name = Column(Text, nullable=False)
    title = Column(String(200))


class Tag(Base):
    __tablename__ = 'Tag'

    name = Column(Text(), unique=True, nullable=False)
    embedding = Column(Vector(384), nullable=False)
