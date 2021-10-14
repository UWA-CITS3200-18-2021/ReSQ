from flask import Flask, Blueprint, request, make_response
from flask_login import login_required, current_user

from app import db
from app.models import Queue

import csv
from datetime import datetime
from io import StringIO
from werkzeug.wrappers import Response


export = Blueprint('export', __name__)

#Stream csv file from a list of tuples
def generate_csv(table):
    # Initialisation
    data = StringIO()
    w = csv.writer(data)

    # Write headers
    w.writerow(Queue.__table__.columns.keys())
    yield data.getvalue()
    data.seek(0)
    data.truncate(0)

    # Write from list
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

        # Check recieved data
        if 'startTime' not in body:
            return {"message": f"Parameter startTime not in body"}, 400
        elif 'endTime' not in body:
            return {"message": f"Parameter endTime not in body"}, 400

        # Check correct format
        try:
            datetime.strptime(body['startTime'], "%Y-%m-%d %H:%M:%S.%f")
            datetime.strptime(body['endTime'], "%Y-%m-%d %H:%M:%S.%f")
        except ValueError as exception:
            return {"message": f"ValueError of Parameter: {str(exception)}"}, 400
        
        # Get data from body and query the database
        startTime = body['startTime']
        endTime = body['endTime']
        query = db.session.query(Queue).filter(Queue.enterQueueTime >= startTime, Queue.exitSessionTime <= endTime).all()

        # Generate a filename
        name = f"log_{startTime[:10]}_to_{endTime[:10]}.csv"

        # Stream the response
        response = Response(generate_csv(query), mimetype='text/csv')
        response.headers["Content-Disposition"] = f"attachment; filename={name}"
        return response