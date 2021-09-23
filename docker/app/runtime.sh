#!/bin/bash

echo "████ FLASK CONTAINER STARTING... ████████████████████████████████████"

# Display Docker Image / CI / Release details
printf "\n" && echo "Image Build Date/Time: $(cat /app_code/build_timestamp.txt) UTC"| boxes -d shell -p a1l2

printf "\n" && figlet $APP_ENV && printf "\n"

# =========================
# Debug / Sanity check info
# =========================
printf "\n" && echo "Current Dir / Files (Debug)" | boxes -d shell -p a1l2
pwd
ls -al

printf "\n" && echo "Pip Freeze (Debug) " | boxes -d shell -p a1l2
pip freeze

printf "\n" && echo "Linux version (Debug)" | boxes -d shell -p a1l2
cat /etc/os-release

printf "\n" && echo "Python Path & Version (Debug)" | boxes -d shell -p a1l2
which python
python -V

# Check for required env vars, exit as failure if missing these critical env vars.
if [ -z "${APP_ENV}" ]; then
    echo "█████████████████████████████████████████████████████████████████████████████████████"
    echo "█ CRITICAL ERROR: Missing 'APP_ENV', environment variables.█"
    echo "█████████████████████████████████████████████████████████████████████████████████████"
    echo "APP_ENV=" $APP_ENV
    exit
fi

# ==================================================
# Wait until Database is available before continuing
# ==================================================
export DATABASE_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_URL:$POSTGRES_PORT/$POSTGRES_DB
printf "\n" && echo "Checking Database is UP at $DATABASE_URL" | boxes -d shell -p a1l2
until psql $DATABASE_URL -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - continuing" && figlet "Postgres is up"

# Flask make migrate and migrate database
printf "\n" && echo "Flask make migrate and migrate database" | boxes -d shell -p a1l2
export FLASK_APP=main.py
export FLASK_ENV=$APP_ENV

# Only useful for first run
flask db init

# Creates the migration
flask db migrate

# Runs the migration
flask db upgrade

# =========================================
# Run inbuilt FLASK server if ENV is DEVELOPMENT
# =========================================
if [ "${APP_ENV^^}" = "PRODUCTION" ]; then
    # Run Flask development server
    printf "\n" && echo "Running Flask Production Server" | boxes -d shell -p a1l2
    gunicorn main:app -b 0.0.0.0:5000 --workers=6 --keep-alive 20 --timeout 50
    exit
fi

# =========================================
# Run inbuilt FLASK server if ENV is DEVELOPMENT 
# =========================================
if [ "${APP_ENV^^}" != "DEVELOPMENT" ]; then
    printf "\n" && echo "Warning: Environment specified $APP_ENV is not recognise. Running development environment by default" | boxes -d shell -p a1l2
fi
# Install extra non-PRODUCTION packages
printf "\n" && echo "Installing dev dependencies for $APP_ENV" | boxes -d shell -p a1l2
pip install -r requirements.txt

# Run Flask development server
printf "\n" && echo "Running Flask Development Server" | boxes -d shell -p a1l2
export FLASK_DEBUG=1
flask run --host=0.0.0.0
exit



