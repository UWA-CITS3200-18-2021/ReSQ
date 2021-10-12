from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from . import db
import os

auth = Blueprint('auth', __name__)

# To get admin username and password
basedir = os.path.abspath(os.path.dirname(__file__))
admin_username = os.environ.get('ADMIN_USERNAME')
admin_password = os.environ.get('ADMIN_PASSWORD')

def changed_admin_login():
    db.session.query(User).delete()
    db.session.commit()
    new_user = User(username=admin_username, role="Admin")
    new_user.set_password(admin_password)
    db.session.add(new_user)
    db.session.commit()

@auth.route('/login', methods=['GET', 'POST'])
def admin_login():
    admin = User.query.filter_by(username=admin_username).first()
    # If admin name/password changed delete previous admin user 
    if (admin and not admin.check_password(admin_password)) or not admin:
        changed_admin_login()
        
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user:
            if user.check_password(password):
                flash("Logged in successfully! Hello " + user.username, category="success")
                login_user(user, remember=True)
                return redirect(url_for('routes.home'))
            else:
                flash("Incorrect username or password, please try again.", category="error")
        else:
            flash("Incorrect username or password, please try again.", category="error")

    return render_template('login.html', user=current_user)


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('routes.home'))
