from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

app = Flask(__name__)
db = SQLAlchemy(app)
DB_NAME = "database.db"


def create_app():
  
  app.config['SECRET_KEY'] = 'admin'
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(DB_NAME)
  db.init_app(app)

  from .routes import routes
  from .auth import auth

  app.register_blueprint(routes, url_prefix='/')
  app.register_blueprint(auth, url_prefix='/')

  from .models import User

  create_database(app)

  login_manager = LoginManager()
  login_manager.login_view = "auth.admin_login"
  login_manager.init_app(app)

  @login_manager.user_loader
  def load_user(id):
    return User.query.get(int(id))

  return app

def create_database(app):
  if not path.exists('app/' + DB_NAME):
    db.create_all(app=app)
    print("Created Database")
    
