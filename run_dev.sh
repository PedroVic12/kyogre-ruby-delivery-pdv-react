#!/bin/bash

echo "Iniciando o Frontend (Vite Dev Server)..."
cd frontend/kyogre_pdv_app
npm install # Garante que as dependências do frontend estão instaladas
npm run dev & # Inicia o servidor de desenvolvimento do Vite em background

echo "Iniciando o Backend (FastAPI com Uvicorn)..."
cd ../../../Raichu-Server
pip install -r requirements.txt --break-system-packages # Garante que as dependências do backend estão instaladas

clear

uvicorn main:app --reload --host 0.0.0.0 --port 9000 & # Inicia o backend FastAPI em background com hot-reload

echo "Aguardando 5 segundos para os servidores iniciarem..."



sleep 3 # Espera um pouco para os servidores subirem

echo "Servidores iniciados!"
echo "Frontend rodando em: http://localhost:5173"
echo "Backend (API) rodando em: http://localhost:8000"

# Mantém o script rodando para os servidores continuarem ativos
tail -f /dev/null