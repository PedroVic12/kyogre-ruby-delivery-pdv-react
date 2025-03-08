# Kyogre Ruby Delivery Pdv React

```bash
cd frontend/kyogre_pdv_app
```

## Installation

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


## Run local

```bash
npm run dev
```

## Run docker

```bash
docker build -t kyogre-ruby-delivery-pdv-react .
```

```bash
docker run -p 80:80 kyogre-ruby-delivery-pdv-react
```

