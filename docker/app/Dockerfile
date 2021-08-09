FROM node:12

# SET WORKING DIRECTORY
WORKDIR /app_code

# Copy Application code into a directory called `app_code`
COPY ./app /app_code

# This lines are needed as per https://github.com/meteor/meteor/issues/4019 (Locale Time Setter)
# For the MongoDB in the Meteor App
# Based from https://stackoverflow.com/questions/28405902/how-to-set-the-locale-inside-a-debian-ubuntu-docker-container
RUN apt-get update
RUN apt-get install -y locales locales-all
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

# Install Meteor
# The version here has to match the version specified in `/app/.meteor/release`
RUN curl "https://install.meteor.com/?release=1.4.1" | sh
RUN meteor reset

# ========================================
# ---- Executed at Container Runtime ----
# ========================================

# CMD commands get executed at container runtime!
CMD ["meteor","run","--port","8080","--no-release-check"]
