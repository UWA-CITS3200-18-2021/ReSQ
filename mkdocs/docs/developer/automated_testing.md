# Automated Testing


## Unit Testing
Unit testing is created using [Pytest](https://docs.pytest.org/en/6.2.x/). Refer documentation closely to [Pytest-Flask](https://pytest-flask.readthedocs.io/en/latest/) for this project.

???+ info "conftest"
    `conftest.py` are a special file for pytest that is automatically loaded by pytest and typically contans fixtures and other setup code.

???+ info "Docker Container Running"
    Make sure that you are running the docker container before doing any testing.
### How to run unit tests?
Use the docker remote code execution

```bash
docker exec -it resq_app pytest
```

or if you want to generate the coverage data

```bash
docker exec -it resq_app coverage run --source="." --rcfile=.coveragerc -m pytest
```

???+ info "Coverage File"
    This will produce a file called `.coverage` that contains the records and can be converted to reports.

???+ info "Allure Results"
    Whenever you are running this tests, it will produce a folder called `test_results` that will contain results of the test. Refer below for more information about Allure.
#### How to get coverage report?
If you've run the tests using the above command and have `.coverage` file, you can generate the reports in multiple ways. More information in [here](https://coverage.readthedocs.io/en/6.0.2/).

```bash
coverate report -m
```
will print the coverage report in the terminal.

```bash
coverage html
```
for the html report.

???+ info "What is `.coveragerc` file?"
    This file contains the configurations for the coverage testing.

### Unit Testing in Pipelines
This was part of [#12](https://github.com/UWA-CITS3200-18-2021/ReSQ/issues/12), but was cut out of scope. Some artefacts of the code can be seen here.

One particular one is the docker `runtime.sh` that can accomodate a `APP_ENV=UNIT_TESTS` to only run unit tests inside the docker.

## Allure Report Generator
Allure Testing report is used as a tool to generate test report. More information here https://docs.qameta.io/allure/

This repo has a file called `send_and_generate.py`. It is a simple script that sends a test report to Allure and generates a report. This is currently integrated with the [UWA System Health Lab Allure Setup](https://allure.systemhealthlab.com/). Documentation can be seen [here](https://uwasystemhealth.github.io/allure_shl_setup/).