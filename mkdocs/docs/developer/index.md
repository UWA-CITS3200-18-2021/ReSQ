# Technical Documentation for Developer

## Application
The website is run using a flask server. Flask is a micro framework for the backend of the website. Jinja is used inside the HTML so the display can adapt to server data as well as for running loops. Users and test attempts are saved inside a SQLite database. The username, password, and scores of the user are saved so progress can be encouraged.

## Development Workflow
This project uses docker to orchestrate multiple services. Make sure to install docker, see [here](https://docs.docker.com/get-docker/) for documentation.

Once you have it installed do the following:

### Environment Variables: Create the `.env` file
There is a file called `template.env`. This contains all the configurations for the entire application for database, flask app, and pgadmin. Copy this to `.env` (you have to create this file).

### Run the Docker-Compose
Run the following command
```bash
docker-compose up
```

This one command will build all the containers. Most notably this will create the Flask Application with pip installation, and database migration to PostgreSQL.

???+ note "Rebuilding containers"
    If you do need to build containers, run the following:
    ```bash
    docker-compose up --build
    ```

### Going inside the container / Remote Code Execution
Most likely you will be developing inside this container such as doing pip installation and other commands. You can do remote code execution to the container using the following command
```bash
docker exec -it resq_app bash
```

This will allow you to connect to the container and do whatever command that pleases you.