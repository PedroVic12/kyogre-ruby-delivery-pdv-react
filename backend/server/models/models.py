
# backend/app/models/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from .database import Database

class UserBase(BaseModel):
    email: EmailStr
    
class UserCreate(UserBase):
    password: str
    
class User(UserBase):
    id: int
    last_login: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class UserModel:
    def __init__(self):
        self.db = Database().get_client()
        self.table = "users"
    
    async def create_user(self, user: UserCreate):
        # Hash password in real implementation
        data = {
            "email": user.email,
            "password": user.password,  # Should be hashed in real implementation
            "last_login": datetime.now().isoformat()
        }
        result = self.db.table(self.table).insert(data).execute()
        return result.data
    
    async def get_user_by_email(self, email: str):
        result = self.db.table(self.table).select("*").eq("email", email).execute()
        if result.data:
            return result.data[0]
        return None
    
    async def update_last_login(self, user_id: int):
        data = {"last_login": datetime.now().isoformat()}
        self.db.table(self.table).update(data).eq("id", user_id).execute()


# backend/app/models/product.py
from pydantic import BaseModel
from typing import Optional
from .database import Database

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    
    class Config:
        orm_mode = True

class ProductModel:
    def __init__(self):
        self.db = Database().get_client()
        self.table = "produtos"
    
    async def create_product(self, product: ProductCreate):
        data = {
            "nome": product.name,
            "descricao": product.description,
            "preco": product.price,
            "imagem_url": product.image_url
        }
        result = self.db.table(self.table).insert(data).execute()
        return result.data
    
    async def get_products(self):
        result = self.db.table(self.table).select("*").execute()
        return result.data
    
    async def get_product(self, product_id: int):
        result = self.db.table(self.table).select("*").eq("id", product_id).execute()
        if result.data:
            return result.data[0]
        return None
    
    async def update_product(self, product_id: int, product: ProductCreate):
        data = {
            "nome": product.name,
            "descricao": product.description,
            "preco": product.price,
            "imagem_url": product.image_url
        }
        result = self.db.table(self.table).update(data).eq("id", product_id).execute()
        return result.data
    
    async def delete_product(self, product_id: int):
        result = self.db.table(self.table).delete().eq("id", product_id).execute()
        return result.data


# backend/app/models/order.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum
from .database import Database

class OrderStatus(str, Enum):
    PENDENTE = "pendente"
    COZINHA = "cozinha"
    ENTREGA = "entrega"
    FINALIZADO = "finalizado"

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    notes: Optional[str] = None

class OrderBase(BaseModel):
    client_name: str
    table_number: Optional[int] = None
    items: List[OrderItemBase]
    
class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    status: OrderStatus = OrderStatus.PENDENTE
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class OrderModel:
    def __init__(self):
        self.db = Database().get_client()
        self.table = "pedidos"
    
    async def create_order(self, order: OrderCreate):
        data = {
            "cliente": order.client_name,
            "mesa": order.table_number,
            "produtos": [{"id": item.product_id, "quantidade": item.quantity, "notas": item.notes} for item in order.items],
            "status": OrderStatus.PENDENTE.value,
            "timestamp": datetime.now().isoformat()
        }
        result = self.db.table(self.table).insert(data).execute()
        return result.data
    
    async def get_orders(self):
        result = self.db.table(self.table).select("*").order("timestamp", desc=True).execute()
        return result.data
    
    async def get_order(self, order_id: int):
        result = self.db.table(self.table).select("*").eq("id", order_id).execute()
        if result.data:
            return result.data[0]
        return None
    
    async def update_order_status(self, order_id: int, status: OrderStatus):
        data = {
            "status": status.value,
            "timestamp": datetime.now().isoformat()
        }
        result = self.db.table(self.table).update(data).eq("id", order_id).execute()
        return result.data