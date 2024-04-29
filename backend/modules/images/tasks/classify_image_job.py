from logger import get_logger
from modules.images.image_classifier import ImageClassifier
from modules.images.models import Image
from modules.images.service import ImageService


class ClassifyImageJob:
    def __init__(self, image: Image, image_service: ImageService):
        self.image = image
        self.image_service = image_service
        self.classifier = ImageClassifier()

    def __call__(self) -> None:
        logger = get_logger(__name__)

        predictions = self.classifier.process(self.image.absolute_url)
        image_captions = self.classifier.generate_image_captions(self.image.absolute_url)
        scores = self.classifier.classify_with_ss(
            'Which category suits the following caption: {}'.format(image_captions[0]['generated_text'])
        )

        # Update image tags in DB:
        tags = [p['label'] for p in predictions]
        image = self.image_service.update_image_tags(self.image, tags)

        tags_embeddings = [{'embedding': p['embedding'], 'label': p['label']} for p in predictions]
        self.image_service.update_image_embeddings(tags_embeddings)

        image = self.image_service.update_image_tags(self.image, tags)

        logger.info(f"Classified Image with ID '{image.id}' with tags [{str.join(', ', tags)}]")
