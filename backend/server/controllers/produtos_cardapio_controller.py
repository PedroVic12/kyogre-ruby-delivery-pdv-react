
# backend/app/controllers/product_controller.py
from fastapi import HTTPException
from models.models import ProductModel, ProductCreate, Product, ProductBase



class ProductController:
    def __init__(self):
        self.product_model = ProductModel()
    
    async def create_product(self, product: ProductCreate):
        return await self.product_model.create_product(product)
    
    async def get_products(self):
        return await self.product_model.get_products()
    
    async def get_product(self, product_id: int):
        product = await self.product_model.get_product(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    
    async def update_product(self, product_id: int, product: ProductCreate):
        existing_product = await self.product_model.get_product(product_id)
        if not existing_product:
            raise HTTPException(status_code=404, detail="Product not found")
        return await self.product_model.update_product(product_id, product)
    
    async def delete_product(self, product_id: int):
        existing_product = await self.product_model.get_product(product_id)
        if not existing_product:
            raise HTTPException(status_code=404, detail="Product not found")
        return await self.product_model.delete_product(product_id)
