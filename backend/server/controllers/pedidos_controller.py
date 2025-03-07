
# backend/app/controllers/order_controller.py
from fastapi import HTTPException
from ..models.models import OrderModel, OrderCreate, Order, OrderStatus

class OrderController:
    def __init__(self):
        self.order_model = OrderModel()
    
    async def create_order(self, order: OrderCreate):
        return await self.order_model.create_order(order)
    
    async def get_orders(self):
        return await self.order_model.get_orders()
    
    async def get_order(self, order_id: int):
        order = await self.order_model.get_order(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order
    
    async def update_order_status(self, order_id: int, status: OrderStatus):
        order = await self.order_model.get_order(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return await self.order_model.update_order_status(order_id, status)