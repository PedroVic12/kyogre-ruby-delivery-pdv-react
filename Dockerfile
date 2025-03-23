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
RUN npm install --force \  
    @mui/material \
    @emotion/react \
    @emotion/styled \
    @mui/icons-material \
    @ionic/react \
    @types/sqlite3 \
    @types/bcrypt \                  
    sqlite \ 
    lucide-react \
    axios \
    react-hot-toast \
    plotly.js \
    react-plotly.js \
    react-router-dom \
    react-dom \
    tailwindcss \
    postcss \
    autoprefixer \
    -D

RUN npx tailwindcss init -p

#RUN npm install typescript

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
RUN pip install --no-cache-dir -r requirements.txt --break-system-packages

# Copia o código fonte do backend
COPY backend/server .


# ==============================
# FINALIZAÇÃO - EXECUTANDO AMBOS (MULTI-SERVICE)
# ==============================
FROM node:20.13.1-bookworm-slim AS final 

WORKDIR /app

# Instalar Python e Nginx - NODE.JS e NPM JÁ VÊM NA IMAGEM BASE
RUN apt-get update && \
    apt-get install -y nginx python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Copiar o backend compilado
COPY --from=build-backend /app/backend/server /app/backend

# Copiar o frontend compilado
COPY --from=build-frontend /app/frontend/kyogre_pdv_app/dist /app/frontend/dist

# Copiar a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajustar permissões do frontend
RUN chown -R www-data:www-data /app/frontend/dist && \
    chmod -R 755 /app/frontend/dist

# Instalar dependências do backend (NOVAMENTE NA IMAGEM FINAL)
RUN pip install --no-cache-dir -r /app/backend/requirements.txt --break-system-packages

# RENDERIZAR O FRONTEND AQUI NA IMAGEM FINAL (CONFORME PEDIDO - MENOS OTIMIZADO)
WORKDIR /app/frontend/kyogre_pdv_app
COPY frontend/kyogre_pdv_app ./
RUN npm install
RUN npm run build

EXPOSE 80
EXPOSE 8000


CMD nginx -g 'daemon off;' & uvicorn main:app --host 0.0.0.0 --port 8000 & npm run dev

#CMD ["/app/start.sh"]

#! como usar
#docker build -t kyogre-app .
#docker run -p 8000:8000 -p 5173:5173 kyogre-app

#! para rodar o docker com o compose
#docker compose up -d