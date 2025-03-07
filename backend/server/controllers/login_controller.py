# backend/app/controllers/auth_controller.py
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from ..models.user import UserModel, UserCreate, User
from ..services.email_service import EmailService

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = os.getenv("SECRET_KEY", "secret_key_for_jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

class AuthController:
    def __init__(self):
        self.user_model = UserModel()
        self.email_service = EmailService()
    
    async def register(self, user: UserCreate):
        db_user = await self.user_model.get_user_by_email(user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        return await self.user_model.create_user(user)
    
    async def login(self, email: str, password: str):
        user = await self.user_model.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=400, detail="Email not registered")
        
        # In a real app, you'd verify the password hash here
        if user["password"] != password:  # Insecure, just for demo
            raise HTTPException(status_code=400, detail="Incorrect password")
        
        # Update last login
        await self.user_model.update_last_login(user["id"])
        
        # Send login notification email
        await self.email_service.send_login_notification(user["email"])
        
        # Create access token
        access_token = self.create_access_token(data={"sub": user["email"]})
        return {"access_token": access_token, "token_type": "bearer"}
    
    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    async def get_current_user(self, token: str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise HTTPException(status_code=401, detail="Invalid token")
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        user = await self.user_model.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user


