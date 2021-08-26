# ReSQ

### Back-end

The website is run using a flask server. Flask is a micro framework for the backend of the website. Jinja is used inside the HTML so the display can adapt to server data as well as for running loops. Users and test attempts are saved inside a SQLite database. The username, password, and scores of the user are saved so progress can be encouraged.

## Development

Make a virtual environment:
On Mac:

```
$ python3 -m venv venv
$ source venv/bin/activate
```

And make sure all packages are up to date:

```
(venv) $ pip3 install -r requirements.txt
```

The HTML pages are inside ReSQ/app/templates and the CSS/Javascript are in Website/app/static. Both can be altered to change the function and look of the website.
The main.py and config.py will not need to be changed as they are simply running the flask and SQLite.
To change backend database management edit Wesbite/app/models.py.

## Deployment

```
$ pip3 install -r requirements.txt
$ python3 main.py
```

This will install the needed packages and start the server at http://127.0.0.1:5000/

## Running Tests

### Unit Test

Open the root directory

```
$ pip3 install -r requirements.txt
$ python tests.py
```

## Authors

- Jordan Hartley
- Liam Hovell
- Frinze Lapuz
- Alex Hoffman
- Alex Mai
- Jake Yendell

## References

Albert Einstein photo ref: MPI/Getty Images
Diagrams by Jasper Paterson and Simon Dransfield
Background art by Jordan Hartley
