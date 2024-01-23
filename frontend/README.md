## Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Requires a running server (http://localhost:5001) to save the data

### For development environment

Install the dependencies and start the server for development.

```sh
npm install
npm run start
```

### For production environment

```sh
npm install
npm run build
```
After the build, use any tool to serve the content.
Example using [PM2](https://pm2.keymetrics.io/):
```sh
(cd build && pm2 serve --port 3011 --no-daemon --spa)
```

### For running tests

```sh
npm run test
```

## Good to have in the future
1. Support "Delete" duty.
2. Support pagination.
3. Support user authentication.
4. Add some indications (pop-up window/error page) to display errors
5. Maintain the order of items after refetching
