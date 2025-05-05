#!/bin/bash


# Start the React app with pm2
npm install
pm2 start npm --name "react-app" -- start

echo "Front end iniciado!";

# Start the FastAPI app with pm2
pm2 start fastapi_websocket.py --name "fastapi-app" --interpreter python3 -- -m uvicorn fastapi_websocket:app --host 0.0.0.0 --port 9400
