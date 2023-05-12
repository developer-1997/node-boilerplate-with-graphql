## Boilerplate For Node.js And React With Graph

Objective: The task is to build a web application that allows users to see book list, update rating check mybook page.

this project was bootstrapped by [Create React App](https://create-react-app.dev/)

Source Code:

- Frontend+Backend: github - https://github.com/akhil2109kumar/book-library

Features:

- User can create account
- User can login
- User can logout
- Forget password
- Change password

Tech Stack [FrontEnd]
[Create React app] for development infrastructure
[Javascript] for development
[Bootstrap] for styles
[React] for UI components
[apolo-client, graphql] for interacting with backend APIs
[Formik] for handling form
[react-redux] for global state

Tech Stack [BackEnd]

[Javascript] for development
[Nodejs] for backend
[JWT] for token authentication
[graphql] for backend APIs
[apollo-server-express] for server
[mongoDB] for database

Environment Variables [.env][Frontend]
environment variable is set -

REACT_APP_API_URL=http://localhost:8000/graphql
REACT_APP_ENVIROMENT=dev

REACT_APP_BACKEND_URL=http://localhost:8000/

[Environment Variables] [.env][backend]

NODE_ENV=development
PORT=8080
MONGODB_URI_LOCAL=mongodb://localhost:27017/book-library

JWT_ACCESS_TOKEN_EXPIRES_IN=60
JWT_REFRESH_TOKEN_EXPIRES_IN=60
JWT_ACCESS_PRIVATE_KEY=LS0tLS1CRUdJTiBSU0EgUFJJVkFURS
JWT_ACCESS_PUBLIC_KEY=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tL
JWT_REFRESH_PRIVATE_KEY=LS0tLS1CRUdJTiBSU0EgUFJJVkF
JWT_REFRESH_PUBLIC_KEY=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0L

JWT_ACCESS_TOKEN_EXPIRES_IN=15
JWT_REFRESH_TOKEN_EXPIRES_IN=15

EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_FROM=

Local Setup Steps [BackEnd-Frontend]

[Before local setup]
1.Mongo database setup on local and URL set on backend env file.

$ git clone https://github.com/akhil2109kumar/book-library
$ cd book-library
$ npm run install-client --force
$ npm install --force
$ npm start

—----------------------------------------------------------------------------------------------------------------------------
