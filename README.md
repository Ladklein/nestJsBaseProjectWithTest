## Description

Project NestJs who launch with docker.

## Start in local

```bash
$ docker-compose -f docker-compose.yml up --build
```

## Running test

1. Prerequisites:
```bash
npm install

# only e2e test
docker-compose -f docker-compose.yml up --build
```

2. start test:

```bash
# functional test 
$ npm run test

# functional test with watch mode
$ npm run test:watch

# e2e test
$ npm run test:e2e

# e2e test with watch mode
$ npm run test:e2e:watch
```
## Migration:

```bash
# generate migration
npm run migration:generate --name=name --user="user" --db="user" --password="password" --hostname="postgres"

# create a empty migrate file 
npm run migration:create --name=name

# apply migrate file
npm run migrate:run --user="user" --db="user" --password="password" --hostname="postgres"

# revert migration
npm run migrate:revert --user="user" --db="user" --password="password" --hostname="postgres"
```

## How works the e2e test?
the e2e use a database in container docker. We want test reading and writing in the database 

## How works the generate migration?
we use typeOrm library to generate a migrate file. TypeOrm read the entity file.