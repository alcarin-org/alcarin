# Apollo API

Apollo API serve as backend for Apollo Chrome extension.

## Installation

You need [docker](https://www.docker.com/) platform installed and configured in
your environment.

1. Copy `.env.template` file to `.env` and adjust `.env` to your needs and configure:
  * fill `AUTH_KEY=` according to the instruction in the file
2. Install deps `docker-compose run --rm api npm i`
3. Run `docker-compose up -d`. It can take some time the first time you run the app
5. Visit `http://localhost:8090/healthz`. You should get empty response with `200` status code

## Tech stack
 - [TypeScript](https://www.typescriptlang.org/)
 - [Express](https://expressjs.com/)
 - [TypeORM](https://github.com/typeorm/typeorm)
 - [PostgreSQL](https://www.postgresql.org/)
 - [Redis](https://redis.io/)

## Useful commands

```bash
# You can run any command inside the api
docker-compose run --rm api {cmd}
# e.g.
docker-compose run --rm api bash

# to see logs of api / postgres
docker-compose logs -f api
docker-compose logs -f db
```

## Available Scripts

Scripts need to be run inside `api` container:
```bash
docker-compose run --rm web {cmd}
```

### npm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

### npm run lint
Lint the codebase.

### npm run check-types

Check the codebase for typings issues.

### npm run check-all

Check the code for all aspects mentioned above.

## Database

[PostgreSQL](https://www.postgresql.org/) is used as database engine.
[TypeORM](https://typeorm.io/) is used as ORM.
To configure database connection modify your `.env` file. Details: https://typeorm.io/#/using-ormconfig/using-environment-variables

## Queue

We use queue mechanism to postpone some of the system work, make it more secure and move it from request context.

You need have at least one run queue worker listening on the same redis instance like the system. Locally, the queue worker is run automatically when you call:

```bash
docker-compose up -d
```

mentioned in [Installation](#installation) section.

UI for the queue is also available under `/queue` endpoint. For more about it check [bull-arena](https://github.com/bee-queue/arena#readme). Please provide credentials for the queue UI in the `.env` file, defaults are: `admin/admin`.

## Tests

There should be integration tests for **every** endpoint.
Additionally, goal is to have unit tests for **critical**, **non-trivial** modules
Run tests by `npm test`.
We use `mocha` as test runner, `chai` for assertions, `sinon` and `sinon-spies` for spies and `supertest` to simulate api requests.

## Linting

The project use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for linting.
To do general check of your code run `npm run check-all`.
You should configure your environment to show you linting errors in development time.

## Documentation

We use [OpenAPI](./openapi.yml) to document our API. All endpoints should be described there.

All requests are validated by the OpenAPI definition, so you can be pretty sure that the documentation is actual.
All responses are validated by the OpenAPI definition when you run tests.

## CLI

You can run TypeScript cli console in context of the Apollo API by running this command:

```
npm run cli
```

You should have access to `TypeORM` `connection` and `manager` variables that allow you to connect and manipulate database in a typical manner.

All entities should be available on public scope.

All TypeORM repositories should be available on `repos` scope.

https://typeorm.io/#/connection

Check `bin/cli.ts` file to see what more is available in the context or to provide other features.

Example usage:

```ts
await manager.findOne(User);
// '_' is result of last command
console.log(_.email);
```
