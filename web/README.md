# Alcarin Webpage

Responsive webpage interface for Alcarin project.

## Setup

1. Copy `.env.template` file to `.env` and adjust `.env` to your needs
2. Install deps `docker-compose run --rm web npm i`
3. Run `docker-compose up web`. It can take some time the first time you run the app
5. Visit `http://localhost:8080`

## Tech stack
 - [TypeScript](https://www.typescriptlang.org/)
 - [Snowpack](https://www.snowpack.dev/)
 - [React](https://reactjs.org/)
 - [Redux](https://react-redux.js.org/) with [Redux Toolkit](https://redux-toolkit.js.org/)
 - [Bulma](https://bulma.io/)

## Linting

The project use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for linting.
To do general check of your code run `npm run check-all`.
You should configure your environment to show you linting errors in development time.

## Available Scripts

If you have problems with running the scripts directly, run them inside `web` container,
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

### npm run build

Builds a static copy of yor site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like "@snowpack/plugin-webpack" or  "@snowpack/plugin-parcel" to your `snowpack.config.json` config file.
