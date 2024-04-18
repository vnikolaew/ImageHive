import logging
import sys
import uuid
from http.client import HTTPException
from sqlalchemy.orm import Session
from . import schema, services
from images import db
from . import validator
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from fastapi import APIRouter, Depends, status, Response

router = APIRouter(tags=["Users"], prefix="/user")

scheduler = AsyncIOScheduler()
scheduler.start()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
stream_handler = logging.StreamHandler(sys.stdout)
log_formatter = logging.Formatter(
    "%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s")

stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user_registration(request: schema.User, database: Session = Depends(db.get_db)):
    user = await validator.verify_email_exists(request.email, database)

    if user:
        raise HTTPException(status_code=400, detail="")

    new_user = await services.new_user_register(request, database)
    return new_user


def sample_job(value: str):
    logger.info(f'Hi from {value}!')


@router.get("/", response_model=list[schema.DisplayUser])
async def get_all_users(database: Session = Depends(db.get_db)):
    scheduler.add_job(sample_job, args=['value'], id=str(uuid.uuid4()))
    return await services.all_users(database)


@router.get("/{user_id}", response_model=schema.DisplayUser)
async def get_all_users(user_id: int, database: Session = Depends(db.get_db)):
    return await services.get_user_by_id(user_id, database)


@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_user_by_id(user_id: int, database: Session = Depends(db.get_db)):
    return await services.delete_user_by_id(user_id, database)
