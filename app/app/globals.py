#############################
#
# File for global functions
#
#############################
from app import db

# Invalid charcters for database entries
invalidChar = ( "\0",
                "\b",
                "\n",
                "\r",
                "\t",
                "\Z",
                "\\",
                "\%",
                "\_")

queueType = (   'STUDYSmarter',
                'Librarian')

statusType = (  'Ended',
                'In Queue',
                'In Session',
                'Completed')
                
roleType = (    'Admin',
                'Student Helper')