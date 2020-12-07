# erp-to-cloud-microservice

The app is meant to provide working examples of 1C integration using webhook endpoint

## Requirements

- [nodejs](https://github.com/nodejs/node) - Node.js is an open-source, cross-platform, JavaScript runtime environment.
- [git](https://github.com/git/git) - Git is a fast, scalable, distributed revision control system.
- [ngrok](https://github.com/inconshreveable/ngrok) - Ngrok is a reverse proxy that creates a secure tunnel from a public endpoint to a locally running web service.
- [nodemon](https://github.com/remy/nodemon) - Nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Common setup

Clone the repo and install the dependencies.

        $ git clone https://github.com/yovchenko/erp-to-cloud-microservice.git
        $ cd erp-to-cloud-microservice
        $ npm install

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [dotenv](https://github.com/motdotla/dotenv) - Dotenv is a zero-dependency module that loads environment variables.
- [googleapis](https://github.com/googleapis/googleapis) - Node.js client library for using Google APIs.
- [cors](https://github.com/expressjs/cors) - substitute CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- [helmet](https://github.com/helmetjs/helmet) - Helmet helps you secure your Express apps by setting various HTTP headers.
- [pg](https://github.com/brianc/node-postgres) - Non-blocking PostgreSQL client for Node.js. Pure JavaScript and optional native libpq bindings.

## Getting started 

To start the express server, run the following

        $ npm run start:dev

## Running unit tests

Run `npm run test:server` to execute the unit tests via [Jest](https://jestjs.io).

## Application Structure
   .                 
    ├── docs                    
    ├── server 
    │    ├── dist               
    │    │    └── index.js        
    │    ├── source             
    │    │    ├── controller.ts   
    │    │    ├── erpDataExchange.ts
    │    │    ├── index.ts         
    │    │    ├── interfaces.ts   
    │    │    ├── model.ts        
    │    │    ├── routes.ts       
    │    │    ├── service.ts
    │    │    └── wrikeDataExchange.ts  
    │    └── tests               
    │        ├── erpDataExchange.spec.ts    
    │        ├── model.spec.ts              
    │        └── service.spec.ts            
    ├── .eslintignore           
    ├── .eslintrc 
    ├── .gitignore   
    ├── jest.config.js 
    ├── LICENSE
    ├── ngrok
    ├── package.json 
    ├── README.md
    ├── server.config.js 
    └── tsconfig.json

## Authentication

The app uses the OAuth 2.0 protocol for authorization. For details, please see [RFC6749, 4.1](https://tools.ietf.org/html/rfc6749#section-4.1).

## Deploy to Heroku
You can also deploy this app to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Author and Contributor list 
---------------------------
Volodymyr M. Yovchenko

All bugs and fixes can be sent to volodymyr.yovchenko@gmail.com
