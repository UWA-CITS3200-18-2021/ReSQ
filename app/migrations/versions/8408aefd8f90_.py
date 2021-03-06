"""empty message

Revision ID: 8408aefd8f90
Revises: 097d6eedce34
Create Date: 2021-09-21 04:58:27.495271

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8408aefd8f90'
down_revision = '097d6eedce34'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('queue', 'enquiry',
               existing_type=postgresql.ENUM('Essay', 'Grammer', 'Lab Report', 'Assignment', 'Literature Research', 'Resaerch Proposal', 'Thesis/Paper', 'IELTS', 'Oral Presentation', 'Referencing', 'Finding Sources', 'Endnote', 'Other', name='enquiryType'),
               type_=sa.Text(),
               existing_nullable=False)
    op.alter_column('queue', 'queue',
               existing_type=postgresql.ENUM('STUDYSmarter', 'Librarian', name='queueType'),
               type_=sa.Text(),
               existing_nullable=False)
    op.alter_column('queue', 'status',
               existing_type=postgresql.ENUM('Ended', 'In Queue', 'In Session', 'Completed', name='statusEnum'),
               type_=sa.Text(),
               existing_nullable=False)
    op.alter_column('user', 'role',
               existing_type=postgresql.ENUM('Admin', 'Student Helper', name='roleEnum'),
               type_=sa.Text(),
               existing_nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'role',
               existing_type=sa.Text(),
               type_=postgresql.ENUM('Admin', 'Student Helper', name='roleEnum'),
               existing_nullable=False)
    op.alter_column('queue', 'status',
               existing_type=sa.Text(),
               type_=postgresql.ENUM('Ended', 'In Queue', 'In Session', 'Completed', name='statusEnum'),
               existing_nullable=False)
    op.alter_column('queue', 'queue',
               existing_type=sa.Text(),
               type_=postgresql.ENUM('STUDYSmarter', 'Librarian', name='queueType'),
               existing_nullable=False)
    op.alter_column('queue', 'enquiry',
               existing_type=sa.Text(),
               type_=postgresql.ENUM('Essay', 'Grammer', 'Lab Report', 'Assignment', 'Literature Research', 'Resaerch Proposal', 'Thesis/Paper', 'IELTS', 'Oral Presentation', 'Referencing', 'Finding Sources', 'Endnote', 'Other', name='enquiryType'),
               existing_nullable=False)
    # ### end Alembic commands ###
