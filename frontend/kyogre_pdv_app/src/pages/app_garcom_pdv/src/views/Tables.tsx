import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonFooter,
  IonIcon,
  IonSearchbar,
  IonMenu,
  IonButtons,
  IonMenuButton,
  IonMenuToggle,
} from '@ionic/react';
import { car, add, remove, menuOutline, receiptOutline, gridOutline } from 'ionicons/icons';
import { DATABASE } from '../data/database';

const Tables: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any[]>([]);
  const [tables, setTables] = useState(DATABASE.tables);

  const handleTableClick = (tableId: number) => {
    setSelectedTable(tableId);
    setShowMenu(true);
  };

  const updateItemQuantity = (item: any, increment: boolean) => {
    setCurrentOrder(currentOrder => {
      const existingItem = currentOrder.find(i => i.id === item.id);
      if (existingItem) {
        if (increment) {
          return currentOrder.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else if (existingItem.quantity > 0) {
          return currentOrder.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0);
        }
        return currentOrder;
      }
      return [...currentOrder, { ...item, quantity: 1 }];
    });
  };

  const calculateTotal = () => {
    return currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleGenerateOrder = () => {
    if (selectedTable) {
      setTables(tables.map(table => 
        table.id === selectedTable ? { ...table, status: 'occupied' } : table
      ));
      setShowMenu(false);
      setCurrentOrder([]);
    }
  };

  const getTableColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-orange-600';
      case 'closing':
        return 'bg-yellow-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <>
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar color="dark">
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent color="dark">
          <IonList>
            <IonMenuToggle autoHide={false}>
              <IonItem color="dark" button routerLink="/tables">
                <IonIcon slot="start" icon={gridOutline} />
                <IonLabel>Mapa de Mesas</IonLabel>
              </IonItem>
              <IonItem color="dark" button routerLink="/orders">
                <IonIcon slot="start" icon={receiptOutline} />
                <IonLabel>Pedidos</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content" className="dark">
        <IonHeader>
          <IonToolbar color="dark">
            <IonButtons slot="start">
              <IonMenuButton>
                <IonIcon icon={menuOutline} />
              </IonMenuButton>
            </IonButtons>
            <IonTitle>Mapa de mesas</IonTitle>
            <IonSearchbar slot="end" style={{ maxWidth: '120px' }} />
          </IonToolbar>
          <IonToolbar color="dark">
            <div className="flex gap-2 p-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-white">Livres</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-white">Ocupadas</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-white">Fechando conta</span>
              </div>
            </div>
          </IonToolbar>
        </IonHeader>
        
        <IonContent className="ion-padding" color="dark">
          <IonGrid>
            <IonRow>
              {tables.map((table) => (
                <IonCol size="4" key={table.id}>
                  <div 
                    onClick={() => handleTableClick(table.id)}
                    className={`${getTableColor(table.status)} rounded-lg p-3 text-center cursor-pointer active:opacity-70`}
                  >
                    <p className="text-white text-sm mb-0">{table.name}</p>
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          <IonModal isOpen={showMenu} onDidDismiss={() => setShowMenu(false)}>
            <IonHeader>
              <IonToolbar color="dark">
                <IonTitle>
                  Editar Item e observação
                </IonTitle>
                <IonSearchbar slot="end" style={{ maxWidth: '120px' }} />
              </IonToolbar>
            </IonHeader>
            
            <IonContent color="dark">
              <IonList className="bg-transparent">
                {Object.entries(DATABASE.menu).map(([category, items]) => (
                  <div key={category}>
                    <IonItem color="dark" lines="full">
                      <IonLabel>
                        <h2 className="text-lg font-semibold capitalize">{category}</h2>
                        <p className="text-xs text-gray-400">Obrigatório</p>
                      </IonLabel>
                    </IonItem>
                    {items.map((item: any) => (
                      <IonItem key={item.id} color="dark" lines="full">
                        <IonLabel>
                          <h3>{item.name}</h3>
                          <p>R$ {item.price.toFixed(2)}</p>
                        </IonLabel>
                        <div slot="end" className="flex items-center gap-2">
                          <IonButton 
                            fill="clear" 
                            color="medium"
                            onClick={() => updateItemQuantity(item, false)}
                          >
                            <IonIcon icon={remove} />
                          </IonButton>
                          <span className="w-6 text-center">
                            {currentOrder.find(i => i.id === item.id)?.quantity || 0}
                          </span>
                          <IonButton 
                            fill="clear" 
                            color="success"
                            onClick={() => updateItemQuantity(item, true)}
                          >
                            <IonIcon icon={add} />
                          </IonButton>
                        </div>
                      </IonItem>
                    ))}
                  </div>
                ))}
              </IonList>
            </IonContent>

            <IonFooter>
              <IonToolbar color="dark">
                <div className="p-4">
                  <IonButton 
                    expand="block"
                    color="success"
                    disabled={currentOrder.length === 0}
                    onClick={handleGenerateOrder}
                  >
                    Avançar - R$ {calculateTotal().toFixed(2)}
                  </IonButton>
                </div>
              </IonToolbar>
            </IonFooter>
          </IonModal>
        </IonContent>

        <IonFooter>
          <IonToolbar color="dark">
            <IonButton 
              expand="block" 
              color="primary" 
              className="ion-margin"
              style={{ '--background': '#1a2c3e' }}
            >
              <IonIcon icon={car} slot="start" />
              Gerar pedido delivery
            </IonButton>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    </>
  );
};

export default Tables;