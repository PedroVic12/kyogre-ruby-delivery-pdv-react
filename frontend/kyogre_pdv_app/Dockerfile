FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app/frontend/kyogre_pdv_app

# Copia os arquivos de configuração
COPY package*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY vite.config.ts ./

# Instala as dependências
RUN npm install @mui/material  plotly.js react-plotly.js @ionic/react @emotion/react @emotion/styled lucide-react react-router-dom && \
    npm install -D tailwindcss postcss autoprefixer && \
    npx tailwindcss init -p 

# Instala o serve como dependência do projeto
#RUN npm install serve

# Instala as demais dependências
RUN npm install

# Copia o código fonte
COPY . .

# Gera o build da aplicação
RUN npm run build

# Expose port
# Expose dynamic port
EXPOSE $PORT

RUN npm install typescript

# Start command
CMD ["npm", "run", "preview"]

