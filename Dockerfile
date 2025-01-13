FROM node:18-alpine

WORKDIR /app/frontend/kyogre_pdv_app

# Copia os arquivos de configuração
COPY package*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Instala as dependências
RUN npm install @mui/material @emotion/react @emotion/styled lucide-react react-router-dom && \
    npm install -D tailwindcss postcss autoprefixer && \
    npx tailwindcss init -p && \
    npm install serve -g

# Instala as demais dependências
RUN npm install

# Copia o código fonte
COPY . .

# Gera o build da aplicação
RUN npm run build

# Expõe a porta que o serve utilizará
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]