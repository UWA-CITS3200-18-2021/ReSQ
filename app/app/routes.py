from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user

from sqlalchemy import insert
from sqlalchemy.sql.elements import Null

from app import db
from app.globals import statusType
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
# Add a new entry to the queue
@routes.route('/add_entry', methods=["POST"])
def add_to_queue():
    new = Queue(studentName = request.headers['studentName'], 
                        studentNumber = request.headers['studentNumber'], 
                        unitCode = request.headers['unitCode'], 
                        enquiry = request.headers['enquiry'],
                        queue = request.headers['queue'],
                        status = 'In Queue',
                        enterQueueTime = datetime.now())
    
    db.session.add(new)
    db.session.commit()
    return str(new.id)

# Update an entry in the queue table
@routes.route('/update_entry', methods=["POST"])
def update_entry():
    id = request.headers['id']
    dest = request.headers['destination']
    entry = db.session.query(Queue).filter(Queue.id == id).first()
    src = entry.status
    time = datetime.now()

    if src == 'Ended':
        if dest == 'In Queue':
            entry.exitSessionTime = Null
        else:
            raise ValueError("Invalid Destination")
    elif src == 'In Queue':
        if dest == 'Ended':
            entry.exitSessionTime = time
        elif dest == 'In Session':
            entry.changeSessionTime = time
        else:
            raise ValueError("Invalid Destination")
    elif src == 'In Session':
        if dest == 'In Queue':
            entry.changeSessionTime = Null
        elif dest == 'Completed':
            entry.exitSessionTime = time
        else:
            raise ValueError("Invalid Destination")
    elif src == 'Completed':
        if dest == 'In Session':
            entry.exitSessionTime = Null
        else:
            raise ValueError("Invalid Destination")
    
    entry.status = dest
    db.session.commit()
    return ''

# Return a list containing the details of the specified queue
@routes.route('/get_queue', methods=["GET"])
def get_queue():
    queue_request = request.headers["queue"]
    if queue_request == 'In Session':
        queue_to_send = db.session.query(Queue).filter(Queue.status == 'In Session').all()
    elif queue_request == 'STUDYSmarter':
        queue_to_send = db.session.query(Queue).filter(Queue.queue == 'STUDYSmarter', Queue.status == 'In Queue').all()
    elif queue_request == 'Librarians':
        queue_to_send = db.session.query(Queue).filter(Queue.queue == 'Librarians', Queue.status == 'In Queue').all()
    else:
        raise ValueError("Invalid Queue")

    return queue_to_send