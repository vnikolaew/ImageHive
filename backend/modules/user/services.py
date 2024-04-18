from http.client import HTTPException

from .models import User


async def new_user_register(request, database) -> User:
    new_user = User(name=request.name, email=request.email, password=request.password)
    database.add(new_user)
    database.commit()
    database.refresh(new_user)
    return new_user


async def all_users(database):
    users = database.query(User).all()
    return users


async def get_user_by_id(user_id, database):
    user_info = database.query(User).get(user_id)
    if not user_info:
        raise HTTPException(status_code=404, detail="User not found")
    return user_info


async def delete_user_by_id(user_id: int, database):
    database.query(User).filter(User.id == user_id).delete()
    database.commit()