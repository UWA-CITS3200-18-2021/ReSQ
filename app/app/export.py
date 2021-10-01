from flask import Flask, Blueprint, request, stream_with_context
from flask_login import login_required, current_user

from app import db
from app.models import Queue

import csv
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
        
        if 'startTime' not in body or body['startTime'][0] == ' ':
            return {"message": f"Parameter startTime not in body"}, 400
        elif 'endTime' not in body or body['endTime'][0] == ' ':
            return {"message": f"Parameter endTime not in body"}, 400
        else:
            startTime = body['startTime']
            endTime = body['endTime']
            query = db.session.query(Queue).filter(Queue.enterQueueTime >= startTime, Queue.exitSessionTime <= endTime).all()

            # Generate a filename
            name = "log_{start}_to_{end}.csv".format(start = startTime[:10], end = endTime[:10])

            # Stream the response
            response = Response(
                generate_csv(query), 
                mimetype='text/csv', 
                headers={'Content-Disposition': f'attachment; filename={name}'})

            return response