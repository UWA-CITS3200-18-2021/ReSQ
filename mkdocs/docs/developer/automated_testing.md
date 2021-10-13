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

## Integration Testing
The integration tests are created with [Cypress](https://www.cypress.io/). This integration testing allows us to create frontend tests and obtain video or screenshots that can improve the quality of the test.
### Running Tests Via Cypress IDE

???+ info "Installment Prerequisite"
    
    1. Install [Nodejs](https://nodejs.org/en/download/) and NPM (should be automatically installed with Nodejs).
    2. Go to `integration_tests` folder and do `npm install`. That is going to install your `package.json` packages.

1. In one terminal, run `docker-compose up` for running application.
2. Without closing terminal opened in 1), open a new terminal and go to `/integration_tests` and:
    - Run `yarn run cypress:open` or
    - Run `npm run cypress:open`

Note that by using this, the Cypress IDE will be running outside the docker container.

### Configuring Cypress

Cypress configuration can be adjusted in the `cypress.json` file. If you want to define global varibles, this is the place to do it.
Global variables can be used in the code with `Cypress.env('VAR')`.

More information can be seen in the official docs https://docs.cypress.io/guides/references/configuration

### Writing Tests

There are 2 ways to create tests:

1. By writing code tests, see [Writing Test](https://docs.cypress.io/guides/getting-started/writing-your-first-test#Write-your-first-test)
2. Or by using the [Cypress Studio](https://docs.cypress.io/guides/core-concepts/cypress-studio)

Cypress studio makes it easy to create test by recording the user action through the Cypress IDE. Upon action of the user, Cypress studio writes codes in the tests which could be adjusted later for flexibility.

???+ info "To use Cypress Studio Test Creation"

    Firstly, you need a test suite ends with `.spec.js` in the `integration_tests/cypress/integration` folder (either newly created from a test template or existing test).

    ??? example "Test Template"
        ```js
        describe('Test Suite', () => {
        beforeEach(() => {
            // Setup Scripts Here
        })

        it('Test Name', () => {
            // Extend test with Cypress Studio
        })
        })
        ```

    1. Select a test suite in the Cypress IDE to extend
    2. Hover on the test, and click the "magic wand" icon near the test
    3. Interact with the Cypress Web interface as if you are the test runner
    4. Save the test when you are done
    5. Modify the tests created by Cypress IDE as you need

    ???+ faq "Magic Wand Icon"
        ![Magic Wand Icon](/images/developers/integration_testing/magic_wand.png)


### Test files and directory organization

All test specs are located in `integration_tests/cypress/integration`. We recomend follow an structure by feature. 

In `integration_tests/cypress/support` you can write reusable pieces of code for execute in all your tests with [commands](https://docs.cypress.io/api/cypress-api/custom-commands).

### Test Results

Results after tests suite finished are stored in the following folders:

- `integration_tests/cypress/screenshots`: Screenshots generated by cypress
- `integration_tests/cypress/videos`: Videos generated by cypress
- `integration_tests/cypress/results`: Allure formatted results

### Allure Integration with Cypress

Cypress test runner has installed an allure plugin which is used to generate tests results with allure format.

- [Documentation](https://github.com/Shelex/cypress-allure-plugin)
