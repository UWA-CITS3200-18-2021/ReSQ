import os

from app import db
from app.models import User


def create_first_user_if_not_exist():
    """
    Creates the first user in the database based from the environment variable
    """
    username = os.environ.get('ADMIN_USERNAME')
    password = os.environ.get('ADMIN_PASSWORD')

    if not User.query.filter_by(username=username).first():
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        print(f"User {username} has been created")
    else:
        print(f"User {username} already exists")
