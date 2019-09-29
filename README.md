# JWT Authentication

## Technologies

- Typescript
- GraphQL
- TypeGraphQL
- TypeORM
- PostgreSQL
- React
- Redux
- Apollo (with GraphQL Code Generator)

## Backend

1. Setup a GraphQL Server using TypeGraphQL and TypeORM
2. Register a user
3. Login and create access / refresh tokens
4. Authenticated mutation/queries
5. Refresh the token
6. Revoke tokens for a user

> defined your own `.env` before start server

## Frontend

1. Setup Apollo GraphQL Code Generator
2. React Router
3. Register/Login
4. Persisting session on refresh
5. Handling expired tokens
6. Fetching current user in header, etc...

> execute `$ yarn gen` with started server
