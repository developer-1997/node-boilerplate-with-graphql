## Boilerplate For Node.js With Graph

Source Code:

- Frontend: github - https://github.com/developer-1997/node-boilerplate-with-graphql

Features:

- User can create account
- User can login
- User can logout
- Forget password
- Change password

Tech Stack [BackEnd]

[Javascript] for development
[Nodejs] for backend
[JWT] for token authentication
[graphql] for backend APIs
[apollo-server-express] for server
[mongoDB] for database

[Environment Variables] [.env][backend]

NODE_ENV=development
PORT=8080
MONGODB_URI_LOCAL=mongodb://localhost:27017/<NAME>

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

$ git clone https://github.com/developer-1997/node-boilerplate-with-graphql
$ cd bnode-boilerplate-with-graphql
$ npm install --force
$ npm run dev

—----------------------------------------------------------------------------------------------------------------------------
