from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Directory to save uploaded images
IMAGE_DIR = "assets"

# Ensure the image directory exists
os.makedirs(IMAGE_DIR, exist_ok=True)

class ImageHandler:
    @staticmethod
    async def upload_image(image: UploadFile = File(...)):
        try:
            if not isinstance(image.filename, str):
                raise HTTPException(status_code=400, detail="Invalid filename.")
            file_location = os.path.join(IMAGE_DIR, image.filename)
            with open(file_location, "wb") as file:
                file.write(await image.read())
            return {"info": f"Image '{image.filename}' uploaded successfully."}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def get_image(image_name: str):
        file_path = os.path.join(IMAGE_DIR, image_name)
        if os.path.exists(file_path):
            return FileResponse(file_path)
        else:
            raise HTTPException(status_code=404, detail="Image not found.")

# Create endpoints for image upload and retrieval
@app.post("/upload-image/")
async def upload_image(image: UploadFile = File(...)):
    return await ImageHandler.upload_image(image)

@app.get("/images/{image_name}")
async def get_image(image_name: str):
    return await ImageHandler.get_image(image_name)