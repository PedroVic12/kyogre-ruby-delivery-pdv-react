# backend/app/services/email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.sender_email = os.getenv("SENDER_EMAIL")
        self.sender_password = os.getenv("SENDER_PASSWORD")
        self.owner_email = os.getenv("OWNER_EMAIL")
    
    async def send_login_notification(self, user_email: str):
        """Send a login notification email to the restaurant owner."""
        subject = f"Login Notification - Kyogre PDV"
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        body = f"""
        <html>
            <body>
                <h2>Kyogre PDV Login Notification</h2>
                <p>A new login was detected in your system:</p>
                <ul>
                    <li><strong>User:</strong> {user_email}</li>
                    <li><strong>Time:</strong> {current_time}</li>
                </ul>
                <p>If you did not perform this login, please review your account security.</p>
            </body>
        </html>
        """
        
        await self._send_email(self.owner_email, subject, body)
    
    async def send_new_order_notification(self, order_id: int, client_name: str):
        """Send a new order notification email to the restaurant owner."""
        subject = f"New Order #{order_id} - Kyogre PDV"
        current_time = datetime.now()