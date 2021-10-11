from flask import Blueprint, request, jsonify

from app import db
from app.models import Queue
from datetime import datetime

queue = Blueprint('queue', __name__)


@queue.route('/add_entry', methods=["POST"])
def add_to_queue():
    # Add a new entry to the queue
    body = request.get_json(force=True)

    try:
        new = Queue(studentName=body['studentName'],
                    studentNumber=body['studentNumber'],
                    unitCode=body['unitCode'],
                    enquiry=body['enquiry'],
                    queue=body['queue'],
                    status='In Queue',
                    enterQueueTime=datetime.now())
        db.session.add(new)
        db.session.commit()
        db.session.refresh(new)
        return new.to_dict, 201
    except KeyError as exception:
        return {"message": f"KeyError of Parameter: {str(exception)}"}, 400
    except ValueError as exception:
        return {"message": f"ValueError of Parameter: {str(exception)}"}, 400
    except Exception as exception:
        return {"message": str(exception)}, 500


@ queue.route('/update_entry/<entry_id>', methods=["POST"])
def update_entry(entry_id):
    # Update an entry in the queue table
    body = request.get_json(force=True)
    status = body['status']
    entry = db.session.query(Queue).filter(Queue.id == entry_id).first()
    src = entry.status
    time = datetime.now()

    if src == 'Ended':
        if status == 'In Queue':
            entry.exitSessionTime = None
        else:
            return {"message": f"Invalid Status Transition: Going to {status}, from {entry.status}"}, 400
    elif src == 'In Queue':
        if status == 'Ended':
            entry.exitSessionTime = time
        elif status == 'In Session':
            entry.changeSessionTime = time
        else:
            return {"message": f"Invalid Status Transition: Going to {status}, from {entry.status}"}, 400
    elif src == 'In Session':
        if status == 'In Queue':
            entry.changeSessionTime = None
        elif status == 'Completed':
            entry.exitSessionTime = time
        else:
            return {"message": f"Invalid Status Transition: Going to {status}, from {entry.status}"}, 400
    elif src == 'Completed':
        if status == 'In Session':
            entry.exitSessionTime = None
        else:
            return {"message": f"Invalid Status Transition: Going to {status}, from {entry.status}"}, 400

    entry.status = status
    db.session.commit()
    db.session.refresh(entry)  # This print is important (do not remove)
    return entry.to_dict(), 200

# Return a list containing the details of the specified queue


@ queue.route('/get_queue', methods=["POST"])
def get_queue():
    body = request.get_json(force=True)

    if "queue" in body:
        queue_request = body["queue"]
        if queue_request == 'In Session':
            queue_to_send = db.session.query(Queue).filter(Queue.status == 'In Session').all()
        elif queue_request == 'STUDYSmarter':
            queue_to_send = db.session.query(Queue).filter(Queue.queue == 'STUDYSmarter', Queue.status == 'In Queue').all()
        elif queue_request == 'Librarian':
            queue_to_send = db.session.query(Queue).filter(Queue.queue == 'Librarian', Queue.status == 'In Queue').all()
        else:
            queue_to_send = Queue.query.all()
    else:
        queue_to_send = Queue.query.all()
    
    db.session.commit()
    db.session.refresh(queue_to_send)
    return {"queue": [item.to_dict() for item in queue_to_send]}, 200
