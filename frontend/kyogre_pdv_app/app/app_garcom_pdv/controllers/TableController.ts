import { createClient } from '@supabase/supabase-js'



export interface Table {
  id: number;
  name: string;
  status: 'livre' | 'ocupada' | 'finalizando';
  customers?: number;
}

class TableController {
  private static instance: TableController;
  private tables: Table[] = [];
  private supabase;

  private constructor() {
    //const supabaseUrl = process.env.SUPABASE_URL;
    //const supabaseKey = process.env.SUPABASE_KEY;

    const supabaseUrl = "https://szxghxqynfooieeiymfx.supabase.co"
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eGdoeHF5bmZvb2llZWl5bWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzExNDMsImV4cCI6MjA1Njk0NzE0M30.D5LvCtnWhAaGkzFCQPzTpirBYZB3hEkqk0cH1L-zTF8"
    
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables are not set');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.initializeRealtimeSubscription();
  }

  public static getInstance(): TableController {
    if (!TableController.instance) {
      TableController.instance = new TableController();
    }
    return TableController.instance;
  }

  private async initializeRealtimeSubscription() {
    // Subscribe to changes on the tables
    this.supabase
      .channel('tables-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tables'
        },
        (payload) => {
          console.log('[DEBUG] Realtime update received:', payload);
          this.loadTables(); // Reload tables when changes occur
        }
      )
      .subscribe();

      console.log("Web socket Supabase iniciado")
  }

  public async loadTables(): Promise<Table[]> {
    try {
      const { data, error } = await this.supabase
        .from('tables')
        .select('*')
        .order('id');

      if (error) throw error;

      this.tables = data;
      return this.tables;
    } catch (error) {
      console.error('[ERROR] Failed to load tables:', error);
      return [];
    }
  }

  public async updateTableStatus(tableId: number, status: Table['status'], customers?: number): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('tables')
        .update({ 
          status, 
          customers: customers || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', tableId);

      if (error) throw error;

      console.log(`[DEBUG] Status da mesa ${tableId} atualizado para ${status}`);
    } catch (error) {
      console.error('[ERROR] Failed to update table status:', error);
    }
  }

  public getTables(): Table[] {
    return this.tables;
  }
}

export default TableController;