# Kyogre Ruby Delivery PDV - Project Documentation


## Dev Notes

1) Supabase:
    - Cada cliente possui login,senha, nome_tabela, pasta_storage
    - O usuario logado possui segurança com criptografia e JWT e cada um possui seu banco especifico

2) Interface React consome API em FastAPI
    - Login
    - Cardapio Manager
    - Cardapio digital QR code, Cardapio PDV
    - Pedidos com Kanban
    - App Garcom com checkout

3) Api em Fastapi 
    - Se encarrega a controlar os pedidos, dados do supabase e o storage

## Overview

The Kyogre Ruby Delivery PDV (Point of Sale) project is a full-stack web application designed for restaurant management. It consists of a React-based frontend and a FastAPI-based backend, offering features for order management, product listing, customer management, and a digital menu. It utilizes Supabase as a backend-as-a-service for database management.

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

### Frontend (`/frontend/kyogre_pdv_app`)

*   **Technology:** React (with TypeScript)
*   **Purpose:** Handles the user interface, routing, and interactions with the backend API.
*   **Key Files:**
    *   `src/App.tsx`: The main application component. It defines the routing logic using `react-router-dom` and manages the overall layout.
    *   `src/pages`: Contains the various pages of the application (e.g., `DashboardPage`, `MenuPage`, `ClientsPage`, `CardapioDigitalPage`, `LoginPage`).
    *   `src/components`: Contains reusable UI components (e.g., `Sidebar`, `Header`).
    *   `src/contexts`: Includes context providers, such as `CartProvider` for managing the shopping cart state.
    *   `public`: Contains static assets.
    *   `index.css`: global CSS.
    * `tailwind.config.js`: Tailwind CSS config
    * `postcss.config.js`: PostCSS config
    * `vite.config.ts`: Vite config
    * `tsconfig.json`: Typescript config
    *   `package.json`: Manages dependencies and scripts.
* **Functionality**:
    * **Routing**: The application uses `react-router-dom` to define routes for different pages.
    * **Layouts**: Two main layouts are defined: one for the admin dashboard (with a sidebar and header) and another for the digital menu.
    * **State Management**: The `useState` hook is used for local component state, and `CartProvider` is used for global state (cart).
    * **UI**: Tailwind CSS is used for styling.

### Backend (`/backend/server`)

*   **Technology:** FastAPI (Python)
*   **Purpose:** Provides the API endpoints for the frontend, handles database interactions, and server-side logic.
*   **Key Files:**
    *   `main.py`: The main application file for the FastAPI backend.
    *   `controllers`: Contains controller classes (e.g., `PedidosController`) that define API routes.
    * `services`: This folder will contain the services used by the controllers, like the database operations, it has the `run_supabase.py`.
    *   `requirements.txt`: Lists the Python dependencies for the backend.
    *   `.env`: contains the environment varibles.
* **Functionality**:
    * **API Endpoints**: Defines endpoints for managing orders, products, etc.
    * **CORS**: Configures Cross-Origin Resource Sharing to allow requests from the frontend.
    * **Database Interaction**: Uses Supabase via the `run_supabase.py` script.
    * **Controllers**: Organizes the API logic into separate controllers.

### Database (Supabase)

*   **Technology:** Supabase (PostgreSQL)
*   **Purpose:** Provides the database for storing application data (e.g., products, orders, users).
*   **Interaction:**
    *   `run_supabase.py`: A script that demonstrates how to interact with Supabase using the Supabase Python client library.
    *   `SupabaseCRUD`: A custom class that provides CRUD (Create, Read, Update, Delete) operations for a Supabase table.
    *   Environment Variables: The `SUPABASE_URL` and `SUPABASE_KEY` are used to connect to the Supabase project.
* **Functionality**:
    * **Database Setup**: `run_supabase.py` is used to test the database connection and add data to the table.
    * **CRUD Operations**: `SupabaseCRUD` provides a simplified way to perform database operations.

### Docker

*   **Technology:** Docker
*   **Purpose:** Containerizes the application for easy deployment and management.
*   **Key Files:**
    *   `Dockerfile`: Defines the steps to build a Docker image for the application.
* **Functionality**:
    * **Multi-Stage Build**: The Dockerfile uses a multi-stage build approach to build the frontend and backend separately, and then combine them in a final image.
    * **Frontend Build**: Uses Node.js to build the Vite frontend.
    * **Backend Build**: Uses Python to build the FastAPI backend.
    * **Final Image**: Combines the built frontend and backend, installs Python dependencies for the backend, and exposes ports for both the frontend (5173) and backend (8000).
    * **Multi-service setup:** This is a great way to separate concerns and make your application easily scalable

## N8N

```bash
docker volume create n8n_data
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```

## Setup and Installation

### Prerequisites

*   Node.js and npm (for frontend)
*   Python and pip (for backend)
*   Docker (for containerization)
*   Supabase account and project (for database)
*  Create a .env file in the backend folder with the SUPABASE_URL and SUPABASE_KEY variables.

### Steps

1.  **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd kyogre-ruby-delivery-pdv-react
    ```

2.  **Frontend Setup:**

    ```bash
    cd frontend/kyogre_pdv_app
    npm install #or yarn install
    ```

3.  **Backend Setup:**    

    ```bash
    cd backend/server
    pip install -r requirements.txt
    ```
4. **Supabase Configuration:**
    *  Create the needed tables in your database (cardapio, produtos, usuarios, pedidos).
    * Update the `run_supabase.py` script to fit your needs.
5. **Database Seed**
    ```bash
    cd backend/server/services
    python3 run_supabase.py
    ```

6.  **Running the Application (Development):**

    *   **Frontend:**

        ```bash
        cd frontend/kyogre_pdv_app
        npm run dev
        ```

    *   **Backend:**

        ```bash
        cd backend/server
        python main.py
        ```

    *   The frontend will be available at `http://localhost:5173`, and the backend API at `http://localhost:8000`.

7. **Running the application with Docker**
    ```bash
    docker build -t kyogre-app .
    docker run -p 8000:8000 -p 5173:5173 kyogre-app
    ```
    or, if you want to use the compose file
    ```bash
    docker compose up -d
    ```
## Key Features

*   **Admin Dashboard:**
    *   Order management
    *   Product listing/menu management
    *   Client management
    *   Live chat
    * Kanban dashboard
*   **Digital Menu (Cardapio):**
    *   Interactive menu for customers
    *   Product details view
*   **Waiter App:**
    *   Table management
* **Multi service app**: Using a multi-stage docker file, this project is easily scalable.
* **Database**: Use Supabase to store the data.

## Technologies Used

*   **Frontend:**
    *   React
    *   TypeScript
    *   `react-router-dom` (Routing)
    *   Tailwind CSS (Styling)
    *   Vite
    * `mui`
    * `plotly.js`
    * `react-plotly.js`
    * `@ionic/react`
    * `@emotion/react`
    * `@emotion/styled`
    * `lucide-react`
*   **Backend:**
    *   FastAPI
    *   Python
    *   Uvicorn
    * `supabase`
    * `dotenv`
*   **Database:**
    *   Supabase (PostgreSQL)
*   **Containerization:**
    *   Docker

## API Endpoints (Backend)

*  The app is still being developed, only `PedidosController` was created.
*   `/`: Returns the API's status.

## Further Development

*   Implement the `LoginController` and `ProdutosController`.
*   Create a database migration tool.
* Implement tests to ensure stability.
*   Add more API endpoints for other functionalities.
*   Improve the user interface and user experience.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.



