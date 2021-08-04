# Requirements

## Acronyms, Abbreviations and Definitions

* UWA: The University of Western Australia 
## Aim and Scope


## Requirements

### Stage 1 Functional Requirements 
The following are the core functional requirements for the first stage application


#### Users


### Stage 2 Functional Requirements 


### "Nice to have"
Some of the "nice to haves" of this project will be covered in this requirements documents. Howevever, "nice to haves" usually will come along as the users of the system see fit. This will be documented in the [Issue Tracking Management sytem](https://github.com/UWA-CITS3200-18-2021/cits3200-project/issues) of the code repository.

### Non-functional Requirements

| Identifier    | Name          | Description |
| :---          | :---          | :---        |
| NFR1          | Security      | Only authenticated and authorised users should be able to perform actions such as adding equipment, updating equipment location and information, or searching for specific equipment.|
| NFR2          | Performance   | The loading time should not hinder the user experience and productivity of the user in the website. The **page/actions** should have a loading time < 5 seconds on most computing environments on standard internet connections**|
| NFR3          | Maintainable and extensible  | The website should be relatively easy to update and extended to accomodate for new contexts. |
| NFR4          | Recoverable   | In the event of the web server or database server crashing, all stored data should be fully recoverable. |
| NFR5          | Intuitive user interface  | The website should have an intuitive / easy-to-use user interface, so that users will be able to easily use the website and update the equipment database |
| NFR6           | Compatibility | The application should be compatible with recent versions of the major browsers (Safari, Chrome, Firefox and Edge) on laptop and desktop computers |
| NFR7           | Deployability | The application should be compatible with deployment in the SHL VPS |

## Proposed Solution
The proposed solution is to build a custom web application that will encompass and satisfy the requirements (by completing the suggested "ideal solution" as per the [Aim and Scope](#aim-and-scope)).

Some research for existing design solution has been done for this project see [Appendix: Existing Design Solution](#existing-design-solutions). The beauty of custom web application for the team is that it upskills the current software engineers as aligned in the purpose of this unit, and the high possibility of extending application depending on the requirements without being constrained with the bulk of codebase of other unmaintained opensource projects. Comparatively to enterprise systems, most enterprise systems will charge per users that use the system, this easily becomes expensive because the amount of users that will use the system should be able to accomodate the number of users that are interested in looking for the assets.
### Core Technologies 

The custom web application will aim to satisfy all the requirements in here along with the "Nice to haves" as they come up. The application will be built using the ...

The authentication system will be outsourced to the UWA Pheme Authentication API to allow any users in with a UWA Pheme account to login.

#### Docker
Docker is a deployment technology that allows virtualization in a server to allow the packaging of software into containers for deployment. To satisfy NFR7 - Deployability, the web platform will use docker to allow the deployment through the SHL VPS Server.

Furthermore, Docker will be used for orchestration of different services in development to increase speed of development, and reduce inconsistency between developers devices (NFR3 - Maintainable and extensible).

#### Code Quality
The code quality will be ensured by peer reviews between the developers in the team.
#### Code Storage and Development Control
Git source control will be used, using the remote UWA System Health Lab organisational GitHub (NFR3 - Maintenace and Extensibility).

### Prototype
See the Prototype mentioned in [Figma Interface Prototype](../developer/frontend/figma_interface_prototype.md)

### Execution Team
The development of the web platform will be performed by 

## Development and Methodology
As per the staged requirement, majority of the development will take place on the stage 1 whereas stage 2 are feature-based requirements for the syste,.



## Appendix

### Existing Design Solutions
Some of the design solutions that have been considered with great detail and justification are here.
