#############################
#
# File for global functions
#
#############################
from app import db

# Enum tuples
enquiryType = ( 'Essay',
                'Grammer',
                'Lab Report',
                'Assignment',
                'Literature Research',
                'Resaerch Proposal',
                'Thesis/Paper',
                'IELTS',
                'Oral Presentation',
                'Referencing',
                'Finding Sources',
                'Endnote',
                'Other')

queueType = (   'STUDYSmarter',
                'Librarians',
                'In Session',
                'Ended',
                'Completed')

# Check if the requested change in the database is valid
def isChangeValid(status, dest):
    if status == dest:
        return False
    elif status == 'Ended':
        if dest in ('Completed', 'In Session'):
            return False
    elif status in ('STDUYSmarter', 'Librarians'):
        if dest not in ('Ended', 'In Session'):
            return False
    elif status == 'In Session':
        if dest == 'Ended':
            return False
    elif status == 'Completed':
        if dest != 'In Session':
            return False
    return True