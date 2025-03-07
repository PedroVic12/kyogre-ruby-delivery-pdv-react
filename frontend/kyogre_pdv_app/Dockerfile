# ==============================
# BUILD DO FRONTEND (VITE)
# ==============================
FROM node:18-alpine AS build_frontend

WORKDIR /app/frontend

# Copia os arquivos de configuração
COPY frontend/kyogre_pdv_app/package*.json ./
COPY frontend/kyogre_pdv_app/tailwind.config.js ./
COPY frontend/kyogre_pdv_app/postcss.config.js ./
COPY frontend/kyogre_pdv_app/vite.config.ts ./

# Instala as dependências do frontend
RUN npm install && \
    npm install @mui/material plotly.js react-plotly.js @ionic/react @emotion/react @emotion/styled lucide-react react-router-dom && \
    npm install -D tailwindcss postcss autoprefixer && \
    npx tailwindcss init -p 

# Copia o código fonte do frontend
COPY frontend/kyogre_pdv_app . .

# Gera o build do frontend
RUN npm run build

# ==============================
# BUILD DO BACKEND (FASTAPI)
# ==============================
FROM python:3.10 AS build_backend

WORKDIR /app/backend

# Copia os arquivos do backend
COPY backend/server/requirements.txt .

# Instala as dependências do FastAPI
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código fonte do backend
COPY backend/server . .

# ==============================
# FINALIZAÇÃO - EXECUTANDO AMBOS (MULTI-SERVICE)
# ==============================
FROM python:3.10

WORKDIR /app

# Copia o backend e o frontend da etapa de build
COPY --from=build_backend /app/backend /app/backend
COPY --from=build_frontend /app/frontend/dist /app/frontend

# Instala dependências do backend
RUN pip install --no-cache-dir -r /app/backend/server/requirements.txt

# Expor portas
EXPOSE 8000 5173

RUN npm install typescript

# Comando para rodar o FastAPI e o Vite ao mesmo tempo
CMD cd /app/backend/server && uvicorn main:app --host 0.0.0.0 --port 8000 & \
    cd /app/frontend/kyogre_pdv_app && npm run preview

