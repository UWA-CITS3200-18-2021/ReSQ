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
if [ "${APP_ENV^^}" != "UNIT_TESTS" ]; then
    # Running this in CI will cost us a lot of time, so we'll skip this check
    export DATABASE_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_URL:$POSTGRES_PORT/$POSTGRES_DB
    printf "\n" && echo "Checking Database is UP at $DATABASE_URL" | boxes -d shell -p a1l2
    until psql $DATABASE_URL -c '\l'; do
    >&2 echo "Postgres is unavailable - sleeping"
    sleep 1
    done
    >&2 echo "Postgres is up - continuing" && figlet "Postgres is up"
fi


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

# ==============
# Run Unit Tests
# ==============
if [ "${APP_ENV^^}" = "UNIT_TESTS" ]; then
    printf "\n" && echo "Running Unit Tests" | boxes -d shell -p a1l2

    # Install extra non-prod packages
    printf "\n" && echo "Installing dev dependencies for $APP_ENV" | boxes -d shell -p a1l2
    pip install -r requirements.txt

    # Clean test results directory
    export ALLURE_RESULTS_DIRECTORY="/app_code/test_results"
    printf "\n" && echo "Cleaning test results directory $ALLURE_RESULTS_DIRECTORY" | boxes -d shell -p a1l2
    rm -rf $ALLURE_RESULTS_DIRECTORY
    mkdir $ALLURE_RESULTS_DIRECTORY

    # Execute tests
    printf "\n" && echo "Running Unit tests" | boxes -d shell -p a1l2
    coverage run --source='.' --rcfile=.coveragerc -m pytest --alluredir=./test_results
    
    # Set a variable to the exit status code of the last command
    EXIT_CODE_TEST="$?"

    # Create environment file
    cd $ALLURE_RESULTS_DIRECTORY
    printf "APP_ENV=$APP_ENV\nTYPE=UNIT_TESTS" > environment.properties

    # Send results to the configured allure server
    cd /app_code
    python send_and_generate.py -project_id resq-unit-tests -app_env $APP_ENV -allure_username $ALLURE_USER -allure_password $ALLURE_PASSWORD -allure_server $ALLURE_API_SERVER -allure_results_path $ALLURE_RESULTS_DIRECTORY -allure_execution_name github -allure_execution_type github

    coverage report  # Show coverage results in log output
    coverage html -d /app_code/coverage_html_report  # Gen a html report

    printf "\n" && echo "UNIT TESTS COMPLETED" | boxes -d shell -p a1l2
    exit EXIT_CODE_TEST
fi

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



