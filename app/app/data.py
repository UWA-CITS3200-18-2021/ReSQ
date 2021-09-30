from flask import Flask, Blueprint, request, stream_with_context
from flask_login import login_required, current_user

from app import db
from app.models import Queue

import csv
from io import StringIO
from werkzeug.wrappers import Response


data = Blueprint('routes', __name__)

#Generate csv file from a dict
@stream_with_context
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
        w.writerow(row)
        yield data.getvalue()
        data.seek(0)
        data.truncate(0)

# Export to csv
@data.route('/analytics/get_data', methods=['POST'])
def download_data():
        body = request.get_json(force=True)
        
        if 'startTime' not in body:
            return {"message": f"Parameter startTime not in body"}, 400
        elif 'endTime' not in body:
            return {"message": f"Parameter endTime not in body"}, 400
        else:
            startTime = body['startTime']
            endTime = body['endTime']
            query = db.session.query(Queue).filter(Queue.enterQueueTime >= startTime, Queue.exitSessionTime <= endTime).all()
            print(query[1])

            # Stream the response
            response = Response(generate_csv(query), mimetype='text/csv')

            # Generate a filename
            name = "log_from_{start}_to_{end}.csv".format(start = startTime, end = endTime)
            response.headers.set("Content-Disposition", "attachment", filename=name)
            return response