import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:1234567890@localhost:5432/mYFeel'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
