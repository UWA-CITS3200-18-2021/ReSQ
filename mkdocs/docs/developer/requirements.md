# Requirements

## Acronyms, Abbreviations and Definitions

* UWA: The University of Western Australia 
* Tutor – The person that is providing service/help on a particular topic (eg. References, math and statistics, English)
* Student leader (SL) – the main point of contact of the student in need (SNS)
* SNS – Student in Need of Service – the person that requires help from a tutor
* STUDYSmarter – a service in UWA that is staffed with tutors and SNS come for help
* API – Application programming interface – an application that handles data requests for server-side processes
* Database – a place where data is stored
* SQL – Structured Query Language – used for building and interacting with databases
* HTML, CSS, JS – core web technologies that are used to build web interfaces
* Flask – a Python (an easy-to-use programming language) web framework that makes it easy to build APIs 
* VPS – Virtual Private Server is a virtual machine that runs as a server within a bigger set of services 

## Aim and Scope

UWAs STUDYSmarter and Library teams run a daily drop-in service in the Reid Library, 10am-12 noon, where students can drop in to receive one-on-one advice on writing, research, referencing, and study skills. The service is staffed each day by two STUDYSmarter learning advisers (writing and study skills enquiries), one librarian (research and referencing) and one student leader (reception and queue management). The student leader acts as the first point of contact for the service, triaging enquiries, inputting student data, and managing the queue flow. During peak periods, demand for the service is high, and long queues can form, creating a bottleneck for the service as the student leader must manage both new and waiting clients.  

The ideal system would be a software program to streamline the data input/queue flow process to allow the service to operate more efficiently. Additionally, it would generate usage reports and infographics to allow STUDYSmarter to anticipate trends in usage and ensure that the service is staffed appropriately to meet demand. 

## Requirements

### Stage 1 Functional Requirements 
The following are the core functional requirements for the first stage application

| Identifier    | Name          | Description |
| :---          | :---          | :---        |
| S1_FR1        | Login System  | The system should only allow SL to use the system. |
| S1_FR2        | Adding student to the queue and showing the queue | The system should allow SL to add students in the queue as well as show who is currently in the queue. |
| S1_FR3        | Consuming the queue | The SL should be able to assign SNS from the queue to a tutor and show the current SNS in session with a tutor. |
| S1_FR4        | Time display data | For S1_FR2 and S1_FR3, the system should show how long an SNS is waiting or in session with a tutor. |
| S1_FR5        | Remove an SNS in the queue | The system should allow removal of SNS in queue as per S1_FR3 or the drop-in session run out of time, and SNS needs to be removed from the queue. |

### Stage 2 Functional Requirements 
These are the main requirements for the data usage report. It is worth noting that the stage 2 requirement is a feature block of a “nice-to-have" and will only be implemented when there is extra time in the project. 

| Identifier    | Name          | Description |
| :---          | :---          | :---        |
| S2_FR1        | Collection of data usage | After a session, details such as the start time, the end time are recorded for data analytics (such as aggregation, computation can be done) |
| S2_FR2        | Data usage analytics | With collected data from S2_FR1, the data that is most interest is the visualisation that shows how many students use the service for different periods in the semester. |
| S2_FR3        | Daily usage report | A way to send a summarised usage report for a day. |
| S2_FR4        | At-a-glance usage infographic  | End of each week to summarise usage/waiting times/peak usage times/comparisons to previous weeks and/or semesters |

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
With the requirements and analysis of the current system, the decision of the team is to create a custom web application. The web application will be built with a MVC (Model-View-Controller) pattern using Flask (for API requests), SQL (for database solution), and Jinja Templating with core web technologies – HTML, CSS, and JavaScript (for user interface). The system will be deployed the in the UWA infrastructure. See below for the high-level solution architecture of the system. 

### Core Technologies 

The custom web application will aim to satisfy all the requirements in here along with the "Nice to haves" as they come up. The application will be built using the ...

#### API – Flask 
Flask is an easy-to-use Python web framework. This is chosen as the development team has a Python background and is the web framework used in CITS3403 – Agile Web Development. 

#### Database Solution – PostgreSQL 
SQL is a language that can be used to build and interact with database. The exact database management solution will be with PostgreSQL – a widely used and reliable database in the industry. 

#### User Interface – HTML, CSS, JS 
The core web technologies will be used for building the interfaces. No advanced framework will be used with concern to higher learning curve on top of the existing technologies being used. To aid with the design, the team will be using Bootstrap as a CSS framework to reduce the time needed for creating “good-looking” and intuitive interfaces. 

#### Deployment - Docker
Docker is a deployment technology that allows virtualization in a server to allow the packaging of software into containers for deployment. To satisfy NFR7 - Deployability, the web platform will use docker to allow the deployment through the SHL VPS Server.

Furthermore, Docker will be used for orchestration of different services in development to increase speed of development, and reduce inconsistency between developers devices (NFR3 - Maintainable and extensible).

Deployment will be done with docker containers in the UWA System Health Lab VPS. As part of NFR1, this deployment methodology will be within the UWA infrastructure (VPS and Cloudflare Proxy). 

#### Version and Quality Control 

The version and quality control will be facilitated using Git (a version control tool), and GitHub to facilitate peer reviewed code. 

#### Documentation - GitHub mkdocs
The documentation will be informally made in Microsoft Word documents hosted in OneDrive. However, for future maintainability purposes, these will be uploaded to GitHub along with the source code.  
    
#### Code Quality
The code quality will be ensured by peer reviews between the developers in the team.

#### Code Storage and Development Control
Git source control will be used, using the remote UWA System Health Lab organisational GitHub (NFR3 - Maintenace and Extensibility).

### Prototype
See the Prototype mentioned in [Figma Interface Prototype](../developer/frontend/figma_interface_prototype.md)
