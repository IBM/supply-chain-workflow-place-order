# supply-chain-workflow-place-order

### Description

This project contains the Place New Order workflow, which can be integrated into [IBM Supply Chain Intelligence Suite](https://www.supply-chain.ibm.com/launch/) (SCIS) by using [IBM Business Automation Workflow](https://www.ibm.com/docs/en/baw) (BAW) technology. This sample guides your supply chain through an at-risk inventory replenishment by placing a new order. The sources and reference material contained within the sample that can be imported to the target environment are provided in this project's release page.

### Project structure

- [/src/place-new-order.js](src/place-new-order.js) -- contains the javascript methods used in the sample process
- [/src/config/data-mappings.yaml](src/config/data-mappings.yaml) -- contains the data mapping configurations used in the sample process.
- [/src/images/*](src/images/*) -- contains the screen caps of the business forms used in the sample process.

### Place New Order Workflow introduction

Before importing and configuring the workflow, see the [overview of the place new order workflow](./tutorial.md).

### Importing the workflow into BAW

The workflow snapshot can be downloaded from this project's release page in .twx format and imported into your BAW target environment. See the [BAW documentation for importing samples](https://www.ibm.com/docs/en/baw/20.x?topic=projects-importing-exporting) to import projects from other IBM® Workflow Center repositories.


### Configuring the workflow in BAW
- **Add toolkit**
Toolkits are containers whichs are used to store artifacts that are shared across applications. Artifacts in an application are available only to that application. To make artifacts available across applications, add them to a toolkit and add the toolkit as a dependency to the application. 
In the Place New Order workflow, The `SCIS Toolkit` must be added. See the [instructions on how to add a toolkit dependency into BAW](https://www.ibm.com/docs/en/baw/20.x?topic=mp-creating-changing-deleting-toolkit-dependency-in-designer-view) to add your toolkit.


- **Managing workflow project access**
Users who want to visit the workflow process must have proper access. See [managing access to workflow projects guide](https://www.ibm.com/docs/en/baw/19.x?topic=repository-managing-access-workflow-projects) to learn how to add or remove user access.


- **Integrating email within a workflow**
In the workflow sample, email is used to send event notifications to the manager. To use email service within a workflow, there must be a working SMTP server which can communicate with the BAWoC environment. The recommended email notification service for IBM Cloud is [SendGrid](https://sendgrid.com). The native BAW mail service is also supported and can be used directly, but it cannot set authentication information within it. 
In the sample, the SendGrid SMTP service is used. The mail service is implemented with Java code and the Java package is integrated into the SCIS toolkit. The mail service is exposed as an external service in the toolkit and toolkit exposed it to workflow as a service flow. To invoke the mail service, the user must add the mail configurations within toolkit, such as the host, user name, password, from, to, and all other relevant mail configurations.
