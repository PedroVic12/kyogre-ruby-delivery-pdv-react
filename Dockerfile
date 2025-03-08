# ==============================
# BUILD DO FRONTEND (VITE)
# ==============================
FROM node:20.13.1-bookworm-slim AS build-frontend

WORKDIR /app/frontend

# Navigate to the frontend app directory inside the container
WORKDIR /app/frontend/kyogre_pdv_app

# Copia os arquivos de configuração do frontend
COPY frontend/kyogre_pdv_app/package*.json ./
COPY frontend/kyogre_pdv_app/tailwind.config.js ./
COPY frontend/kyogre_pdv_app/postcss.config.js ./
COPY frontend/kyogre_pdv_app/vite.config.ts ./

# Instala as dependências do frontend
RUN npm install

RUN npm install @mui/material plotly.js react-plotly.js @ionic/react @emotion/react @emotion/styled lucide-react react-router-dom
RUN npm install -D tailwindcss postcss autoprefixer
RUN npx tailwindcss init -p

RUN npm install typescript

# Gera o build do frontend
RUN npm run build

# Copia o código fonte do frontend
COPY frontend/kyogre_pdv_app/. .



# ==============================
# BUILD DO BACKEND (FASTAPI)
# ==============================
FROM python:3.10 AS build-backend

WORKDIR /app/backend

# Navigate to the backend server directory inside the container
WORKDIR /app/backend/server

# Copia os arquivos do backend
COPY backend/server/requirements.txt .

# Instala as dependências do FastAPI
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código fonte do backend
COPY backend/server . .



# ==============================
# FINALIZAÇÃO - EXECUTANDO AMBOS (MULTI-SERVICE)
# ==============================
FROM python:3.10 AS final

WORKDIR /app

# Create directories for backend and frontend
RUN mkdir backend frontend

# Copy built backend from build-backend stage
COPY --from=build-backend /app/backend/server /app/backend

# Copy built frontend from build-frontend stage (the 'dist' folder)
COPY --from=build-frontend /app/frontend/kyogre_pdv_app/dist /app/frontend

# Install backend dependencies in the final stage
RUN pip install --no-cache-dir -r /app/backend/requirements.txt
RUN npm install


# Expor portas para backend (8000) e frontend (5173 - preview uses this by default, adjust if needed)
EXPOSE 8000
EXPOSE 5173

# Command to run both FastAPI backend and Vite frontend simultaneously
CMD /bin/bash -c "cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 & cd /app/frontend && npm run preview -- --host 0.0.0.0 --port 5173"