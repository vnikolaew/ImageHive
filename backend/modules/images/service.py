import uuid
from contextlib import contextmanager
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from modules.db import SessionLocal
from modules.images.categories import CATEGORIES
from modules.images.models import Image
from modules.images.similarity_search import SimilaritySearch


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

    @staticmethod
    # @contextmanager
    def get_self():
        return ImageService()

    def __init__(self):
        super().__init__()
        self.similarity_search = SimilaritySearch()

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

    def update_image_tags(self, image: Image, tags: list[str]) -> Image:
        image.tags = tags
        self.session.commit()
        return image

    def get_all_with_tags(self, tag_or_tags: str | list[str]) -> list[Image]:
        tags = tag_or_tags if isinstance(tag_or_tags, list) else [tag_or_tags]
        return self.session.query(Image).filter(Image.tags.contains(tags)).all()

    def get_similar_tags(self, image: Image) -> list[dict[str, any]]:
        similar_tags: dict[str, float] = {}

        for tag in image.tags:
            s_tags = self.similarity_search.find_similar(tag, CATEGORIES)

            for s_tag in s_tags:
                label = s_tag['label']
                score = s_tag['score']

                if label not in similar_tags:
                    similar_tags[label] = score
                else:
                    similar_tags[label] = max(similar_tags[label], score)

        return [{'label': k, 'score': v} for k, v in
                sorted(similar_tags.items(), key=lambda x: x[1], reverse=True)[:10]]
