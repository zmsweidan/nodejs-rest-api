# Introduction 
A Node.js API template that uses Express, Mongoose and OpenAPI (Swagger 3.0).

# Getting Started
1.	Run `npm install`
2.	Adjust `.env` file for running locally and/or configure other environment files
    - `.env.TEST` = for unit testing
    - `.env.DEV` = deployment on development server
    - `.env.PROD` = deployment on production server
    you can add `.env.___` configurations as needed (see ENV section)
3.	Run `npx nodemon` or `npm run start`(node) to start the server locally
4.	Make API calls to http://localhost:3000/api/v1/ or browse swagger http://localhost:3000/swagger/v1/
5.  Run `npm run tests` to run unit tests

# Folder Structure
- `auth` authentication and authorization related modules
- `controllers` express route controllers corresponding to API end points
- `data` locally stored data files e.g. static json data
- `db` database connections
- `models` mongoose models
- `node_modules` npm packages
- `swagger` swagger related files: modify the components section to update the generated swagger doc ('swagger-doc.json')
- `test` unit test suite which includes example api & schema tests as well as generated reports
- `utils` commmonly used utility modules, add more as needed

# Config Files
- `.env.___` configurations for different environments
- `app.js` sets up the express app (cors, auth, swagger, routes etc.)
- `build.bat` generic batch build script (not env specific)
- `package.json` Manages npm scripts and modules
- `server.js` initialises the server

# ENV Files
- Create a new .env.___ to suit your use-case (PREM, PROD, etc)
- You must create a new script to use your new .env.___ 
    - Format: `"script_name": "set NODE_ENV=ENV_NAME&&additional commands here"`
    - Chain additional commands with &&
    - See `"scripts"` under `package.json` for more examples 
