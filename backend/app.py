import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from config import Config
from extensions import db
from routes.auth import auth_bp
from routes.user import user_bp 

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(user_bp, url_prefix='/user')
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)


