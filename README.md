# DreamDatesBackEnd

## mirgrations

    1 - push to heroku

    git push heroku main

    2 - run migrations

    heroku run knex migrate:latest

        alternative
        npx knex migrate:latest --knexfile ./knexfile.js

    3 - run seeds

    heroku run knex seed:run
