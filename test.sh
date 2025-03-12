#!/bin/bash

echo "Iniciando o Frontend (Vite Dev Server)..."
cd frontend/kyogre_pdv_app
#npm install # Garante que as dependências do frontend estão instaladas
#npm run dev & # Inicia o servidor de desenvolvimento do Vite em background

echo "Iniciando o Backend (FastAPI com Uvicorn)..."
cd ../../../Raichu-Server
pwd