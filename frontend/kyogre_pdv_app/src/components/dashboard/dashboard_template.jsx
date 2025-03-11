import React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonCard,
    IonBadge,
} from '@ionic/react';
import {
    gridOutline,
    peopleOutline,
    analyticsOutline,
    settingsOutline,
    notificationsOutline,
} from 'ionicons/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const revenueData = [
    { name: 'Jan', value: 30000 },
    { name: 'Feb', value: 35000 },
    { name: 'Mar', value: 32000 },
    { name: 'Apr', value: 45231 },
];


//! npm install @ionic/react ionicons recharts

const DashboardPage = () => {
    return (
        <>
            {/* Side Menu */}
            <IonMenu contentId="main-content" className="dark-theme">
                <IonContent className="ion-padding custom-sidebar">
                    <h1 className="sidebar-title">Dashboard</h1>
                    <IonList lines="none" className="custom-menu-list">
                        <IonItem button className="menu-item active">
                            <IonIcon icon={gridOutline} slot="start" />
                            <IonLabel>Dashboard</IonLabel>
                        </IonItem>
                        <IonItem button className="menu-item">
                            <IonIcon icon={peopleOutline} slot="start" />
                            <IonLabel>Users</IonLabel>
                        </IonItem>
                        <IonItem button className="menu-item">
                            <IonIcon icon={analyticsOutline} slot="start" />
                            <IonLabel>Analytics</IonLabel>
                        </IonItem>
                        <IonItem button className="menu-item">
                            <IonIcon icon={settingsOutline} slot="start" />
                            <IonLabel>Settings</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>

            {/* Main Content */}
            <IonPage id="main-content" className="dark-theme">
                <IonHeader>
                    <IonToolbar className="custom-toolbar">
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>Dashboard Overview</IonTitle>
                        <IonButtons slot="end">
                            <IonSearchbar
                                className="custom-searchbar"
                                placeholder="Search..."
                            ></IonSearchbar>
                            <IonIcon
                                icon={notificationsOutline}
                                className="notification-icon"
                                size="large"
                            />
                            <div className="profile-avatar">
                                <div className="avatar-circle"></div>
                            </div>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="dashboard-content">
                    <IonGrid>
                        {/* Metric Cards */}
                        <IonRow>
                            <IonCol size="12" sizeMd="3">
                                <IonCard className="metric-card">
                                    <div className="metric-content">
                                        <h3>Total Revenue</h3>
                                        <h2>$45,231.89</h2>
                                        <p className="metric-change positive">
                                            +20.1% from last month
                                        </p>
                                    </div>
                                </IonCard>
                            </IonCol>
                            <IonCol size="12" sizeMd="3">
                                <IonCard className="metric-card">
                                    <div className="metric-content">
                                        <h3>Active Users</h3>
                                        <h2>2,350</h2>
                                        <p className="metric-change positive">
                                            +180 new users
                                        </p>
                                    </div>
                                </IonCard>
                            </IonCol>
                            <IonCol size="12" sizeMd="3">
                                <IonCard className="metric-card">
                                    <div className="metric-content">
                                        <h3>Active Projects</h3>
                                        <h2>12</h2>
                                        <p className="metric-change neutral">
                                            2 pending approval
                                        </p>
                                    </div>
                                </IonCard>
                            </IonCol>
                            <IonCol size="12" sizeMd="3">
                                <IonCard className="metric-card">
                                    <div className="metric-content">
                                        <h3>Conversion Rate</h3>
                                        <h2>15.2%</h2>
                                        <p className="metric-change positive">
                                            +2.3% from last month
                                        </p>
                                    </div>
                                </IonCard>
                            </IonCol>
                        </IonRow>

                        {/* Chart */}
                        <IonRow>
                            <IonCol size="12">
                                <IonCard className="chart-card">
                                    <div className="chart-header">
                                        <h2>Revenue Overview</h2>
                                    </div>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={revenueData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3c" />
                                                <XAxis dataKey="name" stroke="#8884d8" />
                                                <YAxis stroke="#8884d8" />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#8884d8"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>

            <style>{`
        .dark-theme {
          --ion-background-color: #1a1b2e;
          --ion-text-color: #ffffff;
          --ion-toolbar-background: #1a1b2e;
          --ion-item-background: transparent;
        }

        .custom-sidebar {
          --background: #151623;
        }

        .sidebar-title {
          font-size: 24px;
          padding: 20px 16px;
          margin: 0;
          color: #ffffff;
        }

        .custom-menu-list {
          background: transparent;
        }

        .menu-item {
          --background: transparent;
          --color: #8884d8;
          margin: 8px 0;
          border-radius: 8px;
        }

        .menu-item.active {
          --background: rgba(136, 132, 216, 0.1);
          --color: #8884d8;
        }

        .custom-toolbar {
          --background: #1a1b2e;
          --color: #ffffff;
          border-bottom: 1px solid #2a2a3c;
        }

        .custom-searchbar {
          --background: #242424;
          --color: #ffffff;
          --placeholder-color: #666666;
          max-width: 300px;
        }

        .notification-icon {
          margin: 0 16px;
          color: #8884d8;
        }

        .profile-avatar {
          margin: 0 16px;
        }

        .avatar-circle {
          width: 32px;
          height: 32px;
          background: #8884d8;
          border-radius: 50%;
        }

        .metric-card {
          --background: #242436;
          border-radius: 12px;
          margin: 8px;
          padding: 16px;
        }

        .metric-content h3 {
          color: #8884d8;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .metric-content h2 {
          font-size: 24px;
          margin: 8px 0;
        }

        .metric-change {
          font-size: 12px;
          margin: 0;
        }

        .metric-change.positive {
          color: #4caf50;
        }

        .metric-change.neutral {
          color: #ff9800;
        }

        .chart-card {
          --background: #242436;
          border-radius: 12px;
          padding: 20px;
          margin: 8px;
        }

        .chart-header h2 {
          color: #ffffff;
          margin: 0 0 20px 0;
        }

        .chart-container {
          width: 100%;
          height: 300px;
        }
      `}</style>
        </>
    );
};

export default DashboardPage;