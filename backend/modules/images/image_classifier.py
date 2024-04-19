from PIL import Image
from transformers import pipeline, CLIPProcessor, CLIPModel

from logger import get_logger
from .categories import CATEGORIES

CHECKPOINT = "openai/clip-vit-large-patch14"
TASK_NAME = "zero-shot-image-classification"

logger = get_logger(__name__)


class ImageClassifier:
    def __init__(self):
        self.pipeline = pipeline(model=CHECKPOINT, task=TASK_NAME)
        self.processor = CLIPProcessor.from_pretrained(CHECKPOINT)
        self.model = CLIPModel.from_pretrained(CHECKPOINT)

    @staticmethod
    def __get_predictions(probs) -> list[dict]:
        predictions = [{'label': label, 'score': score} for label, score in
                       list(sorted(zip(CATEGORIES, probs.tolist()[0]), key=lambda x: -x[1]))[:5]]
        return predictions

    def process(self, image_full_path: str) -> list[dict[str, any]]:
        logger.info(f"Processing image '{image_full_path}' ...")

        try:
            image = Image.open(image_full_path)
            inputs = self.processor(text=CATEGORIES, images=image, return_tensors="pt", padding=True)

            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)  # we can take the softmax to get the label probabilities

            predictions = self.__get_predictions(probs)

            logger.info(f"Predictions for image with path '{image_full_path}': ")
            for prediction in predictions:
                logger.info(f"Prediction label: '{prediction['label']}', prediction score: {prediction['score']:.4f}")
            return predictions

        except Exception as e:
            logger.error(f'Error while processing image {image_full_path}: {e}', exc_info=e)
