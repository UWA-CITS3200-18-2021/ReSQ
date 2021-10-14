import os
import requests
import json
import base64
import argparse

parser = argparse.ArgumentParser()
parser.add_argument(
    "-project_id",
    help="The name of the project in Allure",
    type=str
)
parser.add_argument(
    "-app_env",
    nargs='?',
    help="App environment",
    type=str
)
parser.add_argument(
    "-allure_username",
    nargs='?',
    default="admin",
    help="Allure Username",
    type=str
)
parser.add_argument(
    "-allure_password",
    nargs='?',
    default="Password123",
    help="Allure Password",
    type=str
)
parser.add_argument(
    "-allure_server",
    nargs='?',
    default="http://localhost:5050",
    help="Allure Server",
    type=str
)
parser.add_argument(
    "-allure_results_path",
    nargs='?',
    default="/test_results",
    help="Allure Results Path (Where are the test result (json) files are)",
    type=str
)
parser.add_argument(
    "-allure_execution_name",
    nargs='?',
    default="Script",
    help="The name that is shown as the executor of the report",
    type=str
)
# parser.add_argument(
#     "-allure_execution_from",
#     nargs='?',
#     default="",
#     help="The name of the site/system/area that generated the test results",
#     type=str
# )
parser.add_argument(
    "-allure_execution_type",
    nargs='?',
    default="bamboo",
    help="Type of CI/CD system used. Options are: bamboo, github, jenkins, gitlab, teamcity",
    type=str
)
args = parser.parse_args()

print("-------Debug: Printing command arguments-------")
print(args)

"""
Usage:

python send_and_generate.py -project_id $PROJECT_ID -app_env $APP_ENV -allure_username $ALLURE_USER -allure_password $ALLURE_PASSWORD -allure_server
$ALLURE_API_SERVER -allure_results_path $ALLURE_RESULTS_PATH -allure_execution_name $ALLURE_EXECUTION_NAME -allure_execution_from
$ALLURE_EXECUTION_FROM -allure_execution_type $ALLURE_EXECUTION_TYPE
"""

# This directory is where you have all your results locally, generally named as `allure-results`
allure_results_directory = args.allure_results_path  # '/allure-results-example'

# This url is where the Allure container is deployed. We are using localhost as example
allure_server = args.allure_server  # 'http://localhost:5050'

# Project ID according to existent projects in your Allure container - Check endpoint for project creation >> `[POST]/projects`
project_id = f'{args.project_id}'.lower() 

# Set security_user & security_password according to Allure container configuration
security_user = args.allure_username 
security_password = args.allure_password

# =======================================================================================================================
# Collect Test Results
# =======================================================================================================================
results_directory = allure_results_directory
print("\n\n\n\n\n\n")
print('RESULTS DIRECTORY PATH: ' + results_directory)

files = os.listdir(results_directory)

print('')
print('Test result files to be processed:')
results = []
for file in files:
    result = {}

    file_path = results_directory + "/" + file
    print(file_path)

    if os.path.isfile(file_path):
        try:
            with open(file_path, "rb") as f:
                content = f.read()
                if content.strip():
                    b64_content = base64.b64encode(content)
                    result['file_name'] = file
                    result['content_base64'] = b64_content.decode('UTF-8')
                    results.append(result)
                else:
                    print(f'Empty File skipped: {file_path}')
        finally:
            f.close()
    else:
        print(f'Directory skipped: {file_path}')

headers = {'Content-type': 'application/json'}
request_body = {
    "results": results
}
json_request_body = json.dumps(request_body)

ssl_verification = True

# =======================================================================================================================
# Login to Allure
# =======================================================================================================================
print("\n\n\n\n\n\n")
print("------------------LOGIN-----------------")
credentials_body = {
    "username": security_user,
    "password": security_password
}
json_credentials_body = json.dumps(credentials_body)

session = requests.Session()
url = f'{allure_server}/allure-docker-service/login'
print(f'URL Used: {url}')
response = session.post(url, headers=headers, data=json_credentials_body, verify=ssl_verification)

print(f'STATUS CODE: {response.status_code}')
print("RESPONSE COOKIES:")
json_prettier_response_body = json.dumps(session.cookies.get_dict(), indent=4, sort_keys=True)
print(json_prettier_response_body)
csrf_access_token = session.cookies['csrf_access_token']
print("CSRF-ACCESS-TOKEN: " + csrf_access_token)

# =======================================================================================================================
# Check or create Allure Project ID
# =======================================================================================================================
print("\n\n\n\n\n\n")
print("------------------CHECK-OR-CREATE-PROJECT_ID------------------")
headers['X-CSRF-TOKEN'] = csrf_access_token
url = f'{allure_server}/allure-docker-service/projects/{project_id}'
response = session.get(url, headers=headers, verify=ssl_verification)

print(f'STATUS CODE: {response.status_code}')
print("RESPONSE:")
print(json.loads(response.content))

# Project does not exist, let's create it
if response.status_code == 404:
    print("")
    print("------------------CREATING-PROJECT_ID------------------")
    url = f'{allure_server}/allure-docker-service/projects'
    payload = {
        "id": project_id
    }

    response = session.post(url, headers=headers, json=payload, verify=ssl_verification)

    print(f'STATUS CODE: {response.status_code}')
    print("RESPONSE:")
    print(json.loads(response.content))

    if response.status_code not in [200, 201]:
        exit()

# =======================================================================================================================
# Send Results
# =======================================================================================================================
print("\n\n\n\n\n\n")
print("------------------SEND-RESULTS------------------")
headers['X-CSRF-TOKEN'] = csrf_access_token
url = f'{allure_server}/allure-docker-service/send-results?project_id={project_id}'
print(f'URL Used: {url}')
response = session.post(url, headers=headers, data=json_request_body, verify=ssl_verification)
print(f'STATUS CODE: {response.status_code}')

print("RESPONSE:")
json_response_body = json.loads(response.content)
json_prettier_response_body = json.dumps(json_response_body, indent=4, sort_keys=True)
print(json_prettier_response_body)

# =======================================================================================================================
# Generate Report
# =======================================================================================================================
# If you want to generate reports on demand use the endpoint `GET /generate-report` and disable the
# Automatic Execution >> `CHECK_RESULTS_EVERY_SECONDS: NONE`
print("\n\n\n\n\n\n")
print("------------------GENERATE-REPORT------------------")
execution_name = args.allure_execution_name
# execution_from = args.allure_execution_from
execution_type = args.allure_execution_type

# url = f'{allure_server}/allure-docker-service/generate-report?project_id={project_id}&execution_name={execution_name}&' \
#       f'execution_from={execution_from}&execution_type={execution_type}'
url = f'{allure_server}/allure-docker-service/generate-report?project_id={project_id}&execution_name={execution_name}&' \
      f'&execution_type={execution_type}'
print(f'URL Used: {url}')
response = session.get(url, headers=headers, verify=ssl_verification)
print(f'STATUS CODE: {response.status_code}')

print("RESPONSE:")
json_response_body = json.loads(response.content)
json_prettier_response_body = json.dumps(json_response_body, indent=4, sort_keys=True)
print(json_prettier_response_body)
print('ALLURE REPORT URL:')
print(json_response_body['data']['report_url'])

# =======================================================================================================================
# Clean Results
# =======================================================================================================================
print("\n\n\n\n\n\n")
print("------------------CLEAN-RESULTS------------------")

url = f'{allure_server}/allure-docker-service/clean-results?project_id={project_id}'
print(f'URL Used: {url}')
response = session.get(url, headers=headers, verify=ssl_verification)
print(f'STATUS CODE: {response.status_code}')

print("RESPONSE:")
json_response_body = json.loads(response.content)
json_prettier_response_body = json.dumps(json_response_body, indent=4, sort_keys=True)
print(json_prettier_response_body)
