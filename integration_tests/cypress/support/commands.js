// Add commands here for Cypress command functions

import { login } from './commands/common.js';

Cypress.Commands.add("login", login);