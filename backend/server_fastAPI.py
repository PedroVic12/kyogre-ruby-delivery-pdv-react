from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model definition
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Integer)
    image_path = Column(String)

Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# CRUD operations
@app.post("/products/")
async def create_product(name: str, price: int, file: UploadFile = File(...)):
    db = SessionLocal()
    image_path = f"static/{file.filename}"
    
    # Save image
    with open(image_path, "wb") as buffer:
        buffer.write(await file.read())
    
    product = Product(name=name, price=price, image_path=image_path)
    db.add(product)
    db.commit()
    db.refresh(product)
    db.close()
    return product

@app.get("/products/", response_model=list[Product])
def read_products():

    array_db =  [
        Product(id=1, name="Product 1", price=10.0, image_path="https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg"),
        Product(id=2, name="Product 2", price=15.0, image_path="https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg"),
        Product(


            id= 3,
             name="Product 2", price=15.0, image_path="https://www.iugu.com/hubfs/Imported_Blog_Media/Ruby-conhe%C3%A7a-essa-linguagem-de-programa%C3%A7%C3%A3o-1.jpg"
        )
    ]
    db = SessionLocal()
    products = db.query(Product).all()
    db.close()
    return products

@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
    <html>
        <body>
            <h1>Upload a Product</h1>
            <form action="/products/" method="post" enctype="multipart/form-data">
                <input name="name" type="text" placeholder="Product Name" required>
                <input name="price" type="number" placeholder="Product Price" required>
                <input name="file" type="file" required>
                <button type="submit">Submit</button>
            </form>
        </body>
    </html>
    """


# Run the app with: uvicorn server_fastAPI:app --reload
def main_fastAPI():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

main_fastAPI()