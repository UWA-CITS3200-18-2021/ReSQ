from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user

from sqlalchemy import insert

from app import db
from app.models import  Queue, User

from datetime import datetime

routes = Blueprint('routes', __name__)

# Main Routes
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


# Database query routes
@routes.route('/add_to_queue', methods=["POST"])
def add_to_queue():
    new = Queue(studentName = request.headers['studentName'], 
                        studentNumber = request.headers['studentNumber'], 
                        unitCode = request.headers['unitCode'], 
                        enquiry = request.headers['enquiry'],
                        queue = request.headers['queue'],
                        enterQueueTime = datetime.now())
    
    db.session.add(new)
    db.session.commit()
    return ''

@routes.route('/update_queue', methods=['POST'])
def update_queue():
    if request.headers['queue'] == 'In Session':
        enquiry = Queue.query.filter_by(id = request.headers['id'])
