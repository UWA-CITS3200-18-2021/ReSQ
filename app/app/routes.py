from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user

from sqlalchemy import insert
from sqlalchemy.sql.elements import Null

from app import db
from app.globals import isChangeValid, queueType
from app.models import  Queue, User

from datetime import date, datetime

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


## Database query routes
#
# Add a new enquiry to the queue
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

@routes.route('/remove_from_queue', methods=["POST"])
def remove_from_queue():
    enquiry = db.session.query(Queue).filter(Queue.id == request.headers["queue_id"]).one()
    enquiry.exitSessionTime = datetime.now()
    db.session.commit()
    return ''

@routes.route('/undo_remove_from_queue', methods=["POST"])
def undo_remove_from_queue():
    enquiry = db.session.query(Queue).filter(Queue.id == request.headers["queue_id"]).one()
    enquiry.exitSessionTime = Null
    db.session.commit()
    return ''
    
@routes.route('/add_to_session', methods=["POST"])
def add_to_session():
    enquiry = db.session.query(Queue).filter(Queue.id == request.headers["queue_id"]).one()
    enquiry.changeSessionTime = datetime.now()
    db.session.commit()
    return ''
    
@routes.route('/undo_add_to_session', methods=["POST"])
def undo_add_to_session():
    enquiry = db.session.query(Queue).filter(Queue.id == request.headers["queue_id"]).one()
    enquiry.changeSessionTime = Null
    db.session.commit()
    return ''

@routes.route('/finish_session', methods=["POST"])
def finish_session():
    enquiry = db.session.query(Queue).filter(Queue.id == request.headers["queue_id"]).one()
    enquiry.exitSessionTime = datetime.now()
    db.session.commit()
    return ''

@routes.route('/undo_finish_session', methods=["POST"])
def undo_finish_session():
    enquiry = db.session.query(Queue).filter(Queue.id == request.headers["queue_id"]).one()
    enquiry.exitSessionTime = Null
    db.session.commit()
    return ''