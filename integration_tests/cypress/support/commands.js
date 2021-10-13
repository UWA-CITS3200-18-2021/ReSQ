// Add commands here for Cypress command functions

import { login } from './commands/common.js';
import { addStudentToQueue } from './commands/queue.js';

Cypress.Commands.add("login", login);
Cypress.Commands.add("addStudentToQueue", addStudentToQueue);