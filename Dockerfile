# Estágio de build
FROM node:18-alpine as build

WORKDIR /app/frontend/kyogre_pdv_app

# Copia os arquivos de configuração
COPY package*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Instala as dependências específicas primeiro
RUN npm install @mui/material @emotion/react @emotion/styled lucide-react react-router-dom && \
    npm install -D tailwindcss postcss autoprefixer && \
    npx tailwindcss init -p

# Instala as demais dependências
RUN npm install

# Copia o código fonte
COPY . .

# Gera o build da aplicação
RUN npm run build

# Estágio de produção com nginx
FROM nginx:alpine

# Copia os arquivos de build para o diretório do nginx
COPY --from=build /app/frontend/kyogre_pdv_app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o nginx
CMD ["nginx", "-g", "daemon off;"]