
cd frontend/kyogre_pdv_app
npm run dev

echo "Frontend rodando na porta 5173"

cd ../..

cd backend/server
python3 -m uvicorn main:app --reload

echo "Backend rodando na porta 8000"

cd ../..

cd nginx
nginx -g "daemon off;"

echo "Nginx rodando na porta 80"



