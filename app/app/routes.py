from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from . import db
from .models import  User


routes = Blueprint('routes', __name__)

@routes.route('/')
#@login_required
def home():
    if current_user.is_authenticated:
        user = User.query.filter_by(id = current_user.id).first()

    return render_template('home.html', user=current_user)

@routes.route('/analytics')
#@login_required
def data():
    if current_user.is_authenticated:
        user = User.query.filter_by(id = current_user.id).first()

    return render_template('data.html', user=current_user)