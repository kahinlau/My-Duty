## Installation

Requires [Node.js](https://nodejs.org/) to run the server.

Requires [Docker](https://hub.docker.com/_/postgres) to run the database image.

Requires [Typescript](https://www.typescriptlang.org/) and [jestjs](https://jestjs.io/docs/getting-started).

```sh
npm install -g typescript
npm install -g jest
```

### For development environment

Install the dependencies and start the server.

```sh
npm install
npm run dev
```

### For production environment

Requires [Typescript](https://www.typescriptlang.org/).

```sh
npm install
NODE_ENV=production npm run start
```


### For running tests

```sh
npm run test
```

### Notes
1. A `duty` databases and a `duty` table will be created when the server is started in development environment.
2. A `dutymock` databases and a `duty` table for mocking purpose will be created when the tests are being ran in development environment.
3. For testing purpose, two default dummy records will be insert into the mock data table.

## Good to have in the future
1. Support "Delete" duty.
2. Support pagination.
3. Support user authentication.
