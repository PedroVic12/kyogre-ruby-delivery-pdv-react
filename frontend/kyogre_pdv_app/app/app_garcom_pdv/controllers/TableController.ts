export interface Table {
  id: number;
  name: string;
  status: 'livre' | 'ocupada' | 'finalizando';
  customers?: number;
}

class TableController {
  private static instance: TableController;
  private tables: Table[] = [];

  private constructor() {
    this.loadTables();
  }

  public static getInstance(): TableController {
    if (!TableController.instance) {
      TableController.instance = new TableController();
    }
    return TableController.instance;
  }

  public loadTables(): Table[] {
    console.log('[DEBUG] Carregando mesas do localStorage...');
    const savedTables = localStorage.getItem('tables');
    if (savedTables) {
      this.tables = JSON.parse(savedTables) as Table[];
      console.log('[DEBUG] Mesas carregadas do localStorage:', this.tables);
    } else {
      console.log('[DEBUG] Nenhuma mesa encontrada no localStorage. Inicializando mesas padrão...');
      // Inicializa com mesas padrão
      this.tables = [
        { id: 1, name: 'Mesa 1', status: 'livre' },
        { id: 2, name: 'Mesa 2', status: 'livre' },
        { id: 3, name: 'Mesa 3', status: 'livre' },
        { id: 4, name: 'Mesa 4', status: 'livre' },
        { id: 5, name: 'Mesa 5', status: 'livre' },
        { id: 6, name: 'Mesa 6', status: 'livre' },
      ];
      this.saveTables();
      console.log('[DEBUG] Mesas padrão inicializadas e salvas no localStorage:', this.tables);
    }
    return this.tables;
  }

  public saveTables(): void {
    localStorage.setItem('tables', JSON.stringify(this.tables));
    console.log('[DEBUG] Mesas salvas no localStorage:', this.tables);
  }

  public getTables(): Table[] {
    return this.tables;
  }

  public updateTableStatus(tableId: number, status: Table['status'], customers?: number): void {
    const table = this.tables.find((t) => t.id === tableId);
    if (table) {
      table.status = status;
      table.customers = customers || 0;
      this.saveTables();
      console.log(`[DEBUG] Status da mesa ${tableId} atualizado para ${status}`);
    }
  }
}

export default TableController;