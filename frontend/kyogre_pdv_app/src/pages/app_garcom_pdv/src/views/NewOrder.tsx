import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonFooter,
} from '@ionic/react';

const NewOrder: React.FC = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [items, setItems] = useState([
    { id: 1, name: 'Hambúrguer', price: 25.00, quantity: 0 },
    { id: 2, name: 'Refrigerante', price: 8.00, quantity: 0 },
    { id: 3, name: 'Batata Frita', price: 15.00, quantity: 0 },
  ]);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const updateItemQuantity = (itemId: number, quantity: number) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Novo Pedido</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Número da Mesa</IonLabel>
            <IonInput
              type="number"
              value={tableNumber}
              onIonChange={e => setTableNumber(e.detail.value!)}
              placeholder="Digite o número da mesa"
            />
          </IonItem>

          {items.map(item => (
            <IonItem key={item.id}>
              <IonLabel>
                <h2>{item.name}</h2>
                <p>R$ {item.price.toFixed(2)}</p>
              </IonLabel>
              <IonSelect
                value={item.quantity}
                onIonChange={e => updateItemQuantity(item.id, parseInt(e.detail.value))}
                interface="popover"
              >
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <IonSelectOption key={num} value={num}>
                    {num}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton expand="block" disabled={!tableNumber || calculateTotal() === 0}>
            Confirmar Pedido - R$ {calculateTotal().toFixed(2)}
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default NewOrder;