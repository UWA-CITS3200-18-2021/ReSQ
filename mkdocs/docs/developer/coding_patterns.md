# Coding Patterns

## Casing
This codebase will be using camel casing.

## Linters / Formatters
This will automatically format your code if you install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) in VS Code or type `yarn lint` in the specific folders.

Make sure you have installed the devDependencies so additional linters can be used.

## Github Issues and Pull Requests
Most changes in the codebase can be matched to a github issue that contains description of the work that needs to be done. Each of the pull request are matched to this github issue with the branch name that has a standard `c{Issue Number}-{branch name}`. The issue number allows referencing especially when resolving reason for change.

## Development with Docker
The development is done with Docker to orchestrate multiple services as defined in the `docker-compose.yml` file:

- Documentation at localhost:8001