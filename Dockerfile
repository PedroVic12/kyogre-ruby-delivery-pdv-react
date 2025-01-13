FROM node:18-alpine

WORKDIR /app/frontend/kyogre_pdv_app

# Copia os arquivos de configuração
COPY package*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Instala as dependências
RUN npm install @mui/material @emotion/react @emotion/styled lucide-react react-router-dom && \
    npm install -D tailwindcss postcss autoprefixer && \
    npx tailwindcss init -p

# Instala o serve como dependência do projeto (não global)
RUN npm install serve

# Instala as demais dependências
RUN npm install

# Copia o código fonte
COPY . .

# Gera o build da aplicação
RUN npm run build

# Expose port (using PORT environment variable from Render)
EXPOSE $PORT

# Start command usando npx para garantir que encontre o serve
CMD ["sh", "-c", "npx serve -s dist -l $PORT"]