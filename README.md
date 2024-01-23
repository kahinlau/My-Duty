## Installation

Requires [Node.js](https://nodejs.org/) to run the server.

Requires [Docker](https://hub.docker.com/_/postgres) to run the database image.

### Set up

After installing Docker on your PC, run the database Docker image.

```sh
docker pull postgres
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

Go to the server.

```sh
cd backend
```

Go to the frontend.

```sh
cd frontend
```

You can find more information in the `README.md` inside each project