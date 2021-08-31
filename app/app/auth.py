from flask import Blueprint, render_template, request, redirect, url_for, flash
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user

MIN_USERNAME_LENGTH = 4
MIN_PASSWORD_LENGTH = 7

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user:
            if user.check_password(password):
                flash("Logged in successfully! Hello " + user.username, category="success")
                login_user(user, remember=True)
                return redirect(url_for('routes.learn'))
            else:
                flash("Incorrect password, try again.", category="error")
        else:
            flash("User does not exist", category="error")

    return render_template('login.html', user=current_user)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('routes.home'))
