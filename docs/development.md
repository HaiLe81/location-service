# Setup and development

- [Setup and development](#setup-and-development)
  - [First-time setup](#first-time-setup)
  - [Installation](#installation)
    - [Database](#database)
    - [Configuration](#configuration)
    - [Dev server](#dev-server)
  - [Generators](#generators)
  - [Docker](#docker)
    - [Docker installation](#docker-installation)
    - [Docker-compose installation](#docker-compose-installation)
    - [Run](#run)

## First-time setup

Make sure you have the following installed:

- [Node](https://nodejs.org/en/) (v20.5.0)
- [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (at least 1.0)

## Installation

```bash
# Install dependencies from package.json
npm install
```

> Note: don't delete package-lock.json before installation

### Database

> Note: Awesome NestJS Boilerplate uses [TypeORM](https://github.com/typeorm/typeorm) with Data Mapper pattern.

### Configuration

Before start install PostgreSQL and fill correct configurations in `.env` file

```env
DATABASE_HOST=$DATABASE_HOST
DATABASE_PORT=$DATABASE_PORT
DATABASE_USERNAME=$DATABASE_USERNAME
DATABASE_PASSWORD=$DATABASE_PASSWORD
DATABASE_NAME=$DATABASE_NAME
DATABASE_SSL=$DATABASE_SSL
DATABASE_LOGGING=$DATABASE_LOGGING
NODE_ENV=$NODE_ENV
HOST=$HOST
PORT=$PORT
API_VERSION=$API_VERSION
ENABLE_SEEDING=$ENABLE_SEEDING
SWAGGER_VERSION=$SWAGGER_VERSION
```

Some helper script to work with database

```bash
# To create new migration file
npm run migration:create --name="migration_name"

# Generate migration from update of entities
npm run migration:generate --name="migration_name"

# To revert migration file
npm run migration:revert

# To run migration
npm run migration:run
```

## Generators

This project includes generators to speed up common development tasks. Commands include:

> Note: Make sure you already have the nest-cli globally installed

```bash
# Install nest-cli globally
npm install -g @nestjs/cli

# Generate a new service
nest generate service users

# Generate a new class
nest g class users

```

> Note: if you love generators then you can find full list of command in official [Nest-cli Docs](https://docs.nestjs.com/cli/usages#generate-alias-g).

### Docker installation

Download docker from Official website

- Mac <https://docs.docker.com/docker-for-mac/install/>
- Windows <https://docs.docker.com/docker-for-windows/install/>
- Ubuntu <https://docs.docker.com/install/linux/docker-ce/ubuntu/>

### Docker

#### Build

```bash
  docker build .
```

#### Run

```bash
  docker build -t location-service .
```

Open terminal and navigate to project directory and run the following command.

```bash
docker run -e env1=value -e env2=vaue2 -p 3000:3000 -p 5432:5432 location-service
```
