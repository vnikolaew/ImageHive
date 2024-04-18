import uuid

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse

from logger import get_logger
from modules.db import time_now
from modules.images.image_classifier import ImageClassifier
from modules.images.models import Image
from modules.images.service import ImageService

router = APIRouter(tags=["Images"], prefix="/images")

scheduler = AsyncIOScheduler()
scheduler.start()


async def classify_image_job(image: Image, image_service: ImageService) -> None:
    logger = get_logger(__name__)
    classifier = ImageClassifier()
    predictions = await classifier.process(image.file_path)

    # Update image tags in DB:
    tags = [p['label'] for p in predictions]
    image = image_service.update_image_tags(image, tags)
    logger.info(f"Classified Image with ID '{image.id}' with tags [{str.join(',', tags)}]")


@router.post("/classify/{image_id}", status_code=status.HTTP_202_ACCEPTED,
             responses={status.HTTP_404_NOT_FOUND: {}, status.HTTP_202_ACCEPTED: {}})
async def classify_new_image(
        image_id: uuid.UUID,
        image_service: ImageService = Depends(ImageService.get_self)):
    with image_service:
        image = image_service.get_by_id(image_id)
        if not image:
            raise HTTPException(status_code=404)

        scheduler.add_job(classify_image_job, args=[image, image_service],
                          id=f'classify_image_job-{image_id}_{uuid.uuid4()}')
        return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content={"image_id": image_id, 'timestamp': time_now()})
