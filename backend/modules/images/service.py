import uuid
from datetime import datetime
from typing import Optional, Set

from sentence_transformers import SentenceTransformer
from sqlalchemy import text, values
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from modules.db import SessionLocal
from modules.images.categories import CATEGORIES
from modules.images.models import Image, Tag
from modules.images.similarity_search import SimilaritySearch

EMBEDDINGS_MODEL = 'sentence-transformers/multi-qa-MiniLM-L6-cos-v1'


class TextEmbedder:
    def __init__(self):
        self.model = SentenceTransformer(EMBEDDINGS_MODEL)

    def get_embedding(self, query: str) -> list[float]:
        return self.model.encode(query).tolist()


class ServiceBase(object):
    session: Session

    def __init__(self):
        pass

    def __enter__(self):
        self.session = SessionLocal()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.session.close()


class ImageService(ServiceBase):
    session: Session
    similarity_search: SimilaritySearch
    embedder: TextEmbedder

    @staticmethod
    # @contextmanager
    def get_self():
        return ImageService()

    def __init__(self):
        super().__init__()
        self.similarity_search = SimilaritySearch()
        self.embedder = TextEmbedder()

    def add_image(self, file_name: str, file_path: str, file_extension: str, width: int, height: int, timestamp: int,
                  tags: list[str]) -> Image:
        real_timestamp = datetime.fromtimestamp(timestamp / 1000)
        image = Image(
            file_name=file_name,
            file_path=file_path,
            file_extension=file_extension,
            width=width, height=height,
            timestamp=real_timestamp,
            tags=tags)

        self.session.add(image)
        self.session.commit()
        return image

    def get_all(self, offset: int = 0, limit: int = 10) -> list[Image]:
        total_count = self.session.query(Image).count()
        offset = min(total_count, offset)
        limit = min(100, limit)

        return self.session.query(Image).offset(offset).limit(limit).all()

    def get_by_id(self, image_id: uuid.UUID) -> Optional[Image]:
        return Image.get_by_id(image_id)

    def get_all_tags(self) -> set[str]:
        tags = self.session.execute(text("SELECT DISTINCT(unnest(tags)) FROM \"Image\";")).fetchall()
        return set([str(tag[0]) for tag in tags])

    def update_image_tags(self, image: Image, tags: list[str]) -> Image:
        image.tags = list(set(tags).union(set(image.tags)))
        if image not in self.session:
            self.session.add(image)

        self.session.commit()
        return image

    def update_image_variants(self, image: Image, variants: list[tuple[int, int, str]]) -> Image:
        if image not in self.session:
            self.session.add(image)

        for variant in variants:
            width, height, file_name = variant
            pass

        self.session.commit()
        return image

    def get_all_with_tags(self, tag_or_tags: str | list[str]) -> list[Image]:
        tags = tag_or_tags if isinstance(tag_or_tags, list) else [tag_or_tags]
        return self.session.query(Image).filter(Image.tags.contains(tags)).all()

    def get_similar_tags(self, tag: str) -> set[str]:
        sim_tags: set[str] = set()
        embedding = self.embedder.get_embedding(tag)
        rows = self.session.execute(text('SELECT name FROM "Tag" ORDER BY embedding <=> :e LIMIT 5'),
                                    params={'e': f'[{str.join(",", [str(x) for x in embedding])}]'}).fetchall()
        for row in rows:
            sim_tags.add(row[0])

        return sim_tags

    def update_image_embeddings(self, tags_embeddings: list[dict[str, any]]):
        for tags_embedding in tags_embeddings:
            self.session.execute(
                insert(Tag).values(name=tags_embedding['label'],
                                   embedding=tags_embedding['embedding'])
                .on_conflict_do_nothing()
            )
        self.session.commit()
