# backend-collection-nodejs-1

### Version: release-1.0

### Summary:
This is Nodejs backend number 1 from my backend collection project. This backend is a REST API for CRUD worker data build with Express framework and PostgreSQL database, also tested with Jest framework.

### Requirements:
1. nodejs (tested: v14.17.5)
2. npm (tested: v6.14.14)
2. postgresql (tested: v13.4)

### Steps to run the backend server:
1. install all requirements
2. clone repository
3. at repository root directory (same level as README.md):
    1. switch to branch release-1.0 with `git checkout release-1.0`
    2. install required node modules with `npm ci`
    3. create file .env with contents:

    ```
    EXPRESS_IP="<server express ip address, example: 127.0.0.1>"
    EXPRESS_PORT=<server express port, example: 8000>

    POSTGRES_USER="<server postgres user name, example: postgres>"
    POSTGRES_PASSWORD="<server postgres user password>"
    POSTGRES_DATABASE="<server postgres database name, example: backend_collection_nodejs_1>"
    POSTGRES_DATABASE_TEST="<server postgres testing database name, example: backend_collection_nodejs_1_test>"
    POSTGRES_HOST="<server postgres host, example: localhost>"
    POSTGRES_PORT=<server postgres host, example: 5432>

    # NODE ENV, change it to "test" if you want to do testing 
    # so it will use POSTGRES_DATABASE_TEST,
    # otherwise it will use POSTGRES_DATABASE
    #
    # But, because Jest was used as testing framework, 
    # Jest will automatically change NODE_ENV to "test" when testing
    NODE_ENV="<development or production or test>" 
    ```

    4. create postgresql databases with name same as in .env file
    5. test server first with `npm test` to make sure server works fine
    6. run server with `npm start`

### License:
This project is MIT license, so basically you can use it for personal or commercial use as long as the original LICENSE.md included in your project.
