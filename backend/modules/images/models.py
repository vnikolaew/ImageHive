from sqlalchemy import Text, Column, Integer, TIMESTAMP, ARRAY

from modules.db import Base


class Image(Base):
    __tablename__ = 'Image'

    file_name = Column('file_name', Text, nullable=False)
    file_path = Column('file_path', Text, nullable=False)
    file_extension = Column('file_extension', Text, nullable=False)
    width = Column('width', Integer, nullable=False)
    height = Column('height', Integer, nullable=False)
    tags = Column('tags', ARRAY(Text))
