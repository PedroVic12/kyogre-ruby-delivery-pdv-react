# Kyogre Ruby Delivery Pdv React Instalação

1) Instalar o Nodejs, npm, Git e Github desktop

2) Configurar o ambiente

```bash
cd frontend/kyogre_pdv_app
```

Analisar o arquivo Dockerfile para pegar todas as depedencias
```bash
npm install @mui/material @emotion/react @emotion/styled lucide-react react-router-dom
```
```bash
npm install -D tailwindcss postcss autoprefixer
```
```bash
npx tailwindcss init -p
```
```bash
npm install 
```

```src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3) Run local

```bash
npm run dev
```

4) Run docker

```bash
docker build -t kyogre-ruby-delivery-pdv-react .
```

```bash
docker run -p 80:80 kyogre-ruby-delivery-pdv-react
```

