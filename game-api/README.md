# Apollo API

Apollo API serve as backend for Apollo Chrome extension.

## Installation

You need [docker](https://www.docker.com/) platform installed and configured in
your environment.

1. Copy `.env.template` file to `.env` and adjust `.env` to your needs and configure:
   - [pagekite](#pagekite)
   - [Gmail API access](#gmail-api-access)
   - [PubSub](#listening-to-email-messages-pubsub)
2. Install deps `docker-compose run --rm api npm i`
3. Run `docker-compose up -d`. It can take some time the first time you run the app
4. Once the database container starts, run `docker-compose run --rm api npm run typeorm migration:run`.
5. Visit http://localhost:8080 and your [pagekite](#pagekite) address as well, you should see a list of available endpoints in the JSON format

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

## Gmail API access

1. Go to the [Google Cloud Console](https://console.cloud.google.com/projectselector2/home/dashboard) and create a new project.

2. After you've created a project in Google Cloud Console let's enable a Gmail API for it. Go to [Google API library](https://console.cloud.google.com/apis/library/gmail.googleapis.com?q=gmail), ensure that you see a correct project name at the top bar (near `Google Cloud Platform`), then click `ENABLE`. You should see loader for a while and the Gmail API dashboard should show up.

3. Create credentials for the Gmail API. Click `Credentials` on the left and then click on the `Create Credentials` button and from the dropdown choose `OAuth Client ID`.

4. Then you should see warning `To create an OAuth client ID, you must first set a product name on the consent screen`. So, click `Configure consent screen`, choose `Internal` user type and click `Create`.

5. In the `OAuth consent screen` form type something into `Application Name` (e.g. "Apollo API") because it's required field.

6. With that done go back to the Gmail API credentials and click `Create Credentials` and from the dropdown choose `OAuth Client ID`, and now you should be able to choose `Web Application` type. Then type `Apollo API` in the name field.

7. Next, we need to configure restrictions. Ensure you went through all steps from [pagekite](#pagekite) section. Please add following URIs to the `Authorized redirect URIs`:

```
{https://your-pagekite-domain.here}/auth/oauth-callback/user
{https://your-pagekite-domain.here}/auth/oauth-callback/owner
{https://your-pagekite-domain.here}/auth/oauth-callback/mailbox
{WIZARD_APP_URL}/sign-up
```

8. Click `Create`. Now you will see a modal with the credentials. Copy client id into `.env` under the `GOOGLE_CLIENT_ID` key and secret under the `GOOGLE_CLIENT_SECRET` key.
9. Enable the Google People API.

You can find more information in the Gmail API docs: [Gmail API: Implementing Server-Side Authorization](https://developers.google.com/gmail/api/auth/web-server)

To learn more about used authorization method check [googleapis documentation](https://github.com/googleapis/google-api-nodejs-client#oauth2-client).

## Listening to email messages: PubSub

We use google [Cloud Pub/Sub Api](https://cloud.google.com/pubsub/overview) to
listen for changes in users mailboxes. We need it to broadcast shared mailbox
messages between other registered accounts (
https://developers.google.com/gmail/api/guides/push). To set up pub/sub go through the following steps:

1. Go to [Google Cloud Pub/Sub dashboard](https://console.cloud.google.com/cloudpubsub/topic/)

2. Create a new topic with the id let's say: `apollo-topic`. Then go to the topic details, copy `Topic name` (it should be similar to this: `projects/apollo-268510/topics/apollo-topic`) and paste it to the `.env` file under `PUB_SUB_TOPIC`

3. Create a new subscription with id: `apollo-subscription` and assign it the previously created topic (`Select a Cloud Pub/Sub topic`). Choose `Push` delivery type and as an endpoint url you should provide your public ip/domain with SSL support (see [Pagekite](#pagekite) section) with `/pubsub/callback` route at the end. So the whole URL should look like this `https://somedomain.pagekite.me/pubsub/callback`
   **_Note that the same address should provided to `src/config/local.config.ts` file in the gmail-addon directory!_**
   Next make sure to check the "Enable authentication" checkbox. This will display a "Service account" select. Now you need to configure a new service account - a special account that will be used by PubSub to authenticate itself when pushing messages to our API. The select box should contain a hyperlink "Learn how to create a service account":

   - Follow the instructions there for "Console": Open the Service Accounts page, select your project and click "Create service account".
   - Fill the form as you please - none of the service account details are crucial for our needs.
   - Continue to "Grant this service...". There "Add another role" - find "Pub/Sub Publisher".
   - Skip through "Grant users access" and finish creation of the service account.
   - Fill the `PUB_SUB_SERVICE_ACCOUNT_EMAIL` env with it's email and the `PUB_SUB_SERVICE_ACCOUNT_ID` with it's unique id.
   - Go back to the subscription edit window and refresh it. Your service account should now be selectable under "Enable authentication" - select it.
   - You might get a warning regarding how PubSub requires an account with `role/iam.serviceAccountTokenCreator` - grant these permissions as well. Create the subscription.

4. Then copy subscription name to the `.env` under `PUB_SUB_SUBSCRIPTION` key.

5. You need to grant publish rights on your topic to Gmail API. Go to your topic settings, click on the dots icon and from the dropdown select `View permissions`. Next, click on the `Add Member` button and type into `New members` field: `gmail-api-push@system.gserviceaccount.com`. Select role `Pub/Sub` -> `Pub/Sub Publisher` and save the new member. You should see newly created role in the role list.

## Pagekite

Pagekite is service which allows for making local servers public, so that you can receive requests to your machine. In the terminal type:

```sh
curl -o ~/pagekite.py https://pagekite.net/pk/pagekite.py
python ~/pagekite.py 8080 {yourname}.pagekite.me
```

In the place of `{yourname}` you should type unique name for your pagekite subdomain. Then you will see few prompts from the pagekite CLI and afterwards your proxy should be good to go.

Do replace URL_BASE env with your newly created pagekite subdomain(remember to leave the `/` at the end).

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
Once API has started, swagger ui should be available on the `/api-docs` endpoint.

All requests are validated by the OpenAPI definition, so you can be pretty sure that the documentation is actual.
All responses are validated by the OpenAPI definition when you run tests.

You can also find some specific docs in the `docs` directory.

## JSON API specification

We use [JSON API](https://jsonapi.org/) to structure our api responses. Be sure
to have at least basic understanding before api manipulation.

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

## Deploying

For deployin there is aws server with rds database prepared.
You need to have access to the server. If you have it, use
`./bin/deploy` script and it's all you need.

API will be publish on https://dev.apollo.codequest.com url.
