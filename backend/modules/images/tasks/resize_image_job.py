import os
from pathlib import Path

from logger import get_logger
from PIL import Image
from modules.images.models import Image
from modules.images.service import ImageService


class ResizeImageJob:
    RESIZE_DIMENSIONS = [640, 1280, 1920, 6000]

    def __init__(self, image: Image, image_service: ImageService):
        self.image = image
        self.image_ext = Path(self.image.absolute_url).suffix
        self.image_service = image_service

    def __call__(self) -> None:
        logger = get_logger(__name__)

        image = Image.open(self.image.absolute_url)
        orientation = 'landscape' if image.width > image.height else 'portrait'

        # resize to
        file_dir = os.path.dirname(os.path.realpath(self.image.absolute_url))

        resized_images: list[[int, int, str]] = []

        # create a new folder that will contain all image variants
        new_dir_name = Path(file_dir).stem
        os.mkdir(new_dir_name)

        for resize_dimension in self.RESIZE_DIMENSIONS:
            width = resize_dimension if orientation == 'landscape' else (resize_dimension / image.height) * image.width
            height = resize_dimension if orientation == 'portrait' else (resize_dimension / image.width) * image.height

            resized_image = image.resize((width, height))
            new_file_name = os.path.join(new_dir_name, f'{width}x{height}{self.image_ext}')
            resized_image.save(new_file_name)

            logger.info(f'Saved new image with dimensions {width}x{height} to {new_file_name}.')
            resized_images.append((width, height, new_file_name))

        self.image_service.update_image_variants(resized_images)
