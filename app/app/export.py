from flask import Flask, Blueprint, request, make_response
from flask_login import login_required, current_user

from app import db
from app.models import Queue

import csv
import re
from io import StringIO
from werkzeug.wrappers import Response


export = Blueprint('export', __name__)

#Generate csv file from a dict
def generate_csv(table):
    data = StringIO()
    w = csv.writer(data)

    # Write headers
    w.writerow(Queue.__table__.columns.keys())
    yield data.getvalue()
    data.seek(0)
    data.truncate(0)

    # Write from dict
    for row in table:
        w.writerow((
            row.id,
            row.studentName,
            row.studentNumber,
            row.unitCode,
            row.enquiry,
            row.queue,
            row.status,
            row.enterQueueTime,
            row.changeSessionTime,
            row.exitSessionTime
        ))
        yield data.getvalue()
        data.seek(0)
        data.truncate(0)

# Export to csv
@export.route('/CSV', methods=['POST'])
def download_data():
        body = request.get_json(force=True)
        dateTimeFormat = "[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{6}"

        if 'startTime' not in body or body['startTime'][0] == ' ':
            return {"message": f"Parameter startTime not in body"}, 400
        elif 'endTime' not in body or body['endTime'][0] == ' ':
            return {"message": f"Parameter endTime not in body"}, 400
        elif re.match(dateTimeFormat, body['startTime'][0]):
            return {"message": f"Parameter startTime is of incorrect format"}, 400
        elif re.match(dateTimeFormat, body['endTime'][0]):
            return {"message": f"Parameter endTime is of incorrect format"}, 400
        else:
            startTime = body['startTime']
            endTime = body['endTime']
            query = db.session.query(Queue).filter(Queue.enterQueueTime >= startTime, Queue.exitSessionTime <= endTime).all()

            # Generate a filename
            name = f"log_{startTime[:10]}_to_{endTime[:10]}.csv"

            # Stream the response
            response = Response(generate_csv(query), mimetype='text/csv')
            response.headers["Content-Disposition"] = f"attachment; filename={name}"
            return response