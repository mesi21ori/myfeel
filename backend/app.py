import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from config import Config
from extensions import db
from routes.auth import auth_bp
from routes.user import user_bp
from routes.upload import upload_bp  
from routes.analyze import analyze_bp
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

db.init_app(app)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(upload_bp)  

app.register_blueprint(analyze_bp, url_prefix='/analyze')
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
