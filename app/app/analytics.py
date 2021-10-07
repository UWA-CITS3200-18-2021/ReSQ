from flask import Flask, Blueprint, request, jsonify, render_template
from flask_login import login_required, current_user

from random import sample
import json
from app import db
from app.models import Queue

import re
from io import StringIO
from werkzeug.wrappers import Response


analytics = Blueprint('analytics', __name__)

#
@analytics.route('/createChart', methods=['GET', 'POST'])
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
        
        unitsDictionary = {}
        staffTypesDictionary = {}
        
        for q in query:
            unitsDictionary[q.unitCode[:4].upper()] = unitsDictionary.get(q.unitCode[:4].upper(), 0) + 1
            staffTypesDictionary[q.queue] = staffTypesDictionary.get(q.queue, 0) + 1

        result = {
            'studentBarGraph': sample(range(1,10), 7),
            'topUnitValues' : unitsDictionary,
            'staffPieValues' : staffTypesDictionary
        }
        
        return json.dumps(result)