import uuid

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import JSONResponse

from modules.db import time_now
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

        scheduler.add_job(
            ClassifyImageJob(image, image_service),
            args=[],
            id=f'classify_image_job-{image_id}_{uuid.uuid4()}')
        return JSONResponse(status_code=status.HTTP_202_ACCEPTED,
                            content={"image_id": str(image_id), 'timestamp': str(time_now())})
