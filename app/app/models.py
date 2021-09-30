from datetime import datetime

from sqlalchemy.sql.expression import null
from app import db, login_manager
from app.globals import enquiryType, queueType, statusType, roleType, invalidChar
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Enum, DateTime, Text
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash

# Checking Types
from sqlalchemy.orm.attributes import InstrumentedAttribute
import types

# User table
class BaseModel(db.Model):

    __abstract__ = True

    def to_dict(self):
        classVars = vars(type(self))  # get any "default" attrs defined at the class level
        instanceVars = vars(self)  # get any attrs defined on the instance (self)
        allVars = dict(classVars)
        allVars.update(instanceVars)
        # filter out private attributes, functions and SQL_Alchemy references
        publicVars = {key: value for key, value in allVars.items() if not (key.startswith('_') or (
            isinstance(value, types.FunctionType)) or (isinstance(value, InstrumentedAttribute)))}
        return publicVars


class User(BaseModel, UserMixin):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    username = Column(String(64), index=True, unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    role = Column(Text, nullable=False)

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @validates
    def validate_role(self, key, role):
        if role not in roleType:
            raise ValueError("Invalid roleType")
        else:
            return role

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


class QueueBaseModel(BaseModel):
    """
    This is an abstract/imaginary class that is used to inherit properties of a Queue based class
    """
    __abstract__ = True

    studentName = Column(String(64), nullable=False)
    studentNumber = Column(Integer, nullable=False)
    unitCode = Column(String(8), nullable=False)
    enquiry = Column(Text, nullable=False)
    queue = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    enterQueueTime = Column(DateTime, nullable=False)
    changeSessionTime = Column(DateTime)
    exitSessionTime = Column(DateTime)

    @validates('studentName')
    def validates_studentName(self, key, studentName):
        for c in studentName:
            if c.isnumeric() or c in invalidChar:
                raise ValueError("Invalid character in studentName")

        return studentName

    @validates('studentNumber')
    def validate_studentNumber(self, key, studentNumber):
        if len(str(studentNumber)) != 8:
            raise ValueError("studentNumber must be 8 digits")
        return int(studentNumber)

    @validates('unitCode')
    def validate_unitCode(self, key, unitCode):
        for i, c in enumerate(unitCode):
            if (i < 4 and not (c.isupper() or c.islower())) or (i >= 4 and not c.isnumeric()):
                raise ValueError("unitCode must be of the form CCCCNNNN")
        return unitCode

    @validates('enquiry')
    def validate_enquiry(self, key, enquiry):
        if enquiry not in enquiryType:
            raise ValueError('Enquiry is an invalid type')
        else:
            return enquiry

    @validates('queue')
    def validate_queue(self, key, queue):
        if queue not in queueType:
            raise ValueError('Enquiry is an invalid type')
        else:
            return queue

    @validates('status')
    def validate_status(self, key, status):
        if status not in statusType:
            raise ValueError('Enquiry is an invalid type')
        else:
            return status
class Queue(QueueBaseModel):
    # Queue model for db

    id = Column(Integer, primary_key=True)

    def __init__(self, studentName, studentNumber, unitCode, enquiry, queue, status, enterQueueTime):
        self.studentName = studentName
        self.studentNumber = studentNumber
        self.unitCode = unitCode
        self.enquiry = enquiry
        self.queue = queue
        self.status = status
        self.enterQueueTime = enterQueueTime

    def __repr__(self):
        return f"<Queue #{self.id}{{Name: {self.studentName}, ID: {self.studentNumber}, Unit: {self.unitCode}, Enquiry: {self.enquiry}, Queue: {self.queue}>"



class QueueEventLog(QueueBaseModel):
    # QueueEventLog model for db

    id = Column(Integer, primary_key=True)

    # Useful for determining which groups of logs belong to 1 session
    queue_session_id = Column(Integer, nullable=False)
    log_date = Column(DateTime, nullable=False)

    def __init__(self, queue_entry):
        # Below are replicate / duplicates of the Queue attributes (From inherit QueueBaseModel)
        self.studentName = queue_entry.studentName
        self.studentNumber = queue_entry.studentNumber
        self.unitCode = queue_entry.unitCode
        self.enquiry = queue_entry.enquiry
        self.queue = queue_entry.queue
        self.status = queue_entry.status
        self.enterQueueTime = queue_entry.enterQueueTime
        self.changeSessionTime = queue_entry.changeSessionTime
        self.exitSessionTime = queue_entry.exitSessionTime

        # Below are specific to event logs
        self.log_date =  datetime.now()
        self.queue_session_id = queue_entry.id

    def __repr__(self):
        return f"<QueueEventLog #{self.id}{{Name: {self.studentName}, ID: {self.studentNumber}, Unit: {self.unitCode}, Enquiry: {self.enquiry}, Queue: {self.queue}>"