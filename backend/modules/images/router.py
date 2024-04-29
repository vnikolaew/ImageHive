import uuid

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from modules.db import time_now
from modules.images.image_classifier import ImageClassifier
from modules.images.service import ImageService
from modules.images.tasks.classify_image_job import ClassifyImageJob

router = APIRouter(tags=["Images"], prefix="/images")

scheduler = BackgroundScheduler()
scheduler.start()


@router.post("/classify/{image_id}",
             status_code=status.HTTP_202_ACCEPTED,
             responses={status.HTTP_404_NOT_FOUND: {}, status.HTTP_202_ACCEPTED: {}})
async def classify_new_image(
        image_id: uuid.UUID,
        image_service: ImageService = Depends(ImageService.get_self)) -> JSONResponse:
    with image_service:
        image = image_service.get_by_id(image_id)
        if not image:
            raise HTTPException(status_code=404)

        # Tags classification
        scheduler.add_job(
            ClassifyImageJob(image, image_service),
            args=[],
            id=f'classify_image_job-{image_id}_{uuid.uuid4()}')

        # Image resizing
        # scheduler.add_job(
        #     ResizeImageJob(image, image_service),
        #     args=[],
        #     id=f'resize_image_job-{image_id}_{uuid.uuid4()}')

        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={"image_id": str(image_id), 'timestamp': str(time_now())})


class SimilarTagModel(BaseModel):
    tag: str
    score: float


class SimilarTagsResponse(BaseModel):
    similar_tags: list[SimilarTagModel]


@router.get("/tags/similar/{tag}",
            status_code=status.HTTP_200_OK,
            responses={status.HTTP_404_NOT_FOUND: {}, status.HTTP_200_OK: {}},
            response_model=SimilarTagsResponse)
async def get_similar_tags(
        tag: str,
        image_service: ImageService = Depends(ImageService.get_self),
        image_classifier: ImageClassifier = Depends(ImageClassifier.get_self),
) -> SimilarTagsResponse:
    with image_service:
        tags = image_service.get_all_tags()
        if not tags:
            raise HTTPException(status_code=404)

        similar_tags = image_classifier.get_similar_tags(tag, list(tags))
        return SimilarTagsResponse(similar_tags=[SimilarTagModel(tag=x['tag'], score=x['score']) for x in similar_tags])
