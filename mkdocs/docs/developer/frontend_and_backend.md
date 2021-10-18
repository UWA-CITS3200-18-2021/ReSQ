# Frontend and Backend Technical Documentation
The web application can be mainly be divided into two sides: frontend or also known as client-side application, an application that runs inside the browser of the user, backend or also known as server-side application, an application that is connected with a database to facilitate data validation, transformation, and storage.

The choice of a hybrid approach is deemed to be appropriate to get the best of both worlds.

- Client-side application with AJAX allows the user of the website to have a better user experience with minimal latency when using the application. In other words, this is also known as client-side rendering as it allows the generation of the frontend dynamically without reloading.
- Server-side application allows processing of the HTTP requests, but also generates a simple starting user interface before the user interacts with the application.

## Frontend
The relevant files for these section can be found at `app/app/static` for the assets (CSS + JS) and `app/app/templates` for the Jinja-HTML files.

### Frontend Rendering
The frontend is rendered using [Jinja2](https://flask.palletsprojects.com/en/2.0.x/templating/), the usual template engine for Flask.

### Frontend Design
The design of the website is from Material Dashboard, a boostrap template. The documentation for it can be seen [here](https://demos.creative-tim.com/material-dashboard/docs/2.1/getting-started/introduction.html?_ga=2.260700621.1915903068.1634569677-198175297.1611663559) with live demo [here](https://demos.creative-tim.com/material-dashboard/examples/dashboard.html).

This was chosen to accelerate the development of the project.

### Client-Side Interaction with AJAX
AJAX allows browsers to fetch data without reloading. Essentially, makes it a better user experience.

Notice the Javascript files in `app/app/static/custom`, these are the custom JS, and notice that each page in `app/app/templates` loads a particular JavaScript file.

### Frontend Routes
The frontend routes are defined in `routes.py`.

## Backend

### Database
The database is a PostgreSQL connected with the classic ORM for [Flask - SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/). With [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest/) for database migration (combo of SQL Alchemy and Alembic).

All the database models can be found in `models.py`, and database migration scripts at `migrations` folder.

???+ info "Docker Auto Migration"
    The docker `runtime.sh` is configured to do auto migration. If you need to do a reverse migration, or anything very custom, Please be prepared to read the [command reference](https://flask-migrate.readthedocs.io/en/latest/#command-reference).

### Application Programming Interface (API)
API is where the AJAX interaction points to. The api endpoinds are defined in `app/app/__init__.py`.

At the time of this writing, there are three main API endpoints:
- `queue` for the main operation of digital queue
- `export` for the exporting functionality
- `data` for the analytics page

See the individual files for more information about it.

## Application Configuration
The application configuration containing database information and encryption key setups can be fond in `config.py`.

This is just standard, nothing special or out of the ordinary.