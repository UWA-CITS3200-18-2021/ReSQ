from flask import Blueprint, request, jsonify

from app import db
from app.models import Queue

data = Blueprint('routes', __name__)
