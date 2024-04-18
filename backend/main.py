from fastapi import FastAPI
from images.user import router as user_router

app = FastAPI(title="Image Hive", description="This is private docs", version="1.0")

app.include_router(user_router.router)


@app.get("/")
async def root():
    return {"Hello": "World"}


@app.get("/hello/{name}")
async def root(name: int):
    return {"message": f"Hello {name}"}
