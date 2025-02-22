export class OrderController {
  constructor() {
    this.orders = [];
  }

  createOrder() {
    const order = new Order();
    this.orders.push(order);
    return order;
  }

  getOrders() {
    return this.orders;
  }

  getOrderById(id) {
    return this.orders.find(order => order.id === id);
  }

  updateOrder(id, updates) {
    const order = this.getOrderById(id);
    if (order) {
      Object.assign(order, updates);
      return true;
    }
    return false;
  }

  deleteOrder(id) {
    const index = this.orders.findIndex(order => order.id === id);
    if (index !== -1) {
      this.orders.splice(index, 1);
      return true;
    }
    return false;
  }
}