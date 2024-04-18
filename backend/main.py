from dotenv import load_dotenv
from fastapi import FastAPI
from modules.images import router as images_router

load_dotenv()

app = FastAPI(title="Image Hive", description="This is private docs", version="1.0")

# app.include_router(user_router.router)
app.include_router(images_router.router)


@app.get("/")
async def root():
    return {"Hello": "World"}


@app.get("/hello/{name}")
async def root(name: int):
    return {"message": f"Hello {name}"}
