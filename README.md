# NC News Backend

A RESTful api which allows CRUD requests for different data

## Description

Link to the hosted API: https://rickys-nc-news-be.onrender.com/

This is a Backend Solo Project to build a a Forum API. There are preset topics that have can have multiple articles for each topic. And under each article users can leave comments in the article and upvote or downvote the article.

## Test Setup guide

### Dependencies

Jest, pg, pg-format, dotenv, express, supertest and jest extended

### Setup procedures

Before starting the test. Please set up the .env file for own tests. It is required for dotenv to setup the config for connection to the database.

- a .env.test file is required for specifying database for test.
- a .env.development is required for specifying database for development.

Then please set up the the database by running "setup-dbs" script. Seeding for test data is included in the app.test.js file.

The file will be accessed by connection.js through pg method.
