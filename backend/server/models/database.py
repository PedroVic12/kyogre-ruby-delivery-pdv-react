# backend/app/models/database.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.supabase_url = os.getenv('SUPABASE_URL')
            cls._instance.supabase_key = os.getenv('SUPABASE_KEY')
            cls._instance.client = create_client(cls._instance.supabase_url, cls._instance.supabase_key)
        return cls._instance

    def get_client(self) -> Client:
        return self.client

