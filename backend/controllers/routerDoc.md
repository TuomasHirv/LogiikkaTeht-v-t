# USER ROUTER:

Uses: bcrypt and jsonwebtoken
Returns: 401 on incorrect input. 400 if the username is taken when registering.
On correct registration returns a signed token to frontend

# TASK ROUTER:

- Currently there is no way to POST new tasks to the database. Instead tasks are created with npm run seed. (this is done in database directory)
- This router can return tasks by modudle, all tasks or the task count grouped by module_name
- Currently this router directly queries from the database. The queries are simple so its fine.
- In the future maybe this should be in the dbFunc file.

# ANSWER ROUTER:

## Answer router is more complex since it works for all modules and routes the userAnswer to correct validators.

### "/:id", post

- First we get the ID of the task that the user posts to.
  -> That is plugged in to dbFunc.getAnswerAndModule that returns module specific information.
  -> The module_name that we get from database is compared agains constants to pick the correct helper/handler.
  -> In answerHelper.js all helper funcs use the same boilerplate function, but again plug different values into it.
  MOST importantly evalFunc (created in the helperFunction itself) and evalParams that are then plugged into the evalFunc.
  -> Evaluation should always return {accepted: boolean, feedback: string}.
  -> Answer is then inserted to database and response is given to the frontend.
