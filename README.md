## NC News Seeding

Link to the hosted API: https://rickys-nc-news-be.onrender.com/

This is a Backend Solo Project to build a a Forum API. There are preset topics that have can have multiple articles for each topic. And under each article users can leave comments in the article and upvote or downvote the article.

# Test Setup guide

Jest is the api I used for testing. Requried dependencies are pg,pg-format, dotenv, express, supertest and jest extended.

Before starting the test. Please set up the .env file for own tests.

- a .env.test file is required for specifying database for test.
- a .env.development is required for specifying database for development.

Then please set up the the database by running "setup-dbs" script. Seeding for test data is included in the app.test.js file.

The file will be accessed by connection.js through pg method.
