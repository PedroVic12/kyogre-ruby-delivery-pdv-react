## Deploy 2 container (backend e frontend)
---

# ==============================
# BUILD DO FRONTEND (VITE)
# ==============================
FROM node:20.13.1-bookworm-slim AS build-frontend

WORKDIR /app/frontend/kyogre_pdv_app  

# Copia os arquivos de configuração do frontend - NOW FROM CORRECT PATH
COPY frontend/kyogre_pdv_app/package*.json ./
COPY frontend/kyogre_pdv_app/tailwind.config.js ./
COPY frontend/kyogre_pdv_app/postcss.config.js ./
COPY frontend/kyogre_pdv_app/vite.config.ts ./
COPY frontend/kyogre_pdv_app/tsconfig.json ./  

# Instala as dependências do frontend - ALL INSTALLS IN ONE RUN FOR CLEANER DOCKERFILE
RUN npm install && \
    npm install @mui/material plotly.js react-plotly.js @ionic/react @emotion/react @emotion/styled lucide-react react-router-dom && \
    npm install -D tailwindcss postcss autoprefixer && \
    npx tailwindcss init -p

RUN npm install typescript

# Copia o código fonte do frontend - COPY SOURCE AFTER DEPENDENCIES INSTALLED
COPY frontend/kyogre_pdv_app/. .

# Gera o build do frontend
RUN npm run build



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
COPY backend/server . 



# ==============================
# FINALIZAÇÃO - EXECUTANDO AMBOS (MULTI-SERVICE)
# ==============================
FROM node:20.13.1-bookworm-slim AS final 

WORKDIR /app

# Install Python and pip in the final image (as it's based on Node.js now)
RUN apt-get update && apt-get install nginx python3 python3-pip -y

# Criar diretórios para backend e frontend
RUN mkdir -p /app/backend /app/frontend/dist

# Copiar o backend compilado
COPY --from=build-backend /app/backend/server /app/backend

# Copiar o frontend compilado (apenas a pasta dist)
COPY --from=build-frontend /app/frontend/kyogre_pdv_app/dist /app/frontend/dist

# Copiar a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Instalar dependências do backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Expor portas para o Nginx (80) e backend (8000)
EXPOSE 80
EXPOSE 8000

# Script de inicialização
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Comando para iniciar o Nginx e o backend
CMD ["/app/start.sh"]

#! como usar
#docker build -t kyogre-app .
#docker run -p 8000:8000 -p 5173:5173 kyogre-app

#! para rodar o docker com o compose
#docker compose up -d