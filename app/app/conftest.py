"""
This is a pytest specific file that is used to configure pytest.
Usually contains fixtures and setups
"""

import pytest

@pytest.fixture
def test_client():
    """
    This is fixture to instantiate a flask app via a testing client
    """
    from app import app

    # Create a test client using Flask application
    with app.test_client() as testing_client:
        with app.app_context():
            yield testing_client