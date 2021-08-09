# Technical Documentation for Developer
The proof of concept is built with Meteor JS.

To start the proof of concept and all service, make sure that you have docker installed (preferrably in Linux or Mac).

Run `docker-compose up`, it should get all the services up and running:

- documentation at http://localhost:8001
- Database administration at http://localhost:27001
- Mongo Database at http://localhost:27018
- Meteor App at http://localhost:8002

???+ info "Why is it taking so long?"
    When you boot it for **the first time**, the application will do a couple of things:
    - install packages
    - update some stuff?
    - create build files
    - serve content

    Give it around 10 minutes, it should serve something after that.