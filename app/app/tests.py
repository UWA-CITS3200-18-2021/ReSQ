import pytest
import json
from datetime import datetime

from app.models import Queue
from app import db

"""
Test Utilities over here
"""


def generate_valid_queue_entry(**overrides):
    """
    This functions generate a valid queue entry.
    If you want to override the value, provide an object with the same property names
    """
    return {
        "studentName": "Frinze",
        "studentNumber": "22711649",
        "unitCode": "CITS3403",
        "queue": "STUDYSmarter",
        "enquiry": "Mathematics",
        **overrides
    }


def create_new_entry_in_queue(data):
    # Create a new entry in Queue
    new_entry = Queue(**data, status="In Queue", enterQueueTime=datetime.now())
    db.session.add(new_entry)
    db.session.commit()
    return new_entry


def test_unauthenticated_login_redirect(test_client):
    """
    GIVEN: An unauthenticated user
    WHEN: visiting the home page
    THEN: user redirects to login page (status code 302)
    """
    response = test_client.get('/')
    assert response.status_code == 302


def test_success_add_entry(test_client):
    """
    GIVEN: A valid entry
    WHEN: sent over to `/add_entry` endpoint
    THEN: A new entry can be seen in the database that matches the entry
    AND: Response status code 201 is sent
    """
    data = generate_valid_queue_entry()
    response = test_client.post("/add_entry",
                                data=json.dumps(data),
                                content_type='application/json')
    assert response.status_code == 201

    # Get last entry in Queue
    new_entry = Queue.query.order_by(Queue.id.desc()).first()

    # Check if the entry is the same as the one we sent
    assert new_entry.studentName == data["studentName"]
    assert new_entry.studentNumber == int(data["studentNumber"])
    assert new_entry.unitCode == data["unitCode"]
    assert new_entry.queue == data["queue"]
    assert new_entry.enquiry == data["enquiry"]


def test_failure_add_entry_400_keyerror(test_client):
    """
    GIVEN: An invalid entry that is mising a required attribute
    WHEN: sent over to `/add_entry` endpoint
    THEN: A 400 error is sent
    """
    data = generate_valid_queue_entry()
    del data["studentName"]  # Missing studentName setup
    response = test_client.post("/add_entry",
                                data=json.dumps(data),
                                content_type='application/json')
    assert response.status_code == 400


def test_failure_add_entry_400_mismatch_of_data_type(test_client):
    """
    GIVEN: An invalid entry that has studentNumber length more than 8
    WHEN: sent over to `/add_entry` endpoint
    THEN: A 400 error is sent
    """
    data = generate_valid_queue_entry()
    data["studentNumber"] = "227116499"  # length of 9
    response = test_client.post("/add_entry",
                                data=json.dumps(data),
                                content_type='application/json')
    assert response.status_code == 400


def test_failure_add_entry_500(mocker, test_client):
    """
    GIVEN: A malfunctioning system
    WHEN: a valdid data is sent over to `/add_entry` endpoint
    THEN: A 500 error is sent
    """
    # This will cause an error in the database
    mocker.patch("app.db.session.add", side_effect=Exception("Mock Exception"))

    data = generate_valid_queue_entry()
    response = test_client.post("/add_entry",
                                data=json.dumps(data),
                                content_type='application/json')
    assert response.status_code == 500


def test_success_update_entry(test_client):
    """
    GIVEN: An existing entry is in the database
    WHEN: it is updated with new values with `/update_entry/` endpoint
    THEN: The entry is updated
    AND: status code is 200
    """
    # Create a new entry in Queue
    data = generate_valid_queue_entry()
    new_entry = create_new_entry_in_queue(data)

    # Move the position of the entry
    data["status"] = "In Session"
    response = test_client.post(f"/update_entry/{new_entry.id}",
                                data=json.dumps(data),
                                content_type='application/json')

    # Check that the status has been updated
    assert response.status_code == 200
    assert Queue.query.get(new_entry.id).status == data["status"]


def test_get_queue(test_client):
    """
    GIVEN: An existing entry in the database
    WHEN: the endpoint `/get_queue` is hit
    THEN: it should contain the entry in the response
    """
    # Create a new entry in Queue
    data = generate_valid_queue_entry()
    new_entry = create_new_entry_in_queue(data)

    # Hit the endpoint
    response = test_client.post("/get_queue",
                                data=json.dumps({}),
                                content_type='application/json')

    # Check that the `queue` field contains the new_entry
    assert response.status_code == 200

    response_body = response.get_data(as_text=True)
    response_body = json.loads(response_body)
    ids_in_response_body = [entry["id"] for entry in response_body["queue"]]
    assert new_entry.id in ids_in_response_body
