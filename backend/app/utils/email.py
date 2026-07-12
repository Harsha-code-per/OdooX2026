from typing import Optional, Dict, Any
from app.config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

class EmailService:
    """Email service for sending transactional emails"""

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.email_from = settings.EMAIL_FROM
        self.frontend_url = settings.FRONTEND_URL

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """Send an email (placeholder for actual SMTP implementation)"""
        if not self.smtp_host or not self.smtp_user:
            logger.warning("SMTP not configured. Email would be sent to: %s", to_email)
            logger.info("Email Subject: %s", subject)
            logger.info("Email Content: %s", html_content[:200] + "...")
            return True

        try:
            # Actual SMTP implementation would go here
            # For now, this is a placeholder
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart

            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.email_from
            msg['To'] = to_email

            # Attach HTML version
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            # Attach text version if provided
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)

            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            logger.info("Email sent successfully to %s", to_email)
            return True

        except Exception as e:
            logger.error("Failed to send email to %s: %s", to_email, str(e))
            return False

    async def send_verification_email(self, to_email: str, verification_token: str) -> bool:
        """Send email verification email"""
        verification_url = f"{self.frontend_url}/verify-email?token={verification_token}"

        subject = "Verify Your Email Address"
        html_content = f"""
        <html>
        <body>
            <h2>Welcome to Odoo X!</h2>
            <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
            <p>
                <a href="{verification_url}">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p>{verification_url}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with Odoo X, please ignore this email.</p>
        </body>
        </html>
        """

        return await self.send_email(to_email, subject, html_content)

    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """Send password reset email"""
        reset_url = f"{self.frontend_url}/reset-password?token={reset_token}"

        subject = "Reset Your Password"
        html_content = f"""
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <p>
                <a href="{reset_url}">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p>{reset_url}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
        </body>
        </html>
        """

        return await self.send_email(to_email, subject, html_content)

    async def send_password_change_notification(self, to_email: str) -> bool:
        """Send password change notification"""
        subject = "Password Changed Successfully"
        html_content = """
        <html>
        <body>
            <h2>Password Changed</h2>
            <p>Your password has been changed successfully.</p>
            <p>If you didn't make this change, please contact support immediately.</p>
        </body>
        </html>
        """

        return await self.send_email(to_email, subject, html_content)

# Global email service instance
email_service = EmailService()