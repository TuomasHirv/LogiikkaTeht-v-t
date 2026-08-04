# Database

- Previously only used env vars of the docker container.
- After hosting the connection string is instead preferred for opening a pool.
- It returns a query option and an end option mostly for tests that have to close the pool at the end.

- I decided to use a postgres docker database (for development) since i am used to it and enjoy it more than relational databases.

## initDb.js

- The file runs on startup and on tests.
- It simply runs all table creations in a row. If an error occurs it breaks. If this runs from exprApp.js it also exits the process.

## dbFunc.js

- Used for larger dbQueries. It is exactly what it says it is. It holds the functions that other apps call to get information from the database.
- It imports the query from the db.js.
- It would be useful to restrict all queries to the database directory. But this will be done in later projects.
