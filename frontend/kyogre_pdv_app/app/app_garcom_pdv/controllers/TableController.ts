export interface Table {
  id: number;
  name: string;
  status: 'livre' | 'ocupada' | 'finalizando';
  customers?: number;
}

class TableController {
  private static instance: TableController;
  private tables: Table[] = [
    { id: 1, name: 'Mesa 1', status: 'livre' },
    { id: 2, name: 'Mesa 2', status: 'livre' },
    { id: 3, name: 'Mesa 3', status: 'livre' },
    { id: 4, name: 'Mesa 4', status: 'livre' },
    { id: 5, name: 'Mesa 5', status: 'livre' },
    { id: 6, name: 'Mesa 6', status: 'livre' },
  ];

  private constructor() {
    this.loadTables();
  }

  static getInstance(): TableController {
    if (!TableController.instance) {
      TableController.instance = new TableController();
    }
    return TableController.instance;
  }

  getTables(): Table[] {
    return this.tables;
  }

  updateTableStatus(tableId: number, status: Table['status'], customers?: number): void {
    this.tables = this.tables.map(table =>
      table.id === tableId
        ? { ...table, status, customers: customers || table.customers }
        : table
    );
    this.saveTables();
  }

  private saveTables(): void {
    localStorage.setItem('tables', JSON.stringify(this.tables));
  }

  private loadTables(): void {
    const savedTables = localStorage.getItem('tables');
    if (savedTables) {
      this.tables = JSON.parse(savedTables);
    }
  }
}

export default TableController;