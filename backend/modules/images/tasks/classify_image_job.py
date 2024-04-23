from logger import get_logger
from modules.images.image_classifier import ImageClassifier
from modules.images.models import Image
from modules.images.service import ImageService


class ClassifyImageJob:
    def __init__(self, image: Image, image_service: ImageService):
        self.image = image
        self.image_service = image_service

    def __call__(self) -> None:
        logger = get_logger(__name__)
        classifier = ImageClassifier()
        predictions = classifier.process(self.image.absolute_url)

        # Update image tags in DB:
        tags = [p['label'] for p in predictions]
        image = self.image_service.update_image_tags(self.image, tags)
        logger.info(f"Classified Image with ID '{image.id}' with tags [{str.join(', ', tags)}]")
