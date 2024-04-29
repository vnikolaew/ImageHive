from sentence_transformers import CrossEncoder

import torch

CROSS_ENCODER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"
ENCODER_MAX_SEQ_LEN = 256


class SimilaritySearch:
    cross_encoder: CrossEncoder

    def __init__(self):
        self.cross_encoder = CrossEncoder(CROSS_ENCODER_MODEL, device=self.get_device(), max_length=ENCODER_MAX_SEQ_LEN)

    @staticmethod
    def get_device():
        """
        Gets the correct device to be used by PyTorch.
        :return:
        """
        device = "cpu"
        if torch.cuda.is_available():
            device = "cuda"
        return device

    def find_similar(self, query: str, sentences: list[str]) -> list[dict[str, any]]:
        filtered_sentences = list(filter(lambda x: x != query, sentences))

        cross_encoder_inputs = [(query, c) for c in filtered_sentences]
        cross_scores = self.cross_encoder.predict(cross_encoder_inputs, show_progress_bar=False)

        float_cross_scores = [{'label': c, 'score': score} for c, score in
                              sorted(zip(filtered_sentences, [float(score) for score in cross_scores]),
                                     key=lambda x: -x[1])[:10]]
        return float_cross_scores
