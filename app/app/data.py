from flask import Flask, Blueprint, request, make_response
from flask_login import login_required, current_user

from app import db
from app.models import Queue

import csv
import re
from io import StringIO
from werkzeug.wrappers import Response


data = Blueprint('data', __name__)

# 
@data.route('/createChart', methods=['POST'])
def create_chart():
    body = request.get_json(force=True)
    dateTimeFormat = "[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{6}"

    # Check recieved data
    if 'startTime' not in body or body['startTime'][0] == ' ':
        return {"message": f"Parameter startTime not in body"}, 400
    elif 'endTime' not in body or body['endTime'][0] == ' ':
        return {"message": f"Parameter endTime not in body"}, 400
    elif re.match(dateTimeFormat, body['startTime'][0]):
        return {"message": f"Parameter startTime is of incorrect format"}, 400          
    elif re.match(dateTimeFormat, body['endTime'][0]):
        return {"message": f"Parameter endTime is of incorrect format"}, 400
    else:
        # Get data from body and query the database
        startTime = body['startTime']
        endTime = body['endTime']
        query = db.session.query(Queue).filter(Queue.enterQueueTime >= startTime, Queue.exitSessionTime <= endTime).all()

        return "hello"