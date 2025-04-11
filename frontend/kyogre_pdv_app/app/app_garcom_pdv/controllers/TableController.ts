export interface Table {
  id: number;
  name: string;
  status: 'livre' | 'ocupada' | 'finalizando';
  customers?: number;
}

class TableController {
  private static instance: TableController;
  private subscribers: ((event: { type: string; payload: Table[] }) => void)[] = [];

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

  subscribe(callback: (event: { type: string; payload: Table[] }) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  updateTable(tableId: number, status: Table['status'], customers?: number): void {
    const tableController = TableController.getInstance();
    tableController.updateTableStatus(tableId, status, customers);

    const updatedTables = tableController.getTables();
    this.notifySubscribers({ type: 'update', payload: updatedTables });
  }

  resetAllTables(tables: Table[]): void {
    this.notifySubscribers({ type: 'reset', payload: tables });
  }

  private notifySubscribers(event: { type: string; payload: Table[] }): void {
    this.subscribers.forEach(callback => callback(event));
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

  public loadTables(): Table[] {
    const savedTables = localStorage.getItem('tables');
    if (savedTables) {
      this.tables = JSON.parse(savedTables) as Table[];
    } else {
      // Se não houver dados no localStorage, inicializa com as mesas padrão
      this.tables = [
        { id: 1, name: 'Mesa 1', status: 'livre' },
        { id: 2, name: 'Mesa 2', status: 'livre' },
        { id: 3, name: 'Mesa 3', status: 'livre' },
        { id: 4, name: 'Mesa 4', status: 'livre' },
        { id: 5, name: 'Mesa 5', status: 'livre' },
        { id: 6, name: 'Mesa 6', status: 'livre' },
      ];
      this.saveTables();
    }

    return this.tables;
  }
}


export default TableController;
