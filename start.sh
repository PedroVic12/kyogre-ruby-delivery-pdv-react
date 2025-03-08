#!/bin/bash

# Iniciar o backend FastAPI em segundo plano
cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 & 

# Aguardar um momento para o backend iniciar
sleep 3

# Iniciar o Nginx em primeiro plano (para manter o container rodando)
nginx -g 'daemon off;' 