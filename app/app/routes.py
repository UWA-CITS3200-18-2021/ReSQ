from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user

from sqlalchemy import insert
from sqlalchemy.sql.elements import Null

from app import db
from app.globals import isChangeValid, queueType
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
@routes.route('/add_to_queue', methods=["GET"])
def add_to_queue():
    new = Queue(studentName = request.headers['studentName'], 
                        studentNumber = request.headers['studentNumber'], 
                        unitCode = request.headers['unitCode'], 
                        enquiry = request.headers['enquiry'],
                        queue = request.headers['queue'],
                        enterQueueTime = datetime.now())
    
    db.session.add(new)
    db.session.commit()
    return str(new.id)

# Route for updating the queue
# Requires 2 headers: queue_id, destination
@routes.route('/update_queue', methods=["POST"])
def update_queue():
    enquiry = db.session.query(Queue).filter(Queue.id == request.headers["queue_id"]).one()
    status = enquiry.queue
    dest = request.headers['destination']
    time = datetime.now()
    
    if not isChangeValid(status, dest):
        raise ValueError("Illegal Update")
    else:
        if status in ('STUDYSmarter','Librarians'):
            if enquiry.changeSessionTime == Null:
                enquiry.changeSessionTime = time
            else:
                enquiry.exitSessionTime = time
        elif status in ('Ended', 'Completed'):
            if enquiry.exitSessionTime == Null:
                enquiry.changeSessionTime = Null
            else:
                enquiry.exitSessionTime = Null
        elif status == 'In Session':
            if dest == 'Completed':
                enquiry.exitSessionTime = time
            else:
                enquiry.changeSessionTime = Null
    
    enquiry.queue = dest
    db.session.commit()
    return ''