from flask import Blueprint, render_template, request
from flask_login import login_required, current_user

from sqlalchemy.sql.elements import Null

from app.models import User

routes = Blueprint('routes', __name__)

# Main Routes
@routes.route('/')
@login_required
def home():
    # TODO: Implement user roles
    # Example:
    # if current_user.is_authenticated:
    #     user = User.query.filter_by(id = current_user.id).first()

    return render_template('home.html', user=current_user)

@routes.route('/analytics')
@login_required
def data():
    return render_template('data.html', user=current_user)

@routes.route('/export')
@login_required
def export():
    return render_template('export.html', user=current_user)