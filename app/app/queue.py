from flask import Blueprint, request

from sqlalchemy.sql.elements import Null

from app import db
from app.models import  Queue
import pytz
from datetime import datetime

queue = Blueprint('queue', __name__)

# Add a new entry to the queue
@queue.route('/add_entry', methods=["POST"])
def add_to_queue():
    new = Queue(studentName = request.headers['studentName'], 
                        studentNumber = request.headers['studentNumber'], 
                        unitCode = request.headers['unitCode'], 
                        enquiry = request.headers['enquiry'],
                        queue = request.headers['queue'],
                        status = 'In Queue',
                        enterQueueTime = datetime.now(pytz.timezone('Australia/Perth')))
    
    db.session.add(new)
    db.session.commit()
    return str(new.id)

# Update an entry in the queue table
@queue.route('/update_entry', methods=["POST"])
def update_entry():
    id = request.headers['id']
    dest = request.headers['destination']
    entry = db.session.query(Queue).filter(Queue.id == id).first()
    src = entry.status
    time = datetime.now(pytz.timezone('Australia/Perth'))

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
@queue.route('/get_queue', methods=["GET"])
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