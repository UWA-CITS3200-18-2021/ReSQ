#############################
#
# File for global functions
#
#############################
from app import db

# Enum tuples
enquiryType = ( 'Essay',
                'Grammar',
                'Lab Report',
                'Assignment',
                'Literature Research',
                'Research Proposal',
                'Thesis/Paper',
                'IELTS',
                'Oral Presentation',
                'Referencing',
                'Finding Sources',
                'Endnote',
                'Other')

queueType = (   'STUDYSmarter',
                'Librarian')

statusType = (  'Ended',
                'In Queue',
                'In Session',
                'Completed')
                
roleType = (    'Admin',
                'Student Helper')