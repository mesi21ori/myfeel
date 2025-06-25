import smtplib
from email.mime.text import MIMEText

def send_verification_email(email, code):
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    sender_email = 'shumetmeseret7@gmail.com'        
    sender_password = 'ztwl urgr cixw fooy'         

    subject = 'Your mYFeel Verification Code'
    body = f'Your verification code is: {code}'

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = email

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, [email], msg.as_string())
        server.quit()
        print(f"Verification email sent to {email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
