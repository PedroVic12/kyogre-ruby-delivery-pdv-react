import React from 'react';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';
import { 
  receiptOutline, 
  addCircleOutline, 
  gridOutline,
} from 'ionicons/icons';

const Menu: React.FC = () => {
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList>
          <IonListHeader>PDV Garçom</IonListHeader>
          <IonMenuToggle autoHide={false}>
            <IonItem routerLink="/orders" routerDirection="none" lines="none">
              <IonIcon slot="start" icon={receiptOutline} />
              <IonLabel>Pedidos</IonLabel>
            </IonItem>
            <IonItem routerLink="/new-order" routerDirection="none" lines="none">
              <IonIcon slot="start" icon={addCircleOutline} />
              <IonLabel>Novo Pedido</IonLabel>
            </IonItem>
            <IonItem routerLink="/tables" routerDirection="none" lines="none">
              <IonIcon slot="start" icon={gridOutline} />
              <IonLabel>Mesas</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;