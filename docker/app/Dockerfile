
# ===================================
# ---- Executed at Image Build ----
# ===================================
FROM python:3.9.5-slim-buster

WORKDIR /app_code

# Install Dependencies
# `rm -rf /var/lib/apt/lists/*` -> Remove cache to make image smaller
RUN apt-get update && apt-get install --yes --no-install-recommends figlet=2.2.5-3 boxes curl postgresql-client-11 g++ libssl-dev gcc && rm -rf /var/lib/apt/lists/*

# Update pip and install poetry
RUN pip install --upgrade pip

# Copy application code into a directory called 'app_code'
COPY ./app /app_code/

# Install Dependencies for the project
RUN pip install -r requirements.txt

# Copy runtime script & make it executable
COPY /docker/app/runtime.sh /runtime.sh
RUN chmod +x /runtime.sh

# Generate a timestamp of when this image was created for display in the logs / as the container comes up. Used as a sanity check.
RUN touch /app_code/build_timestamp.txt
RUN date > /app_code/build_timestamp.txt && cat /app_code/build_timestamp.txt

# Add command aliases
RUN echo 'alias run-flake8="flake8 --max-line-length 150 --exclude=*/migrations/* --ignore=F405,F403"' >> ~/.bashrc

RUN figlet RESQ - FLASK

# ========================================
# ---- Executed at Container Runtime ----
# ========================================

# CMD commands get executed at container runtime!
CMD ["/runtime.sh"]
