import numpy as np
from PIL import Image
from sentence_transformers import SentenceTransformer
from transformers import pipeline, CLIPProcessor, CLIPModel
from FlagEmbedding import BGEM3FlagModel

from logger import get_logger
from .categories import CATEGORIES

CHECKPOINT = "openai/clip-vit-large-patch14"
TASK_NAME = "zero-shot-image-classification"

IMAGE_CAPTIONING_MODEL = "nlpconnect/vit-gpt2-image-captioning"
SENTENCE_SIMILARITY_MODEL = 'BAAI/bge-m3'

EMBEDDINGS_MODEL = 'sentence-transformers/multi-qa-MiniLM-L6-cos-v1'

logger = get_logger(__name__)


class ImageClassifier:
    def __init__(self):
        self.processor = CLIPProcessor.from_pretrained(CHECKPOINT)
        self.model = CLIPModel.from_pretrained(CHECKPOINT)

        self.image_caption_pipeline = pipeline("image-to-text", model=IMAGE_CAPTIONING_MODEL)
        self.ss_model = BGEM3FlagModel(SENTENCE_SIMILARITY_MODEL, use_fp16=True)

        self.embeddings_model = SentenceTransformer(EMBEDDINGS_MODEL)

    @staticmethod
    # @contextmanager
    def get_self():
        return ImageClassifier()

    def __get_predictions(self, probs: list[float], probs_tags: list[float], initial_tags: list[str]) -> list[dict]:
        predictions = [{'label': label, 'score': score} for label, score in
                       list(sorted(zip(CATEGORIES, probs), key=lambda x: -x[1]))[:5]]

        embeddings = self.embeddings_model.encode([x['label'] for x in predictions])

        predictions_two = [{'label': label, 'score': score} for label, score in
                           list(sorted(zip(initial_tags, probs_tags), key=lambda x: -x[1]))[:5]]

        embeddings_two = self.embeddings_model.encode([x['label'] for x in predictions_two])

        return [{'label': pred['label'], 'score': pred['score'], 'embedding': e.tolist()} for pred, e in
                zip(predictions + predictions_two, np.concatenate((embeddings, embeddings_two), axis=0))]

    def process(self, image_full_path: str, initial_tags: list[str]) -> list[dict[str, any]]:
        logger.info(f"Processing image '{image_full_path}' ...")

        try:
            image = Image.open(image_full_path)
            inputs = self.processor(text=CATEGORIES, images=image, return_tensors="pt", padding=True)

            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)  # we can take the softmax to get the label probabilities

            initial_tags_inputs = self.processor(text=initial_tags, images=image, return_tensors="pt", padding=True)

            outputs = self.model(**initial_tags_inputs)
            logits_per_image_tags = outputs.logits_per_image
            probs_tags = logits_per_image_tags.softmax(dim=1)  # we can take the softmax to get the label probabilities

            predictions = self.__get_predictions(probs.tolist()[0], probs_tags.tolist()[0], initial_tags)

            logger.info(f"Predictions for image with path '{image_full_path}': ")

            for prediction in predictions:
                logger.info(f"Prediction label: '{prediction['label']}', prediction score: {prediction['score']:.4f}")
            return predictions

        except Exception as e:
            logger.error(f'Error while processing image {image_full_path}: {e}', exc_info=e)

    def generate_image_captions(self, image_full_path: str) -> list[dict[str, any]]:
        logger.info(f"Processing image '{image_full_path}' ...")

        try:
            image = Image.open(image_full_path)
            image_to_text = self.image_caption_pipeline(image)

            return image_to_text
        except Exception as e:
            logger.error(f'Error while processing image {image_full_path}: {e}', exc_info=e)

    def classify_with_ss(self, image_caption: str) -> list[dict[str, any]]:
        try:
            sentences = [image_caption]
            sentences2 = CATEGORIES
            sentence_pairs: list[tuple[str, str]] = [(a, b) for a in sentences for b in sentences2]
            scores = self.ss_model.compute_score(
                sentence_pairs,
                max_passage_length=128,
                weights_for_different_modes=[0.4, 0.2, 0.4])

            return [{'score': score, 'category': category} for score, category in
                    list(sorted(zip(scores['sparse+dense'], CATEGORIES), key=lambda x: -x[0])[:10])]
        except Exception as e:
            logger.error(f'Error while processing image: {e}', exc_info=e)

    def get_similar_tags(self, tag: str, all_tags: list[str]) -> list[dict[str, any]]:
        try:
            sentences = [tag]
            sentences2 = all_tags

            sentence_pairs: list[tuple[str, str]] = [(a, b) for a in sentences for b in sentences2]

            scores = self.ss_model.compute_score(
                sentence_pairs,
                max_passage_length=128,
                weights_for_different_modes=[0.4, 0.2, 0.4])

            return [{'score': score, 'tag': tag} for score, tag in
                    list(sorted(zip(scores['sparse+dense'], all_tags), key=lambda x: -x[0])[:10])]
        except Exception as e:
            logger.error(f'Error while processing image: {e}', exc_info=e)
