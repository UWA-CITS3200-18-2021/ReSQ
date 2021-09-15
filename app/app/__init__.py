from flask import Flask
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from config import Config


# Setup of Flask App
app = Flask(__name__)
app.config.from_object(Config)

# Setup of Database
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Setup of Login Manager
login_manager = LoginManager()
login_manager.login_view = "auth.admin_login"
login_manager.init_app(app)

# Note: This import should be here (VERY VERY IMPORTANT)
# Otherwise, you will get "Circular Import Error"
# Because these imports below need some stuff in this file (eg. `app`)
from app.auth import auth
from app.routes import routes
from app.queue import queue

app.register_blueprint(routes, url_prefix='/')
app.register_blueprint(auth, url_prefix='/')
app.register_blueprint(queue, url_prefix='/')