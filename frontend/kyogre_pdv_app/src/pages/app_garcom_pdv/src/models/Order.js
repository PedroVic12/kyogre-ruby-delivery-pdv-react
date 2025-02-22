export class Order {
  constructor() {
    this.id = Date.now();
    this.items = [];
    this.tableNumber = null;
    this.status = 'pending';
    this.total = 0;
    this.createdAt = new Date();
  }

  addItem(item) {
    this.items.push(item);
    this.calculateTotal();
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  setTableNumber(number) {
    this.tableNumber = number;
  }

  setStatus(status) {
    this.status = status;
  }
}