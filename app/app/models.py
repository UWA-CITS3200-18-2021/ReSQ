from sqlalchemy.sql.expression import null
from app import db, login_manager
from app.globals import enquiryType, queueType, statusType, roleType
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Enum, DateTime, Text
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash

# Checking Types
from sqlalchemy.orm.attributes import InstrumentedAttribute
import types

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


# Queue model for db

class Queue(BaseModel):

    id = Column(Integer, primary_key=True)
    studentName = Column(String(64), nullable=False)
    studentNumber = Column(Integer, nullable=False)
    unitCode = Column(String(8), nullable=False)
    enquiry = Column(Text, nullable=False)
    queue = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    enterQueueTime = Column(DateTime, nullable=False)
    changeSessionTime = Column(DateTime)
    exitSessionTime = Column(DateTime)

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

    @validates('studentNumber')
    def validate_studentNumber(self, key, studentNumber):
        if len(studentNumber) != 8:
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